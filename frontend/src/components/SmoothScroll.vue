<template>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0" />

  <div id="smooth-wrapper" ref="main">
    <span class="material-symbols-rounded help hover-icon">help</span>
    <div id="smooth-content">
      <div class="box box-a gradient-black" data-speed="0.5">
        <WelcomeComponent />
      </div>
      <div class="box box-b gradient-black">
        <h1 class="year-title">recently</h1>
        <div class="year">
          <div class="content-leftside">
            <h2>your top songs</h2>
            <div class="song">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="song-name">Song 1<br><span class="song-artist">Artist 1</span></p>
            </div>
            <div class="song">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="song-name">Song 2<br><span class="song-artist">Artist 2</span></p>
            </div>
            <div class="song">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="song-name">Song 3<br><span class="song-artist">Artist 3</span></p>
            </div>
            <div class="song">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="song-name">Song 4<br><span class="song-artist">Artist 4</span></p>
            </div>
            <div class="song">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="song-name">Song 5<br><span class="song-artist">Artist 5</span></p>
            </div>
            <div style="height: 200px;"></div>
            <h2>your top artists</h2>
            <div class="artist">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="artist-name">Artist 1<br><span class="artist-song">Song 1</span></p>
            </div>
            <div class="artist">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="artist-name">Artist 2<br><span class="artist-song">Song 2</span></p>
            </div>
            <div class="artist">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="artist-name">Artist 3<br><span class="artist-song">Song 3</span></p>
            </div>
            <div class="artist">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="artist-name">Artist 4<br><span class="artist-song">Song 4</span></p>
            </div>
            <div class="artist">
              <span class="material-symbols-rounded play-icon">play_arrow</span>
              <p class="artist-name">Artist 5<br><span class="artist-song">Song 5</span></p>
            </div>
          </div>
          <div class="content-rightside">
            <h2>your top genres</h2>
            <div class="genre-container">
              <p class="genre">k-pop</p>
              <p class="genre current-genre">r&b</p>
              <p class="genre">pop</p>
              <p class="genre">k-pop girl group</p>
              <p class="genre">mandopop</p>
            </div>
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
      endTrigger: '.box-c',
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
* {
  font-family: Arial, Helvetica, sans-serif;
}

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

h2 {
  font-size: 2rem;
  margin: 1rem;
}

.play-icon {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.3);
}

.play-icon:hover {
  color: rgba(255, 255, 255, 0.8);
}

.song,
.artist {
  display: flex;
  align-items: center;
  justify-content: left;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 20px;
  padding: 0.5rem;
}

.song:hover,
.artist:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);

}

.song-name,
.artist-name {
  font-size: 1rem;
}

.song-artist,
.artist-song {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.genre-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.genre {
  width: fit-content;
  max-width: 20vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  margin: 0.5rem;
  padding: 1rem 2rem;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
}

.current-genre {
  border: white 2px solid;
}

.year {
  display: flex;
  justify-content: space-between;
  width: 90vw;
  position: absolute;
}

.year-title {
  position: absolute;
  left: 5vw;
  top: 0;
  font-size: 5rem;
}

.content-leftside {
  padding-top: 200px;
}

.box-c {
  z-index: 3;
}

h2 {
  font-size: 2rem;
  margin: 1rem;
}

.play-icon {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.3);
}
.play-icon:hover {
  color: rgba(255, 255, 255, 0.8);
}
.song, .artist {
  display: flex;
  align-items: center;
  justify-content: left;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 20px;
  padding: 0.5rem;
}
.song:hover, .artist:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  
}

.song-name, .artist-name {
  font-size: 1rem;
}
.song-artist, .artist-song {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.genre-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.genre{
  width: fit-content;
  max-width: 20vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  margin: 0.5rem;
  padding: 1rem 2rem;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
}
.current-genre {
  border: white 2px solid;
}

.year {
  display: flex;
  justify-content: space-between;
  width: 90vw;
  position: absolute;
}

.year-title {
  position: absolute;
  left: 5vw;
  top: 0;
  font-size: 5rem;
}

.content-leftside{
  padding-top: 200px;
}
.content-leftside,
.content-rightside {
  width: 30vw;
  display: flex;
  flex-direction: column;
}

.bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
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
  flex-direction: column;
  align-items: center;
}

.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-size: 3rem;
  cursor: pointer;
}

.hover-icon {
  position: fixed;
  right: 1rem;
}

.hover-icon::after {
  content: "Here is some help!";
  position: absolute;
  top: 120%;
  right: 0;
  width: fit-content;
  padding: 10px;
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