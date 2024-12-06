<template>
    <div class="journey-sections" :id="shareIndex">
        <h2>Share Templates</h2>
        <div class="container text-center">
            <div class="canvas-container">
                <button @click.prevent="previousCanvas" class="arrow left-arrow">
                    <span class="material-symbols-rounded">keyboard_double_arrow_left</span>
                </button>
                <div class="portrait-container">
                    <div v-for="(canvas, index) in canvases" :key="index"
                        :class="['portrait', { selected: selectedCanvas === index }]"
                        :style="{ transform: `translateX(calc(-${(selectedCanvas) * 103 + 100}% + 600px)) scale(${selectedCanvas === index ? 1 : 0.8})` }"
                        @click="selectCanvas(index)" data-year="Share Journey">
                        <canvas :ref="'portraitCanvas' + (index + 1)" width="1080" height="1920"></canvas>
                    </div>
                </div>
                <button @click.prevent="nextCanvas" class="arrow right-arrow">
                    <span class="material-symbols-rounded">keyboard_double_arrow_right</span>
                </button>
            </div>

            <div class="button-container">
                <button class="share-button" @click.prevent="shareCanvas">
                    <span class="material-symbols-rounded share">share</span>
                    <p>Share</p>
                </button>
                <button class="share-button" @click.prevent="downloadCanvas">
                    <span class="material-symbols-rounded">download</span>
                    <p>Download</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import imageSrc from '@/assets/image1.png';
