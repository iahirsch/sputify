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
      required: false,
      default: () => [
        {
          "start": 0,
          "duration": 13.32793,
          "confidence": 1,
          "loudness": -24.081,
          "tempo": 132.877,
          "tempo_confidence": 0.341,
          "key": 0,
          "key_confidence": 0.175,
          "mode": 1,
          "mode_confidence": 0.364,
          "time_signature": 4,
          "time_signature_confidence": 1
        },
        {
          "start": 13.32793,
          "duration": 26.76783,
          "confidence": 1,
          "loudness": -4.295,
          "tempo": 132.225,
          "tempo_confidence": 0.472,
          "key": 11,
          "key_confidence": 0.383,
          "mode": 0,
          "mode_confidence": 0.451,
          "time_signature": 4,
          "time_signature_confidence": 0.926
        },
        {
          "start": 40.09576,
          "duration": 15.33119,
          "confidence": 0.406,
          "loudness": -5.335,
          "tempo": 133.171,
          "tempo_confidence": 0.489,
          "key": 0,
          "key_confidence": 0.882,
          "mode": 1,
          "mode_confidence": 0.736,
          "time_signature": 4,
          "time_signature_confidence": 1
        },
        {
          "start": 55.42695,
          "duration": 12.63745,
          "confidence": 0.111,
          "loudness": -3.009,
          "tempo": 132.882,
          "tempo_confidence": 0.453,
          "key": 11,
          "key_confidence": 0.188,
          "mode": 0,
          "mode_confidence": 0.433,
          "time_signature": 4,
          "time_signature_confidence": 1
        },
        {
          "start": 68.0644,
          "duration": 15.78345,
          "confidence": 0.065,
          "loudness": -3.472,
          "tempo": 200.023,
          "tempo_confidence": 0.499,
          "key": 11,
          "key_confidence": 0.342,
          "mode": 0,
          "mode_confidence": 0.511,
          "time_signature": 4,
          "time_signature_confidence": 0.625
        },
        {
          "start": 83.84785,
          "duration": 15.28977,
          "confidence": 0.377,
          "loudness": -1.586,
          "tempo": 200.528,
          "tempo_confidence": 0.365,
          "key": 9,
          "key_confidence": 0.737,
          "mode": 0,
          "mode_confidence": 0.479,
          "time_signature": 4,
          "time_signature_confidence": 1
        },
        {
          "start": 99.13761,
          "duration": 23.69486,
          "confidence": 0.311,
          "loudness": -3.568,
          "tempo": 200.332,
          "tempo_confidence": 0.444,
          "key": 2,
          "key_confidence": 0.403,
          "mode": 1,
          "mode_confidence": 0.238,
          "time_signature": 4,
          "time_signature_confidence": 1
        },
        {
          "start": 122.83247,
          "duration": 9.31351,
          "confidence": 0.461,
          "loudness": -5.003,
          "tempo": 200.379,
          "tempo_confidence": 0.416,
          "key": 11,
          "key_confidence": 0.428,
          "mode": 0,
          "mode_confidence": 0.446,
          "time_signature": 4,
          "time_signature_confidence": 1
        },
        {
          "start": 132.14598,
          "duration": 29.76011,
          "confidence": 0.694,
          "loudness": -2.601,
          "tempo": 198.094,
          "tempo_confidence": 0.295,
          "key": 7,
          "key_confidence": 0,
          "mode": 1,
          "mode_confidence": 0.239,
          "time_signature": 3,
          "time_signature_confidence": 0.577
        },
        {
          "start": 161.9061,
          "duration": 11.03014,
          "confidence": 0.892,
          "loudness": -3.535,
          "tempo": 199.497,
          "tempo_confidence": 0.259,
          "key": 4,
          "key_confidence": 0.501,
          "mode": 1,
          "mode_confidence": 0.42,
          "time_signature": 1,
          "time_signature_confidence": 0.25
        }
      ] // nmixx - o.o
    },
    audioFeatures: {
      type: Object,
      required: false,
      default: {
        "danceability": 0.389,
        "energy": 0.77,
        "key": 11,
        "loudness": -3.92,
        "mode": 0,
        "speechiness": 0.297,
        "acousticness": 0.0368,
        "instrumentalness": 0.00000379,
        "liveness": 0.0598,
        "valence": 0.295,
        "tempo": 200.263,
        "type": "audio_features",
        "id": "44zfpg3ndtGESsgpTbWeyE",
        "uri": "spotify:track:44zfpg3ndtGESsgpTbWeyE",
        "track_href": "https://api.spotify.com/v1/tracks/44zfpg3ndtGESsgpTbWeyE",
        "analysis_url": "https://api.spotify.com/v1/audio-analysis/44zfpg3ndtGESsgpTbWeyE",
        "duration_ms": 172936,
        "time_signature": 4
      } // nmixx - o.o
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

    function updateData() {
      data.value = generateData();
    }

    function nextSection() {
      clearInterval(updateInterval);
      updateInterval = setInterval(updateData, 30000 / props.audioAnalysisSections[currentSection].tempo);
      currentSection = (currentSection + 1) % props.audioAnalysisSections.length;
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
        { baseColor: "rgb(0, 20, 10, 1)", scale: 2.5, zIndex: 0 },
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

    onBeforeUnmount(() => {
      clearInterval(updateInterval);
      updateTimeouts.forEach(timeout => {
        clearTimeout(timeout);
      });
    });

    onMounted(() => {
      nextTick(() => {
        createBubbles();
        updateInterval = setInterval(updateData, 60000 / props.audioAnalysisSections[currentSection].tempo);
        props.audioAnalysisSections.forEach(section => {
          updateTimeouts.push(setTimeout(nextSection, section.start * 1000));
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
  width: 100%;
  height: 100%;
}

.bubble {}
</style>