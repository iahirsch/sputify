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
    let updateTimeout;
    let updateInterval;
    let startTime;
    let remainingTime;

    function generateData() {
      let smoothness = -props.audioAnalysisSections[currentSection].loudness / 6;
      let data;
      if (toZero) {
        data = Array.from({ length: detail }, () => ({ value: 0 }));
      } else {
        data = Array.from({ length: detail }, () => ({ value: Math.random() + smoothness }));
      }
      toZero = !toZero;
      return data;
    }

    function clearAll() {
      clearInterval(updateInterval);
      clearTimeout(updateTimeout);
    }

    function nextSection() {
      clearAll();
      currentSection += 1;
      if (currentSection < props.audioAnalysisSections.length) {
        console.log("Next Section: ", currentSection);
        remainingTime = props.audioAnalysisSections[currentSection].duration * 1000;
        updateInterval = setInterval(updateVisualizer, 30000 / props.audioAnalysisSections[currentSection].tempo);
        updateTimeout = setTimeout(nextSection, remainingTime);
        startTime = Date.now();
      }
    }

    function initializeVisualizer() {
      clearAll();
      console.log("Initialize Visualizer");
      currentSection = 0;
      remainingTime = props.audioAnalysisSections[currentSection].duration * 1000;
      updateInterval = setInterval(updateVisualizer, 30000 / props.audioAnalysisSections[currentSection].tempo);
      updateTimeout = setTimeout(nextSection, remainingTime);
      startTime = Date.now();
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

      const bubbleConfigs = [
        { baseColor: getColor(0.12), scale: 3, zIndex: 0 },
        { baseColor: getColor(0.3), scale: 1.4, zIndex: 1 },
        { baseColor: getColor(0.6), scale: 1, zIndex: 2 },
        { baseColor: getColor(0.8), scale: 0.6, zIndex: 3 },
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

    function getColor(opacity) {
      const { valence } = props.audioFeatures;
      console.log("Valence: ", valence);
      if (valence <= 0.1) {
        return `rgba(50, 200, 120, ${opacity})`; // Green
      } else if (valence <= 0.2) {
        return `rgba(80, 100, 220, ${opacity})`; // Blue
      } else if (valence <= 0.3) {
        return `rgba(100, 100, 220, ${opacity})`; // Slightly lighter blue
      } else if (valence <= 0.4) {
        return `rgba(120, 100, 220, ${opacity})`; // Even lighter blue
      } else if (valence <= 0.5) {
        return `rgba(140, 100, 220, ${opacity})`; // Light blue
      } else if (valence <= 0.6) {
        return `rgba(160, 75, 200, ${opacity})`; // Transition to purple
      } else if (valence <= 0.7) {
        return `rgba(180, 50, 180, ${opacity})`; // Purple
      } else if (valence <= 0.8) {
        return `rgba(200, 50, 150, ${opacity})`; // Transition to red
      } else if (valence <= 0.9) {
        return `rgba(220, 50, 100, ${opacity})`; // Light red
      } else {
        return `rgba(200, 50, 50, ${opacity})`; // Red
      }
    }

    function updateVisualizer() {
      data.value = generateData();

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

    watch(
      () => [props.audioAnalysisSections, props.audioFeatures],
      () => { initializeVisualizer() },
      { deep: true, immediate: true }
    );

    watch(() => props.playing, () => {
      clearAll();
      if (props.playing) {
        updateInterval = setInterval(updateVisualizer, 30000 / props.audioAnalysisSections[currentSection].tempo);
        updateTimeout = setTimeout(nextSection, remainingTime);
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

.bubble {}
</style>