export default {
    name: 'PrintComponent',
    props: {
        userName: {
            type: String,
            required: true
        },
        years: {
            type: Array,
            required: true
        },
        shareIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            selectedCanvas: 0,
            canvases: [1, 2, 3],
        };
    },
    watch: {
        userName: 'drawCanvases',
        years: {
            handler: 'drawCanvases',
            deep: true
        }
    },
    mounted() {
        this.drawCanvases();
    },
    methods: {
        drawCanvases() {
            // Clear and redraw all canvases
            this.drawOnCanvas1(this.$refs.portraitCanvas1[0]);
            this.drawOnCanvas2(this.$refs.portraitCanvas2[0]);
            this.drawOnCanvas3(this.$refs.portraitCanvas3[0]);
        },

        drawOnCanvas1(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);
            ctx.fillStyle = "#1DB954";

            const lines = `${this.userName}'s \ncurrent favorites`.split('\n');
            lines.forEach((line, index) => {
                ctx.font = "bold 42px FranieBlack, sans-serif";
                ctx.fillText(line, 50, 80 + index * 50);
            });

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            const { topTracks = [], topArtists = [], topGenres = [] } = this.years[1] || {};
            const topTracksText = `Top Tracks: \n${topTracks.map(track => track.name).join("\n")}`;
            const topTracksLines = topTracksText.split('\n');
            topTracksLines.forEach((line, index) => {
                if (index === 0) {
                    ctx.font = "bold 42px Familjen Grotesk, sans-serif";
                } else {
                    ctx.font = "36px Familjen Grotesk, sans-serif";
                }
                ctx.fillText(line, 50, 200 + index * 40);
            });

            const topArtistsText = `Top Artists: \n${topArtists.map(artist => artist.name).join("\n")}`;
            const topArtistsLines = topArtistsText.split('\n');
            topArtistsLines.forEach((line, index) => {
                if (index === 0) {
                    ctx.font = "bold 42px Familjen Grotesk, sans-serif";
                } else {
                    ctx.font = "36px Familjen Grotesk, sans-serif";
                }
                ctx.fillText(line, 50, 470 + index * 40);
            });

            const topGenresText = `Top Genres: \n${topGenres.join("\n")}`;
            const topGenresLines = topGenresText.split('\n');
            topGenresLines.forEach((line, index) => {
                if (index === 0) {
                    ctx.font = "bold 42px Familjen Grotesk, sans-serif";
                } else {
                    ctx.font = "36px Familjen Grotesk, sans-serif";
                }
                ctx.fillText(line, 50, 740 + index * 40);
            });
        },

        drawOnCanvas2(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);
            ctx.fillStyle = "#4DD4AC";

            ctx.font = "bold 42px FranieBlack, sans-serif";
            const lines = `${this.userName}'s \ntaste evolution \nover the years`.split('\n');
            lines.forEach((line, index) => {
                ctx.fillText(line, 50, 80 + index * 50);
            });

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            this.years.forEach((year, index) => {
                if (index < 7 && index !== 0) {
                    const yearText = `${year.title}`;
                    const topTrackText = `Top Track: ${year.topTracks[0]?.name || "No data"}`;

                    ctx.font = "bold 42px Familjen Grotesk, sans-serif";
                    ctx.fillText(yearText, 50, 260 + index * 100);

                    ctx.font = "36px Familjen Grotesk, sans-serif";
                    ctx.fillText(topTrackText, 50, 300 + index * 100);
                }
            });
        },


        drawOnCanvas3(canvas) {
            const ctx = canvas.getContext("2d");
            this.clearCanvas(ctx);
            this.setCanvasStyle(ctx);
            ctx.fillStyle = "#FFA0AB";

            ctx.font = "bold 42px FranieBlack, sans-serif";
            const lines = 'Create Your Own\nMusic Journey'.split('\n');
            lines.forEach((line, index) => {
                ctx.fillText(line, 50, 80 + index * 50);
            });

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.font = "36px Familjen Grotesk, sans-serif";
            const visitLines = 'Visit Spütify and\nstart your journey!'.split('\n');
            visitLines.forEach((line, index) => {
                ctx.fillText(line, 50, 200 + index * 40);
            });

            // Load and draw the local image
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                ctx.drawImage(image, 0, 300, 600, 500);
            };
            image.onerror = () => {
                console.error("Error loading image for canvas3.");
            };

            ctx.font = "bold 36px Familjen Grotesk, sans-serif";
            ctx.fillText(`www.sputify.com`, 50, 900);
        },


        clearCanvas(ctx) {
            ctx.clearRect(0, 0, 1080, 1920);
        },

        setCanvasStyle(ctx) {
            // Reset transformations
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // Common Style Setup for High Resolution
            const scaleFactor = 2;
            ctx.scale(scaleFactor, scaleFactor);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, 1080 / scaleFactor, 1920 / scaleFactor);
            ctx.fillStyle = "#f1f1f1";
            ctx.font = "36px Arial";
        },

        downloadCanvas() {
            const canvas = this.$refs[`portraitCanvas${this.selectedCanvas + 1}`][0];
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `portrait-layout-${this.selectedCanvas + 1}.png`;
            link.click();
        },

        async shareCanvas() {
            const canvas = this.$refs[`portraitCanvas${this.selectedCanvas + 1}`][0];
            const dataUrl = canvas.toDataURL("image/png");

            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], `portrait-layout-${this.selectedCanvas + 1}.png`, { type: blob.type });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'Check out this image!',
                        text: `Here's the image I generated: Image ${this.selectedCanvas + 1}`,
                    });
                } else {
                    alert("Sharing this file is not supported on your device.");
                }
            } catch (error) {
                console.error("Sharing failed:", error);
            }
        },

        previousCanvas() {
            this.selectedCanvas = (this.selectedCanvas - 1 + this.canvases.length) % this.canvases.length;
        },

        nextCanvas() {
            this.selectedCanvas = (this.selectedCanvas + 1) % this.canvases.length;
        },

        selectCanvas(index) {
            this.selectedCanvas = index;
        }
    }
};
</script>

<style scoped>
h4 {
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 0;
    margin-left: 5vw;
}

.container {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.button-container {
    width: 80vw;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
}

.share-button {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    transition-duration: 0.4s;
}

.share-button:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.6);
}

.portrait-container {
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 5rem 0;
    transition: transform 0.5s ease-in-out;
}

.portrait {
    display: flex;
    gap: 10px;
    padding: 10px;
    background-color: #2e2e2e;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
    transition: all 0.3s ease-in-out;
    filter: brightness(0.4);
    z-index: 2;
    transform: scale(0.8);
}

.portrait.selected {
    transform: scale(1);
    filter: brightness(1);
    z-index: 3;
}

canvas {
    border-radius: 10px;
    width: 270px;
    height: 480px;
}

.canvas-container {
    display: flex;
}

.arrow {
    position: relative;
    top: 50%;
    background-color: transparent;
    color: #ffffff55;
    border: none;
    cursor: pointer;
    z-index: 4;

    .material-symbols-rounded {
        font-size: 3rem !important;
    }
}

.arrow.left-arrow {
    left: 40vw;
}

.arrow.right-arrow {
    right: 38vw;
}

.arrow:hover {
    color: #fff;
}

.share {
    transform: scale(0.9);
}
</style>