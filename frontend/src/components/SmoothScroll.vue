<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded" rel="stylesheet" />

  <div id="smooth-wrapper" ref="main">
    <span class="material-symbols-rounded help hover-icon">help</span>
    <div id="smooth-content">
      <div class="box box-a gradient-black" data-speed="0.5">
        <WelcomeComponent />
      </div>
      <div class="box box-b gradient-black">
        <h1 class="year-title">2023</h1>
        <div class="year">
          <div class="content-leftside">
            <p>hello</p>
          </div>
          <div class="content-rightside">
            <p>hello</p>
          </div>
        </div>
        <div class="bubble" data-speed="0.5">
          <BubbleVisualizer :data="audioAnalysisData" />
        </div>
      </div>

      <div class="box box-c gradient-black"></div>
      <div class="line"></div>
      <footer class="footergradient-black">
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
import WelcomeComponent from './WelcomeComponent.vue';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
const main = ref();
const audioAnalysisData = ref(generateRandomData());
let updateInterval;
let smoother;
let ctx;
let panel_tl;

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
      smooth: 1,
      effects: true,
    });

    // Make .box-b (bubble image section) sticky when scrolling
    const bubbleBox = document.querySelector('.bubble');
    ScrollTrigger.create({
      trigger: bubbleBox,
      start: '.box-a',         // Pin bubble when it reaches the top of the viewport
      endTrigger: 'box-c',
      end: 'center top',
      pin: true,
      markers: false,
    });

  }, main.value);
});

onBeforeUnmount(() => {
  clearInterval(updateInterval);
});

onUnmounted(() => {
  ctx.revert();
});

window.onload = function () {
  gsap.utils.toArray(".step").forEach(function (panel) {
    panel_tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: "top 90%",
        end: "bottom 10%",
        scrub: true,
        markers: false,
        toggleActions: "resume pause reverse pause"
      }
    });
    panel_tl.from(panel, { opacity: 0, duration: 0.5 });
    panel_tl.to(panel, { opacity: 0, duration: 0.5 });
  });
};

</script>

<style scoped>
body,
html {
  margin: 0;
  background-color: black;
}

div.step {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 1em;
  margin: 10vh 1em 15vh auto;
  color: white;
}

#smooth-wrapper {
  overflow: hidden;
  position: relative;
  height: 140vh;
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

.box-a {
  height: 150vh;
}

.box-b {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.box-c {
  z-index: 3;
}

.year {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  position: absolute;
}

.year-title {
  position: absolute;
  left: 5vw;
}

.content-leftside,
.content-rightside {
  width: 25vw;
  background-color: red;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bubble {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gradient-black {
  background: none;
  color: white;

}

.line {
  height: 50px;
  background: black;
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
  font-size: 3rem;
}

.hover-icon {
  position: fixed;
  left: 1rem;
  /* Position the icon on the left side */
}

.hover-icon::after {
  content: "Here is some help!";
  position: absolute;
  top: 100%;
  /* Position the tooltip below the icon */
  left: 0;
  /* Align the tooltip with the left side of the icon */
  width: fit-content;
  /* Adjust width based on content */
  padding: 10px;
  /* Add padding for better readability */
  color: white;
  background-color: rgba(255, 255, 255, 0.4);
  visibility: hidden;
  transition: opacity 0.3s ease;
  font-size: 0.7rem;
  opacity: 0;
  font-family: 'Franie', sans-serif;
}

.hover-icon:hover::after {
  visibility: visible;
  opacity: 1;
}


.help {
  color: white;
  margin-top: 2vh;
  font-family: 'Material Symbols Rounded';
  font-size: 2rem;
  opacity: 0.4;
  margin: 1rem;
  right: 0;
  z-index: 10;
  /* Optional: Set a higher z-index if needed */
}

footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150vh;
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