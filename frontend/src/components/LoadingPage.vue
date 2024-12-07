<template>
    <div id="app">
        <div class="container">
            <div class="text-container">
                <h2>Your musical bubble floats through your Spotify history...</h2>
            </div>
            <div class="soundwave-container">
                <div v-for="(bar, index) in bars" :key="index" class="bar" :style="barStyle(index)">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            bars: Array(25).fill(0),
            interval: null,
            time: 0
        };
    },
    mounted() {
        this.startAnimation();
    },
    beforeUnmount() {
        clearInterval(this.interval);
    },
    methods: {
        startAnimation() {
            this.interval = setInterval(() => {
                this.time += 0.02;
                this.bars = [...this.bars];
            }, 100);
        },
        barStyle(index) {
            // Farbverlauf
            const startColor = { r: 29, g: 185, b: 84 }; // #1DB954
            const endColor = { r: 77, g: 212, b: 172 }; // #4DD4AC
            const step = index / (this.bars.length - 1);

            const r = Math.round(startColor.r + (endColor.r - startColor.r) * step);
            const g = Math.round(startColor.g + (endColor.g - startColor.g) * step);
            const b = Math.round(startColor.b + (endColor.b - startColor.b) * step);

            // Sound wave height
            const base = 20;
            const amplitude = 100;
            const frequency = 17 + this.time;
            const height = amplitude * Math.sin(frequency * (index + this.time)) + amplitude + base;

            return {
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
                height: `${height}px`,
                width: "20px",
                margin: "0 5px",
                borderRadius: "20px"
            };
        }
    }
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
}

.text-container {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    text-align: center;
    font-family: 'FranieSemiBold', sans-serif;
    z-index: 1;
    position: fixed;
    top: 20vh;
    max-width: 80vw;
}

.soundwave-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    z-index: 0;
}

.bar {
    transition: height 0.1s linear;
}
</style>
