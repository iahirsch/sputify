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
    audioAnalysisSections: {
      type: Array,
      required: true
    },
    audioFeatures: {
      type: Object,
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
    let updateTimeouts = [];
    let updateInterval;

    function generateData() {
      let smoothness = 0;
      if (props.audioAnalysisSections[currentSection]) {
        smoothness = -props.audioAnalysisSections[currentSection].loudness / 6;
      }
      let data;
      if (toZero) {
        data = Array.from({ length: detail }, () => ({ value: 0 }));
      } else {
        data = Array.from({ length: detail }, () => ({ value: Math.random() + smoothness }));
      }
      toZero = !toZero;
      return data;
    }

    function updateData() {
      data.value = generateData();
    }

    function nextSection() {
      clearInterval(updateInterval);
      updateInterval = setInterval(updateData, 30000 / props.audioAnalysisSections[currentSection].tempo);
      currentSection = (currentSection + 1) % props.audioAnalysisSections.length;
      console.log("Next Section: ", currentSection);
    }

    function clearAllIntervalsAndTimeouts() {
      clearInterval(updateInterval);
      updateTimeouts.forEach(timeout => clearTimeout(timeout));
      updateTimeouts = [];
    }

    function initializeVisualizer() {
      clearAllIntervalsAndTimeouts();
      updateInterval = setInterval(updateData, 60000 / props.audioAnalysisSections[currentSection]?.tempo || 1);

      props.audioAnalysisSections.forEach(section => {
        updateTimeouts.push(setTimeout(nextSection, section.start * 1000));
      });
    }

    function interpolateData(data, steps = 1) {
      const interpolatedData = [];
      for (let i = 0; i < data.length; i++) {
        const start = data[i];
        const end = data[(i + 1) % data.length];
        for (let j = 0; j < steps; j++) {
          const t = j / steps;
          interpolatedData.push({
            value: start.value * (1 - t) + end.value * t,
          });
        }
      }
      return interpolatedData;
    }

    function createSvg() {
      const svg = d3.select(svgRef.value);

      return svg;
    }

    function createCurve(svg, interpolatedData, angleScale, radiusScale, radius, color) {
      const lineGenerator = d3.lineRadial()
        .angle((d, i) => angleScale(i))
        .radius(d => radius + radiusScale(d.value))
        .curve(d3.curveCardinalClosed);

      const pathData = lineGenerator(interpolatedData);

      svg.selectAll("path").remove();
      svg.append('path')
        .attr('d', pathData)
        .attr('fill', color)
        .attr('stroke', 'none');
    }

    function createGradient(svg, color, id) {
      const defs = svg.select("defs");

      const gradient = defs.append("radialGradient")
        .attr("id", id);

      gradient.append("stop")
        .attr("offset", "40%")
        .attr("stop-color", color.replace(/[\d.]+\)$/g, "0.1)"));
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color.replace(/[\d.]+\)$/g, "0.5)"));
    }

    function createBubbles() {
      const svg = createSvg();
      svg.append("defs");

      const bubbleConfigs = [
        //{ baseColor: "rgb(0, 20, 10, 1)", scale: 2.5, zIndex: 0 },
        { baseColor: "rgb(0, 50, 20, 1)", scale: 1.4, zIndex: 1 },
        { baseColor: "rgb(0, 100, 50, 1)", scale: 1, zIndex: 2 },
        { baseColor: "rgb(0, 200, 100, 1)", scale: 0.6, zIndex: 3 },
      ];

      bubbleConfigs.forEach((config, index) => {
        const gradientId = `gradient-${index}`;
        createGradient(svg, config.baseColor, gradientId);

        const bubbleGroup = svg.append("g")
          .attr("class", `bubble bubble-${index}`)
          .attr("transform", `translate(${window.innerWidth / 2}, ${window.innerHeight / 2}) scale(${config.scale})`)
          .style("z-index", config.zIndex);

        // Generate interpolated data based on audio analysis
        const interpolatedData = interpolateData(data.value);
        const angleScale = d3.scaleLinear().domain([0, interpolatedData.length]).range([0, 2 * Math.PI]);
        const radiusScale = d3.scaleLinear()
          .domain([0, d3.max(data.value, d => Math.abs(d.value)) || 1]);

        createCurve(bubbleGroup, interpolatedData, angleScale, radiusScale, radius, `url(#${gradientId})`);
      });
    }


    function updateVisualizer() {
      const svg = d3.select(svgRef.value);
      const interpolatedData = interpolateData(data.value, 1);
      const angleScale = d3.scaleLinear().domain([0, interpolatedData.length]).range([0, 2 * Math.PI]);
      const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(data.value, d => Math.abs(d.value))])
        .range([0, radius]);

      svg.selectAll('.bubble').each(function (_, index) {
        const bubbleGroup = d3.select(this);
        const lineGenerator = d3.lineRadial()
          .angle((d, i) => angleScale(i))
          .radius(d => radius + radiusScale(d.value))
          .curve(d3.curveCardinalClosed);

        const pathData = lineGenerator(interpolatedData);

        bubbleGroup.select('path')
          .transition()
          .duration(30000 / props.audioAnalysisSections[currentSection].tempo)
          .ease(d3.easeSin)
          .attr('d', pathData);
      });
    }

    watch(data, () => updateVisualizer(), { deep: true });

    watch(
      () => [props.audioAnalysisSections, props.audioFeatures],
      () => {
        initializeVisualizer();
      },
      { deep: true, immediate: true }
    );

    onBeforeUnmount(() => {
      clearAllIntervalsAndTimeouts();
    });

    onMounted(() => {
      nextTick(() => {
        createBubbles();
        initializeVisualizer();
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

.bubble {}
</style>