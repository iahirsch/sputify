<template>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded" rel="stylesheet" />
    <div class="container text-center">
        <div class="canvas-container">
            <button @click.prevent="previousCanvas" class="arrow left-arrow">
                <span class="material-symbols-rounded">keyboard_double_arrow_left</span>
            </button>
            <button @click.prevent="nextCanvas" class="arrow right-arrow">
                <span class="material-symbols-rounded">keyboard_double_arrow_right</span>
            </button>

            <div class="portrait-container">
                <div v-for="(canvas, index) in canvases" :key="index"
                    :class="['portrait', { selected: selectedCanvas === index }]"
                    :style="{ transform: `translateX(calc(-${(selectedCanvas) * 100 + 50}% + 50vw)) scale(${selectedCanvas === index ? 1 : 0.8})` }">
                    <canvas :ref="'portraitCanvas' + (index + 1)" width="1080" height="1920"></canvas>
                </div>
            </div>


        </div>

        <div class="button-container">
            <!-- <button class="share-button" @click.prevent="downloadCanvas">Download Image</button> -->
            <button class="share-button" @click.prevent="shareCanvas">Share Image</button>
        </div>
    </div>
</template>

<script>
import imageSrc from '@/assets/image1.png';
export default {
    name: 'PrintComponent',
    data() {
        return {
            selectedCanvas: 0,  // Keeps track of the selected canvas index
            canvases: [1, 2, 3],  // List of canvases
        };
    },
    async mounted() {
        // Draw the initial content on the canvases
        this.drawOnCanvas1(this.$refs.portraitCanvas1[0]);
        this.drawOnCanvas2(this.$refs.portraitCanvas2[0]);

        // For Canvas 3, include a local PNG image
        const image = new Image();
        image.src = imageSrc;
        // Handle loading state
        image.onload = () => {
            this.drawOnCanvas3(this.$refs.portraitCanvas3[0], image);
        };
        // Handle loading errors
        image.onerror = () => {
            console.error("Error: Failed to load image.");
        };
    },
    methods: {
        drawOnCanvas1(canvas) {
            const ctx = canvas.getContext("2d");
            this.setCanvasStyle(ctx);
            ctx.fillStyle = "#ff6347";
            ctx.fillText("Unique Content - Image 1", 50, 80);
            ctx.beginPath();
            ctx.arc(300, 600, 100, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
            ctx.fillStyle = "#ff4500";
            ctx.fill();
            ctx.stroke();
        },

        drawOnCanvas2(canvas) {
            const ctx = canvas.getContext("2d");
            this.setCanvasStyle(ctx);
            ctx.fillStyle = "#11bb5f";
            ctx.fillText("Different Design - Image 2", 50, 80);
            ctx.beginPath();
            ctx.rect(100, 500, 400, 200); // left, top, width, height
            ctx.fillStyle = "#00fa9a";
            ctx.fill();
            ctx.stroke();
        },

        drawOnCanvas3(canvas, image) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                this.setCanvasStyle(ctx);
                ctx.fillStyle = "#4169e1";
                ctx.fillText("Local Image - Image 3", 50, 80);
                ctx.drawImage(image, 0, 200, 600, 500); // left, top, width, height
            } else {
                console.error("Error: Unable to get canvas context.");
            }
        },

        setCanvasStyle(ctx) {
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
        }
    }
};
</script>

<style scoped>
h4 {
    margin-bottom: 20px;
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
    gap: 15px;
    margin-top: 20px;
}

.share-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.share-button:hover {
    background-color: #0056b3;
}

.portrait-container {
    width: 100vw;
    overflow: hidden;
    display: flex;
    gap: 10px;
    margin-top: 20px;
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

.arrow {
    position: relative;
    top: 50%;
    background-color: transparent;
    color: #ffffff55;
    border: none;
    cursor: pointer;
    z-index: 4;
}

.arrow.left-arrow {
    left: 20px;
}

.arrow.right-arrow {
    left: calc(100vw - 150px);
}

.arrow:hover {
    color: #fff;
}

.material-symbols-rounded {
    font-family: 'Material Symbols Rounded';
    font-size: 3rem;
}
</style>