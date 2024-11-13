<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded" rel="stylesheet" />
  <div id="smooth-wrapper" ref="main">
    <div id="smooth-content">
      <!-- Intro section (Box A) -->
      <div class="box box-a gradient-black" data-speed="0.5">
        <div class="content">
          <h1>Birdos Music Journey</h1>
          <span class="material-symbols-rounded">keyboard_double_arrow_down</span>
        </div>
      </div>
      <!-- Bubble image section (Box B) -->
      <div class="box box-b gradient-black">
        <BubbleVisualizer :data="audioAnalysisData" />
      </div>

      <div class="box box-c gradient-black" data-speed="1.5">Box C</div>
      <div class="line"></div>
      <footer class="footer gradient-black">
        <PrintComponent />
        <button @click="scrollTo" class="totop">
          <span class="material-symbols-rounded">keyboard_double_arrow_up</span>
          <p>Back to Top</p>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import BubbleVisualizer from './Bubble.vue';
import { onMounted, onBeforeUnmount, onUnmounted, ref } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';
import PrintComponent from './PrintComponent.vue';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const main = ref();
const audioAnalysisData = ref(generateRandomData());
let updateInterval;
let smoother;
let ctx;

const scrollTo = () => {
  smoother.scrollTo('body', true, '0px, 0px');
};

function generateRandomData() {
  return Array.from({ length: 10 }, () => ({ value: Math.random() }));
}

function updateData() {
  audioAnalysisData.value = generateRandomData();
}

onMounted(() => {
  updateInterval = setInterval(updateData, 1000);

  ctx = gsap.context(() => {
    // Create the smooth scrolling effect
    smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
    });

    // Make .box-b (bubble image section) sticky when scrolling
    const bubbleBox = document.querySelector('.box-b');
    ScrollTrigger.create({
      trigger: bubbleBox,
      start: 'top top',         // Pin bubble when it reaches the top of the viewport
      endTrigger: 'footer',    // Unpin when footer comes into view
      end: 'bottom bottom',        // Ends when the footer reaches the center of the viewport
      pin: true,
      markers: true,            // Optional for debugging
    });
  }, main.value);
});

onBeforeUnmount(() => {
  clearInterval(updateInterval);
});

onUnmounted(() => {
  ctx.revert();
});
</script>

<style scoped>
body,
html {
  margin: 0;
  background-color: black;
}

h1 {
  font: 5REM 'Frankie', sans-serif;
}

#smooth-wrapper {
  overflow: hidden;
  position: relative;
  height: 100vh;
}

#smooth-content {
  width: 100%;
}

.box {
  height: 125vh;
  transition: scale 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-black {
  background: black;
  color: pink;
}

.line {
  height: 50px;
  background: black;
}

.bubble {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  /* Allow stacking elements vertically */
  flex-direction: column;
  /* Stack elements on top of each other */
  align-items: center;
  /* Center elements horizontally */
}

.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-size: 36px;
}

.footer {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

p {
  margin: 0;
}

.totop {
  margin-top: 50px;
  background-color: transparent;
  color: #ffffff55;
  border: none;
  cursor: pointer;
  z-index: 4;
}

.totop:hover {
  color: #fff;
}
</style>
