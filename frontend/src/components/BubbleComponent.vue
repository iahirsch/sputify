<template>
  <div class="bubble-container">
    <svg ref="svgRef" class="bubble-svg"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import {onMounted, onBeforeUnmount, ref, watch, nextTick} from 'vue';

export default {
  name: 'BubbleComponent',
  props: {
    analysis: {
      type: Object,
      default: () => ({})
    },
    playing: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const defaultAnalysis = {
      tempo: 100,
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5,
      color: 'rgb(180, 180, 180)',
      login: false,
    };

    function getAnalysis() {
      return {...defaultAnalysis, ...(props.analysis || {})};
    }

    let detail = 20;
    const radius = 100;
    const svgRef = ref(null);
    let toZero = false;
    const data = ref(generateData());
    let updateInterval;

    let color = getColor();
    const bubbleConfigs = [
      {baseColor: color.replace(/[\d.]+\)$/g, '0.1)'), scale: 3, zIndex: 0},
      {baseColor: color.replace(/[\d.]+\)$/g, '0.3)'), scale: 1.4, zIndex: 1},
      {baseColor: color.replace(/[\d.]+\)$/g, '0.6)'), scale: 1, zIndex: 2},
      {baseColor: color.replace(/[\d.]+\)$/g, '0.8)'), scale: 0.6, zIndex: 3},
    ];

    function generateData() {
      const analysis = getAnalysis();
      let data;
      if (toZero || !analysis.energy) {
        data = Array.from({length: detail}, () => ({value: 0}));
      } else {
        data = Array.from({length: detail}, () => ({
          value: Math.random(0, analysis.energy)
        }));
      }
      toZero = !toZero;
      return data;
    }

    function initializeVisualizer() {
      clearInterval(updateInterval);
      if (props.playing) {
        updateInterval = setInterval(updateVisualizer, getTempoTimeout());
      }
      updateBubbleColor();
    }

    function createSvg() {
      const svg = d3.select(svgRef.value);
      return svg;
    }

    function createCurve(svg, data, angleScale, radiusScale, radius, color) {
      const lineGenerator = d3.lineRadial()
          .angle((d, i) => angleScale(i))
          .radius(d => radius + radiusScale(d.value))
          .curve(d3.curveCardinalClosed);

      const pathData = lineGenerator(data);

      svg.selectAll("path").remove();
      svg.append('path')
          .attr('d', pathData)
          .attr('fill', color)
          .attr('stroke', 'none');
    }

    function createGradient(svg, color, id) {
      const defs = svg.select("defs");

      defs.select(`#${id}`).remove();

      const gradient = defs.append("radialGradient")
          .attr("id", id);

      const colorOpacity = parseFloat(color.match(/[\d.]+\)$/g)[0].slice(0, -1));

      gradient.append("stop")
          .attr("offset", "40%")
          .attr("stop-color", color.replace(/[\d.]+\)$/g, `${colorOpacity * 0.1})`));
      gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", color.replace(/[\d.]+\)$/g, `${colorOpacity})`));
    }

    function createBubbles() {
      const svg = createSvg();
      const analysis = getAnalysis();
      svg.append("defs");

      bubbleConfigs.forEach((config, index) => {
        const gradientId = `gradient-${index}`;
        createGradient(svg, config.baseColor, gradientId);

        const bubbleGroup = svg.append("g")
            .attr("class", `bubble bubble-${index}`)
          .attr("transform", analysis.login ? `translate(${window.innerWidth / 2}, ${window.innerHeight * 0.9}) scale(${config.scale})` : `translate(${window.innerWidth / 2}, ${window.innerHeight / 2}) scale(${config.scale})`)
            .style("z-index", config.zIndex);

        const angleScale = d3.scaleLinear().domain([0, data.value.length]).range([0, 2 * Math.PI]);
        const radiusScale = d3.scaleLinear()
            .domain([0, d3.max(data.value, d => Math.abs(d.value)) || 1]);

        createCurve(bubbleGroup, data.value, angleScale, radiusScale, radius, `url(#${gradientId})`);
      });
    }

    function updateBubbleColor() {
      const svg = d3.select(svgRef.value);
      const bubbleGroups = svg.selectAll('.bubble')

      const colors = getColor();

      bubbleConfigs[0].baseColor = colors.replace(/[\d.]+\)$/g, '0.15)');
      bubbleConfigs[1].baseColor = colors.replace(/[\d.]+\)$/g, '0.3)');
      bubbleConfigs[2].baseColor = colors.replace(/[\d.]+\)$/g, '0.7)');
      bubbleConfigs[3].baseColor = colors.replace(/[\d.]+\)$/g, '0.9)');


      bubbleGroups.each(function (_, index) {
        const bubbleGroup = d3.select(this);
        const gradientId = `gradient-${index}`;

        createGradient(svg, bubbleConfigs[index].baseColor, gradientId);

        bubbleGroup.select('path')
            .attr('fill', `url(#${gradientId})`);
      });
    }

    function getColor() {
      const analysis = getAnalysis();
      const {valence, energy, danceability} = analysis;
      if ((valence === 0 && energy === 0 && danceability === 0) || analysis.login) {
        return `rgba(100, 100, 100, 1)`; // Gray
      }
      const rgb = (analysis.color || '').match(/\d+/g);
      if (!rgb || rgb.length < 3) {
        return `rgba(180, 180, 180, 1)`;
      }
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
    }

    function updateVisualizer() {
      const analysis = getAnalysis();
      data.value = generateData();

      const svg = d3.select(svgRef.value);
      const angleScale = d3.scaleLinear().domain([0, data.value.length]).range([0, 2 * Math.PI]);
      const radiusScale = d3.scaleLinear()
          .domain([0, d3.max(data.value, d => Math.abs(d.value))])
          .range([0, radius]);

      svg.selectAll('.bubble').each(function () {
        const bubbleGroup = d3.select(this);
        const lineGenerator = d3.lineRadial()
            .angle((d, i) => angleScale(i))
            .radius(d => radius + radiusScale(d.value))
            .curve(d3.curveCardinalClosed);

        const pathData = lineGenerator(data.value);

        bubbleGroup.select('path')
            .transition()
            .duration(getTempoTimeout() * (1 / Math.max(analysis.energy, 0.1))) // Adjust duration based on energy
            .ease(d3.easeLinear)
            .attr('d', pathData);
      });
    }

    function getTempoTimeout() {
      const analysis = getAnalysis();
      if (analysis.tempo !== 0) {
        if (analysis.energy < 0.5) {
          return 30000 / analysis.tempo * 2;
        } else {
          return 30000 / analysis.tempo;
        }
      } else {
        return 30000;
      }
    }

    watch(
        () => [props.analysis],
        () => {
          initializeVisualizer()
        },
        {deep: true, immediate: true}
    );

    watch(() => props.playing, () => {
      clearInterval(updateInterval);
      if (props.playing) {
        updateInterval = setInterval(updateVisualizer, getTempoTimeout());
      }
    });

    onBeforeUnmount(() => {
      clearInterval(updateInterval);
    });

    onMounted(() => {
      nextTick(() => {
        createBubbles();
        setTimeout(() => {
          d3.select(svgRef.value).selectAll('.bubble').remove();
          createBubbles();
        }, 1000);
        window.addEventListener('resize', () => {
          d3.select(svgRef.value).selectAll('.bubble').remove();
          createBubbles();
        });
      });
    });

    return {
      svgRef,
      data,
    };
  },
};
</script>

<style scoped>
.bubble-container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
}

.bubble-svg {
  width: 100vw;
  height: 100vh;
}
</style>