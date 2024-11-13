<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  <div id="smooth-wrapper" ref="main">
    <div id="smooth-content">
      <!-- Intro section (Box A) -->
      <div class="box box-a gradient-black" data-speed="0.5">
        <div class="content">
          <h1>Birdos Music Journey</h1>
          <span class="material-symbols-outlined">keyboard_double_arrow_down</span>
        </div>
      </div>
      <div class="box box-b gradient-black">
        <div class="content-leftside">
          <div class="step">
            <p>Artist</p>
          </div>
          <div class="step">
            <p>Album</p>
          </div>
          <div class="step">
            <p>Song</p>
          </div>
        </div>

        <div class="bubble" data-speed="0.5">
          <BubbleVisualizer :data="audioAnalysisData" />
        </div>

        <div class="content-rightside">
          <div class="step">
            <p>Artist</p>
          </div>
          <div class="step">
            <p>Album</p>
          </div>
          <div class="step">
            <p>Song</p>
          </div>
        </div>
      </div>

      <div class="box box-c gradient-black">test</div>
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
        markers: true,
        toggleActions: "resume pause reverse pause"
      }
    });
    panel_tl.from(panel, { opacity: 0, duration: 0.5 });
    panel_tl.to(panel, { opacity: 0, duration: 0.5 });
  });
};

</script>

<style scoped>
body, html {
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

.box-b {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-leftside,
.content-rightside {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between the .step elements */
}

.bubble {
  flex: 1;
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

footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 120vh;
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