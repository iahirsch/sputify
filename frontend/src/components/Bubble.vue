<template>
    <div class="bubble-container">
        <svg ref="svgRef" width="700" height="700" class="rotating-svg"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue';

export default {
    name: 'Bubble',
    props: {
        audioAnalysisSections: {
            type: Array,
            required: false,
            default: () => [
                {
                    "start": 0,
                    "duration": 8.63379,
                    "confidence": 1,
                    "loudness": -12.305,
                    "tempo": 173.404,
                    "tempo_confidence": 0.178,
                    "key": 5,
                    "key_confidence": 0,
                    "mode": 1,
                    "mode_confidence": 0,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 8.63379,
                    "duration": 26.47246,
                    "confidence": 1,
                    "loudness": -4.044,
                    "tempo": 170.076,
                    "tempo_confidence": 0.607,
                    "key": 4,
                    "key_confidence": 0.312,
                    "mode": 0,
                    "mode_confidence": 0.324,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 35.10625,
                    "duration": 22.2336,
                    "confidence": 0.779,
                    "loudness": -5.93,
                    "tempo": 169.997,
                    "tempo_confidence": 0.5,
                    "key": 0,
                    "key_confidence": 0.69,
                    "mode": 1,
                    "mode_confidence": 0.785,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 57.33985,
                    "duration": 12.35225,
                    "confidence": 0.586,
                    "loudness": -3.088,
                    "tempo": 170.23,
                    "tempo_confidence": 0.662,
                    "key": 0,
                    "key_confidence": 0.793,
                    "mode": 1,
                    "mode_confidence": 0.714,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 69.6921,
                    "duration": 17.29427,
                    "confidence": 0.153,
                    "loudness": -3.629,
                    "tempo": 169.952,
                    "tempo_confidence": 0.567,
                    "key": 7,
                    "key_confidence": 0.107,
                    "mode": 1,
                    "mode_confidence": 0.565,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 86.98636,
                    "duration": 26.48214,
                    "confidence": 0.099,
                    "loudness": -3.048,
                    "tempo": 169.674,
                    "tempo_confidence": 0.486,
                    "key": 0,
                    "key_confidence": 0,
                    "mode": 1,
                    "mode_confidence": 0.122,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 113.4685,
                    "duration": 27.50251,
                    "confidence": 0.782,
                    "loudness": -3.804,
                    "tempo": 170.033,
                    "tempo_confidence": 0.543,
                    "key": 0,
                    "key_confidence": 1,
                    "mode": 1,
                    "mode_confidence": 0.808,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 140.97101,
                    "duration": 40.97663,
                    "confidence": 0.798,
                    "loudness": -3.186,
                    "tempo": 169.792,
                    "tempo_confidence": 0.554,
                    "key": 0,
                    "key_confidence": 0.577,
                    "mode": 1,
                    "mode_confidence": 0.565,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                },
                {
                    "start": 181.94763,
                    "duration": 3.32257,
                    "confidence": 0.872,
                    "loudness": -22.287,
                    "tempo": 169.904,
                    "tempo_confidence": 0.279,
                    "key": 10,
                    "key_confidence": 0.05,
                    "mode": 1,
                    "mode_confidence": 0.495,
                    "time_signature": 4,
                    "time_signature_confidence": 1
                }
            ]
        }
    },
    setup(props) {
        const width = 700;
        const height = 700;
        const radius = 150;
        const svgRef = ref(null);
        const data = ref(generateRandomData());
        let currentSection = 0;
        let updateTimeout;
        let updateInterval;

        function generateRandomData() {
            return Array.from({ length: 20 }, () => ({ value: Math.random() }));
        }

        function updateData() {
            data.value = generateRandomData();
        }

        function nextSection() {
            console.log('Next section');
            clearInterval(updateInterval);
            updateInterval = setInterval(updateData, 60000 / props.audioAnalysisSections[currentSection].tempo);
            updateTimeout = setTimeout(nextSection, props.audioAnalysisSections[currentSection].duration * 1000);
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
                        value: start.value * (1 - t) + end.value * t
                    });
                }
            }
            return interpolatedData;
        }

        function createSvg() {
            const svg = d3.select(svgRef.value)
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('class', 'rotating-group')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

            return svg;
        }

        function createCurve(svg, interpolatedData, angleScale, radiusScale, radius, color) {
            color = color || 'rgba(200, 0, 100, 0.7)';
            const lineGenerator = d3.lineRadial()
                .angle((d, i) => angleScale(i))
                .radius(d => radius + radiusScale(d.value))
                .curve(d3.curveCardinalClosed);

            const pathData = lineGenerator(interpolatedData);

            svg.selectAll("path").remove(); // Remove existing paths
            svg.append('path')
                .attr('d', pathData)
                .attr('fill', color)
                .attr('stroke', 'none');
        }

        function createVisualizer() {
            const svg = createSvg();

            const interpolatedData = interpolateData(data.value);

            const angleScale = d3.scaleLinear()
                .domain([0, interpolatedData.length])
                .range([0, 2 * Math.PI]);

            const radiusScale = d3.scaleLinear()
                .domain([0, d3.max(data.value, d => Math.abs(d.value)) || 1])
                .range([0, radius]);

            createCurve(svg, interpolatedData, angleScale, radiusScale, radius);
        }

        function updateVisualizer() {
            const svg = d3.select(svgRef.value).select('g');

            const interpolatedData = interpolateData(data.value, 1);

            const angleScale = d3.scaleLinear()
                .domain([0, interpolatedData.length])
                .range([0, 2 * Math.PI]);

            const radiusScale = d3.scaleLinear()
                .domain([0, d3.max(data.value, d => Math.abs(d.value))])
                .range([0, radius]);

            const lineGenerator = d3.lineRadial()
                .angle((d, i) => angleScale(i))
                .radius(d => radius + radiusScale(d.value))
                .curve(d3.curveCardinalClosed); // Use a curve function for smoothness

            const pathData = lineGenerator(interpolatedData);

            svg.select('path')
                .transition()
                .duration(1000)
                .ease(d3.easeLinear) // Use linear easing for smooth, constant speed transition
                .attr('d', pathData)
                .attr('fill', 'rgba(200, 0, 100, 0.7)');
        }

        // Watcher for reactive data updates
        watch(data, () => updateVisualizer(), { deep: true });

onBeforeUnmount(() => {
    clearInterval(updateInterval);
    clearTimeout(updateTimeout);
});

onMounted(() => {
    nextTick(() => {
        createVisualizer();
        updateInterval = setInterval(updateData, 60000 / props.audioAnalysisSections[currentSection].tempo);
        updateTimeout = setTimeout(nextSection, props.audioAnalysisSections[currentSection].duration * 1000);
    });
});

return {
    svgRef,
    data
};
    }
};
</script>

<style scoped>
.bubble-container {
    /* Additional styling if needed */
}

.rotating-svg {
    animation: rotate 40s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
