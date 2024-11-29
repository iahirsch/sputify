<template>
  <div class="popup" v-if="showPopup">
    <div class="popup-content">
      <span class="material-symbols-rounded close" @click="closePopup">close</span>
      <span class="material-symbols-rounded headphones">headphones</span>
      <h2>Use headphones for a better experience.</h2>
      <button @click="closePopup">
        <p>OK</p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showPopup = ref(true);

function closePopup() {
  showPopup.value = false;
  document.body.style.overflowY = 'auto';
}
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
}

.popup-content {
    position: relative;
    background-image: linear-gradient(#1DB954, #4DD4AC);
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5rem 5rem black;
    text-align: center;
    max-width: 60vw;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.popup-content h2 {
    width: 20vw;
    min-width: fit-content;
    padding: 1rem;
    font-size: 1.2rem;
    color: white;
    text-shadow: 0 0 2rem black;
}

.popup-content button {
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
    border: none;
    transition-duration: 0.4s;
    padding: 1rem 2rem;
}

.popup-content button:hover {
    background: white;
    transform: scale(1.1);
}

.close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.6);
}

.close:hover {
    color: white;
    cursor: pointer;
}

.headphones {
    font-size: 3rem;
    color: white;
}
</style>