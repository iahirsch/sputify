<template>
    <div id="app">
        <div class="container">
            <div class="text-container">
                <p>Your musical bubble floats through the galaxy of your Spotify story.</p>
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
            bars: Array.from({ length: 25 }), // 25 Balken
            interval: null
        };
    },
    mounted() {
        // Startet die Animation beim Laden der Komponente
        this.startAnimation();
    },
    beforeUnmount() {
        // Stoppt die Animation beim Verlassen der Komponente
        clearInterval(this.interval);
    },
    methods: {
        startAnimation() {
            this.interval = setInterval(() => {
                // Trigger für Reaktivität
                this.bars = [...this.bars];
            }, 500); // Animation alle 500ms
        },
        barStyle(index) {
            // Farbverlauf
            const startColor = { r: 29, g: 185, b: 84 }; // #1DB954
            const endColor = { r: 77, g: 212, b: 172 }; // #4DD4AC
            const step = index / (this.bars.length - 1);

            const r = Math.round(startColor.r + (endColor.r - startColor.r) * step);
            const g = Math.round(startColor.g + (endColor.g - startColor.g) * step);
            const b = Math.round(startColor.b + (endColor.b - startColor.b) * step);

            // Dynamische Höhe
            const randomHeight = Math.random() * 200 + 20;

            return {
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
                height: `${randomHeight}px`,
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
    padding: 20px;
}

.text-container {
    margin-bottom: 30px;
    color: white;
    font-size: 1rem;
    padding: 10px;
    text-align: center;
    font-family: 'FranieSemiBold', sans-serif;
    z-index: 1;
    position: fixed;
    top: 25vh;
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
    transition: height 0.5s ease, transform 0.5s ease;
}

@media (max-width: 768px) {
    .bar {
        width: 15px;
        margin: 0 3px;
    }
}
</style>
