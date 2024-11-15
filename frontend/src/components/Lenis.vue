<template>
  <div id="app">test
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Lenis from 'lenis';

onMounted(() => {
  const lenis = new Lenis({
    duration: 1.2, // Adjust duration as needed
    easing: (t) => t * t,
    direction: 'vertical',
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});
</script>