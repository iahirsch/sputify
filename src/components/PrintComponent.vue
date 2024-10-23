<template>
  <div class="container text-center">
    <h4><strong>Print a Portrait Layout with Rounded Corners</strong></h4>
    <button @click.prevent="printThis">Download Image</button>

    <div ref="printcontent" class="portrait-container">
      <div class="portrait-content">
        <h2>Portrait Mode Example</h2>
        <p>This is an example of a portrait layout that will be downloaded as an image.</p>

        <div class="graphics-section">
          <svg width="120" height="120" class="bubble">
            <circle cx="60" cy="60" r="50" stroke="#ff337e" stroke-width="4" fill="#ff337e33" />
          </svg>
          <svg width="100" height="100" class="bubble">
            <circle cx="50" cy="50" r="40" stroke="#201db9" stroke-width="4" fill="#201db933" />
          </svg>
        </div>

        <div class="content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.</p>
          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          <p>Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import domtoimage from 'dom-to-image-more';

export default {
  name: 'PrintComponent',
  methods: {
    async printThis() {
      console.log("Generating print preview...");
      const el = this.$refs.printcontent;

      const options = {
        width: 800, // Portrait width
        height: 1200, // Portrait height
        bgcolor: '#1e1e1e', // Dark background color
        style: {
          margin: '0 auto',
        },
      };

      try {
        // Get the PNG image base64-encoded data URL and display it
        const dataUrl = await domtoimage.toPng(el, options);
        const img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);

        // Download the image using a link
        const link = document.createElement("a");
        link.setAttribute("download", "portrait.png");
        link.setAttribute("href", dataUrl);
        link.click();

        console.log("Image downloaded.");
      } catch (error) {
        console.error("Failed to generate image", error);
      }
    },
  },
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
  width: 800px; /* Match the download width */
  height: 1200px; /* Match the download height */
background: linear-gradient(135deg, #201db9, #ff337e);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
}

.portrait-content {
  color: #ffffff;
  text-align: center;
}

.portrait-content h2 {
  margin-top: 0;
  color: #f1f1f1;
}

.portrait-content p {
  color: #cccccc;
  margin: 10px 0;
}

.graphics-section {
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 20px 0;
}

.bubble {
  opacity: 0.7;
}

.content {
  padding: 0 20px;
  text-align: left;
  font-size: 1.1em;
  line-height: 1.5;
}
</style>
