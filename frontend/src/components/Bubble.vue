<template>
    <div class="bubble-container">
        <svg ref="svg" class="rotating-svg"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
    name: 'BubbleComponent',
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            width: 600,
            height: 600,
            radius: 150,
            steps: 1, // Number of steps between each data point
            buckets: 3, // Number of buckets to mirror the data
            showVerticalLines: false, // Flag to show or hide vertical lines
            showCurve: true // Flag to show or hide the curve
        };
    },
    methods: {
        createSvg() {
            return d3.select(this.$refs.svg)
                .attr('width', this.width)
                .attr('height', this.height)
                .append('g')
                .attr('class', 'rotating-group') // Add a class for the rotating group
                .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
        },
        interpolateData(data, steps) {
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
        },
        createVerticalLines(svg, mirroredData, angleScale, radiusScale) {
            svg.selectAll('line.vertical')
                .data(mirroredData)
                .enter().append('line')
                .attr('class', 'vertical')
                .attr('x1', (d, i) => this.radius * Math.cos(angleScale(i) - Math.PI / 2))
                .attr('y1', (d, i) => this.radius * Math.sin(angleScale(i) - Math.PI / 2))
                .attr('x2', (d, i) => (this.radius + radiusScale(d.value)) * Math.cos(angleScale(i) - Math.PI / 2))
                .attr('y2', (d, i) => (this.radius + radiusScale(d.value)) * Math.sin(angleScale(i) - Math.PI / 2))
                .attr('stroke', 'black')
                .attr('stroke-width', 2);
        },
        createCurve(svg, mirroredData, angleScale, radiusScale) {
            const lineGenerator = d3.lineRadial()
                .angle((d, i) => angleScale(i))
                .radius(d => this.radius + radiusScale(d.value))
                .curve(d3.curveCardinalClosed); // Use a curve function for smoothness

            const pathData = lineGenerator(mirroredData);

            svg.append('path')
                .attr('d', pathData)
                .attr('fill', 'rgba(0, 0, 255, 0.3)')
                .attr('stroke', 'black')
                .attr('stroke-width', 2);
        },
        createVisualizer() {
            const svg = this.createSvg();

            // Create mirrored data with interpolation
            const interpolatedData = this.interpolateData(this.data, this.steps);
            let mirroredData = [];
            for (let i = 0; i < this.buckets; i++) {
                mirroredData = mirroredData.concat(i % 2 === 0 ? interpolatedData : interpolatedData.slice().reverse());
            }

            const angleScale = d3.scaleLinear()
                .domain([0, mirroredData.length])
                .range([0, 2 * Math.PI]);

            const radiusScale = d3.scaleLinear()
                .domain([0, d3.max(this.data, d => Math.abs(d.value))])
                .range([0, this.radius]);

            // Create curve if the flag is set
            if (this.showCurve) {
                this.createCurve(svg, mirroredData, angleScale, radiusScale);
            }

            // Create circular path
            svg.append('circle')
                .attr('r', this.radius)
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('stroke', 'black')
                .attr('stroke-width', 5)
                .attr('fill', 'white');

            // Create vertical lines if the flag is set
            if (this.showVerticalLines) {
                this.createVerticalLines(svg, mirroredData, angleScale, radiusScale);
            }
        },
        updateVisualizer() {
            const svg = d3.select(this.$refs.svg).select('g');

            // Create mirrored data with interpolation
            const interpolatedData = this.interpolateData(this.data, this.steps);
            let mirroredData = [];
            for (let i = 0; i < this.buckets; i++) {
                mirroredData = mirroredData.concat(i % 2 === 0 ? interpolatedData : interpolatedData.slice().reverse());
            }

            const angleScale = d3.scaleLinear()
                .domain([0, mirroredData.length])
                .range([0, 2 * Math.PI]);

            const radiusScale = d3.scaleLinear()
                .domain([0, d3.max(this.data, d => Math.abs(d.value))])
                .range([0, this.radius]);

            // Update vertical lines if the flag is set
            if (this.showVerticalLines) {
                svg.selectAll('line.vertical')
                    .data(mirroredData)
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear) // Use linear easing for smooth, constant speed transition
                    .attr('x2', (d, i) => (this.radius + radiusScale(d.value)) * Math.cos(angleScale(i) - Math.PI / 2))
                    .attr('y2', (d, i) => (this.radius + radiusScale(d.value)) * Math.sin(angleScale(i) - Math.PI / 2));
            }

            // Update curve if the flag is set
            if (this.showCurve) {
                const lineGenerator = d3.lineRadial()
                    .angle((d, i) => angleScale(i))
                    .radius(d => this.radius + radiusScale(d.value))
                    .curve(d3.curveCardinalClosed); // Use a curve function for smoothness

                const pathData = lineGenerator(mirroredData);

                svg.select('path')
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear) // Use linear easing for smooth, constant speed transition
                    .attr('d', pathData)
                    .attr('fill', 'rgba(0, 0, 255, 0.3)'); // Fill the area with a color (e.g., semi-transparent blue)
            } else {
                svg.select('path').remove();
            }
        }
    },
    watch: {
        data: {
            handler() {
                this.updateVisualizer();
            },
            deep: true
        }
    },
    mounted() {
        this.createVisualizer();
    }
};
</script>

<style scoped>
.bubble-container {
    /* Styles for the Bubble component */
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