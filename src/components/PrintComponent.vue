<template>
  <div class="container text-center">
    <h4><strong>Download a High-Quality Image</strong></h4>
    <button @click.prevent="downloadCanvas">Download Image</button>

    <!-- Smaller Display of the High-Resolution Canvas -->
    <div class="portrait-container">
      <canvas ref="portraitCanvas" width="1600" height="2400" style="width: 400px; height: 600px;"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintComponent',
  mounted() {
    // Draw the initial content on the canvas
    this.drawOnCanvas();
  },
  methods: {
    drawOnCanvas() {
      const canvas = this.$refs.portraitCanvas;
      const ctx = canvas.getContext("2d");

      // Set scale factor for high resolution
      const scaleFactor = 2;
      ctx.scale(scaleFactor, scaleFactor);

      // Background
      ctx.fillStyle = "#2e2e2e"; // Dark background
      ctx.fillRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);

      // Header Text
      ctx.fillStyle = "#f1f1f1"; // Light text
      ctx.font = "36px Arial";
      ctx.fillText("Portrait Mode Example", 50, 80);

      // Sample Paragraph Text
      ctx.font = "20px Arial";
      ctx.fillStyle = "#cccccc";
      const text = "This is an example of a portrait layout that will be downloaded as an image. It demonstrates how to dynamically generate content.";
      this.wrapText(ctx, text, 50, 150, 700, 30);

      // Graphics (Bubbles)
      ctx.fillStyle = "#1db95433";
      ctx.strokeStyle = "#1db954";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(200, 800, 100, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ff573333";
      ctx.strokeStyle = "#ff5733";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(600, 900, 80, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    },

    // Helper function to wrap text within a certain width
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      
      for(let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, x, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    },

    downloadCanvas() {
      const canvas = this.$refs.portraitCanvas;
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "portrait-layout.png";
      link.click();
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
}

button:hover {
  background-color: #0056b3;
}

.portrait-container {
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
}
</style>