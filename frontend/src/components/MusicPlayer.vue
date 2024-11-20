<template>
    <div class="player">
        <img :src="albumCover" alt="Album Cover" class="album-cover" />
        <div class="controls">
            <button @click="backward">
                <span class="material-symbols-rounded">skip_previous</span>
            </button>
            <button @click="togglePlayPause">
                <span class="material-symbols-rounded">play_arrow</span>
            </button>
            <button @click="forward">
                <span class="material-symbols-rounded">skip_next</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isPlaying = ref(false);
const albumCover = ref('path/to/album-cover.jpg'); // Replace with your album cover path

const togglePlayPause = () => {
    isPlaying.value = !isPlaying.value;
    // Add logic to play or pause the music
};

const forward = () => {
    // Add logic to skip to the next track
};

const backward = () => {
    // Add logic to skip to the previous track
};
</script>

<style scoped>
.player {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.album-cover {
    max-width: 300px;
    margin-bottom: 20px;
}

.controls {
    display: flex;
    justify-content: space-around;
    width: 60%;
}

button {
    background: none;
    border: none;
    cursor: pointer;
}

.material-symbols-rounded {
    color: #e8eaed;
    font-size: 2.5rem;
    font-variation-settings:
        'FILL' 1,
        'wght' 400,
        'GRAD' 0,
        'opsz' 48
}
</style>