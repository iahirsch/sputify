<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';


gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const main = ref();
let smoother;
let ctx;

const scrollTo = () => {
  smoother.scrollTo('body', true, '0px, 0px');
};

onMounted(() => {
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

onUnmounted(() => {
  ctx.revert();
});
</script>

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
      <!-- Bubble image section (Box B) -->
      <div class="box box-b gradient-black">
        <img src="../assets/bubble.png" alt="bubble" class="bubble" />
      </div>

      <div class="box box-c gradient-black" data-speed="1.5">Box C</div>
      <div class="line"></div>
      <footer class="footer gradient-black">
        <button @click="scrollTo">Scroll to the Top</button>
      </footer>
    </div>
  </div>
</template>

<style>
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

.material-symbols-outlined {
  font-size: 3rem;
  /* Adjust icon size as needed */
  margin-top: 1rem;
  /* Add some space between heading and icon */
}

.footer {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
