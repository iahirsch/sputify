<template>
    <div class="container text-center">
        <h4><strong>Download or Share a High-Quality Image</strong></h4>
        <div class="button-container">
            <div class="button-row">
                <button @click.prevent="downloadCanvas(1)">Download Image 1</button>
                <button @click.prevent="shareCanvas(1)">Share Image 1</button>
            </div>
            <div class="button-row">
                <button @click.prevent="downloadCanvas(2)">Download Image 2</button>
                <button @click.prevent="shareCanvas(2)">Share Image 2</button>
            </div>
            <div class="button-row">
                <button @click.prevent="downloadCanvas(3)">Download Image 3</button>
                <button @click.prevent="shareCanvas(3)">Share Image 3</button>
            </div>
        </div>

        <!-- Smaller Display of the High-Resolution Canvases -->
        <div class="portrait-container">
            <div class="portrait">
                <canvas ref="portraitCanvas1" width="1080" height="1920" style="width: 270px; height: 480px;"></canvas>
            </div>
            <div class="portrait">
                <canvas ref="portraitCanvas2" width="1080" height="1920" style="width: 270px; height: 480px;"></canvas>
            </div>
            <div class="portrait">
                <canvas ref="portraitCanvas3" width="1080" height="1920" style="width: 270px; height: 480px;"></canvas>
            </div>
        </div>

    </div>
</template>

<script>
import imageSrc from '@/assets/image1.png';
export default {
    name: 'PrintComponent',
    async mounted() {
        // Draw the initial content on the canvases
        this.drawOnCanvas1(this.$refs.portraitCanvas1);
        this.drawOnCanvas2(this.$refs.portraitCanvas2);

        // For Canvas 3, include a local PNG image
        const image = new Image();
        image.src = imageSrc;

        // Handle loading state
        image.onload = () => {
            this.drawOnCanvas3(this.$refs.portraitCanvas3, image);
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
            ctx.fillStyle = "#2e2e2e";
            ctx.fillRect(0, 0, 1080 / scaleFactor, 1920 / scaleFactor);
            ctx.fillStyle = "#f1f1f1";
            ctx.font = "36px Arial";
        },

        downloadCanvas(canvasNumber) {
            const canvas = this.$refs[`portraitCanvas${canvasNumber}`];
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `portrait-layout-${canvasNumber}.png`;
            link.click();
        },

        async shareCanvas(canvasNumber) {
            const canvas = this.$refs[`portraitCanvas${canvasNumber}`];
            const dataUrl = canvas.toDataURL("image/png");

            try {
                const blob = await (await fetch(dataUrl)).blob();
                const file = new File([blob], `portrait-layout-${canvasNumber}.png`, { type: blob.type });

                if (navigator.share) {
                    await navigator.share({
                        files: [file],
                        title: 'Check out this image!',
                        text: `Here's the image I generated: Image ${canvasNumber}`,
                    });
                } else {
                    alert("Sharing is not supported on your device.");
                }
            } catch (error) {
                console.error("Sharing failed:", error);
            }
        }
    }
};
</script>

<style scoped>
h4 {
    margin-bottom: 20px;
}

.container {
    background-color: #1e1e1e;
    padding: 20px;
    margin-top: 50px;
    max-width: 90vw;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
}

.button-container {
    width: 80vw;
    display: flex;
    justify-content: space-around;
    gap: 15px;
    margin-bottom: 20px;
}

.button-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #0056b3;
}

.portrait-container {
    display: flex;
    gap: 10px;
    margin-top: 20px;
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
}
</style>