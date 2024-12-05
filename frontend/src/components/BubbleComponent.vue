<template>
  <div class="bubble-container">
    <svg ref="svgRef" class="bubble-svg"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

export default {
  name: 'BubbleComponent',
  props: {
    analysis: {
      type: Object,
      required: true
    },
    playing: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    let detail = 20;
    const radius = 100;
    const svgRef = ref(null);
    let currentSection = 0;
    let toZero = false;
    const data = ref(generateData());
    //let updateTimeout;
    let updateInterval;
    let startTime;
    let remainingTime;

    let color = getColor();
    const bubbleConfigs = [
      { baseColor: color.replace(/[\d.]+\)$/g, '0.1)'), scale: 3, zIndex: 0 },
      { baseColor: color.replace(/[\d.]+\)$/g, '0.3)'), scale: 1.4, zIndex: 1 },
      { baseColor: color.replace(/[\d.]+\)$/g, '0.6)'), scale: 1, zIndex: 2 },
      { baseColor: color.replace(/[\d.]+\)$/g, '0.8)'), scale: 0.6, zIndex: 3 },
    ];

    function generateData() {
      let data;
      if (toZero || !props.analysis.energy) {
        data = Array.from({ length: detail }, () => ({ value: 0 }));
      } else {
        data = Array.from({ length: detail }, () => ({
          value: Math.random(0, props.analysis.energy)
        }));
      }
      toZero = !toZero;
      return data;
    }

    function clearAll() {
      clearInterval(updateInterval);
      //clearTimeout(updateTimeout);
    }

    // gemini sections are not usable (yet)
    function nextSection() {
      clearAll();
      currentSection += 1;
      if (currentSection < props.analysis.segments.length) {
        console.log("Next Section: ", currentSection);
        remainingTime = props.analysis.segments[currentSection].duration * 1000;
        updateInterval = setInterval(updateVisualizer, getTempoTimeout());
        //updateTimeout = setTimeout(nextSection, remainingTime);
        startTime = Date.now();
      }
    }

    function initializeVisualizer() {
      clearAll();
      console.log("Initialize Visualizer");
      currentSection = 0;
      if (props.playing) {
        remainingTime = props.analysis.segments[currentSection].duration * 1000;
        updateInterval = setInterval(updateVisualizer, getTempoTimeout());
        //updateTimeout = setTimeout(nextSection, remainingTime);
        startTime = Date.now();
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
      svg.append("defs");

      bubbleConfigs.forEach((config, index) => {
        const gradientId = `gradient-${index}`;
        createGradient(svg, config.baseColor, gradientId);

        const bubbleGroup = svg.append("g")
          .attr("class", `bubble bubble-${index}`)
          .attr("transform", `translate(${window.innerWidth / 2}, ${window.innerHeight / 2}) scale(${config.scale})`)
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

      const color = getColor();

      bubbleConfigs[0].baseColor = color.replace(/[\d.]+\)$/g, '0.1)');
      bubbleConfigs[1].baseColor = color.replace(/[\d.]+\)$/g, '0.3)');
      bubbleConfigs[2].baseColor = color.replace(/[\d.]+\)$/g, '0.6)');
      bubbleConfigs[3].baseColor = color.replace(/[\d.]+\)$/g, '0.8)');


      bubbleGroups.each(function (_, index) {
        const bubbleGroup = d3.select(this);
        const gradientId = `gradient-${index}`;

        createGradient(svg, bubbleConfigs[index].baseColor, gradientId);

        bubbleGroup.select('path')
          .attr('fill', `url(#${gradientId})`);
      });
    }

    function getColor() {
      const { valence, energy, danceability } = props.analysis;
      if (valence === 0 && energy === 0) {
        return `rgba(200, 200, 200, 1)`; // Gray
      } else {
        const red = Math.min(255, Math.floor(energy * 200) + Math.floor(danceability * 50)); // Higher energy and danceability boost red.
        const green = Math.max(0, Math.floor((1 - danceability) * 255) + Math.floor((1 - energy) * 55) + Math.floor((1 - valence) * 55)); // Less danceability boosts green.
        const blue = Math.min(255, Math.floor((1 - valence) * 300 * (1 - energy)) + Math.floor(danceability * 100)); // Danceability adds blue for pink tones.

        return `rgba(${red}, ${green}, ${blue}, 1)`;
      }
      /* const rgb = props.analysis.color.match(/\d+/g);
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`; */
    }

    function updateVisualizer() {
      data.value = generateData();

      const svg = d3.select(svgRef.value);
      const angleScale = d3.scaleLinear().domain([0, data.value.length]).range([0, 2 * Math.PI]);
      const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(data.value, d => Math.abs(d.value))])
        .range([0, radius]);

      svg.selectAll('.bubble').each(function (_, index) {
        const bubbleGroup = d3.select(this);
        const lineGenerator = d3.lineRadial()
          .angle((d, i) => angleScale(i))
          .radius(d => radius + radiusScale(d.value))
          .curve(d3.curveCardinalClosed);

        const pathData = lineGenerator(data.value);

        bubbleGroup.select('path')
          .transition()
          .duration(getTempoTimeout() * (1 / props.analysis.energy)) // Adjust duration based on energy
          .ease(d3.easeLinear)
          .attr('d', pathData);
      });
    }

    function getTempoTimeout() {
      if (props.analysis.segments[currentSection].tempo && props.analysis.segments[currentSection].tempo != 0) {
        return 30000 / props.analysis.segments[currentSection].tempo;
      } else if (props.analysis.tempo != 0) {
        return 30000 / props.analysis.tempo;
      } else {
        return 30000;
      }
    }

    watch(
      () => [props.analysis.segments, props.analysis],
      () => { initializeVisualizer() },
      { deep: true, immediate: true }
    );

    watch(() => props.playing, () => {
      clearAll();
      if (props.playing) {
        updateInterval = setInterval(updateVisualizer, getTempoTimeout());
        //updateTimeout = setTimeout(nextSection, remainingTime);
        startTime = Date.now();
      } else {
        remainingTime -= (Date.now() - startTime);
      }
    });

    onBeforeUnmount(() => {
      clearAll();
    });

    onMounted(() => {
      nextTick(() => {
        createBubbles();
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
  width: 100%;
  height: 100%;
}
</style>