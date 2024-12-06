<template>
    <div class="journey-sections" :id="yearIndex">
        <div class="year" ref="year" v-if="year && year.topTracks">
            <div class="year-title" :data-year="year.title"></div>
            <div class="content-leftside">
                <h2>Your Top Songs</h2>
                <div v-if="year.topTracks.length > 0">
                    <div v-for="(track) in year.topTracks" :key="track.id" class="song"
                        :class="{ 'currently-playing': track.id === currentTrack.id }" @click="playTrack(track)">
                        <span class="material-symbols-rounded play-icon">
                            {{ track.id === currentTrack.id && playing ? 'pause' : 'play_arrow' }}
                        </span>
                        <img class="albumCover cover" :src="track.album.images[0].url" alt="album cover" />
                        <p class="song-name">
                            {{ track.name }}<br>
                            <span class="song-artist">{{ track.artists[0].name }}</span>
                        </p>
                    </div>
                </div>
                <div v-else>
                    <p class="loading">Loading Top Tracks...</p>
                </div>
                <div class="line"></div>
                <h2>Your Top Artists</h2>
                <div v-if="year.topArtists.length > 0">
                    <div v-for="(artist, index) in year.topArtists" :key="index" class="artist"
                        :class="{ 'currently-playing': artist.name === currentTrack.artist }">
                        <div @click="open(artist)" class="artistHead">
                            <span :style="{ color: artist.tracks.length > 0 ? '' : 'transparent' }"
                                class="material-symbols-rounded accordeon-icon"
                                :class="{ 'rotate-icon': selectedArtist === artist }">chevron_right
                            </span>
                            <img class="artistCover cover" :src="artist.images[0].url" alt="artist image" />
                            <p class="artist-name">
                                {{ artist.name }}<br>
                            </p>
                        </div>
                        <div class="artistSongs"
                            :style="{ height: selectedArtist === artist && artist.tracks.length > 0 ? `${artist.tracks.length * 4.5 + 1.5}rem` : '0rem' }">
                            <div style="height: 1rem;"></div>
                            <div v-for="(track) in artist.tracks" :key="track.id" class="song"
                                :class="{ 'currently-playing': track.id === currentTrack.id }"
                                @click="playTrack(track)">
                                <span class="material-symbols-rounded play-icon">
                                    {{ track.id === currentTrack.id && playing ? 'pause' : 'play_arrow' }}
                                </span>
                                <img class="albumCover cover" :src="track.album.images[0].url" alt="album cover" />
                                <p class="song-name">
                                    {{ track.name }}<br />
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-else>
                    <p class="loading">Loading Top Artists...</p>
                </div>
                <div class="container-badge">
                    <div class="zigzag">
                        <span class="material-symbols-rounded ">Favorite</span>
                    </div>
                    <h5 class="badge-text">
                        You're obsessed with
                        <span style="color: #1DB954;" v-if="year.topArtists.length > 0">{{ year.topArtists[0].name }}</span>
                        <span v-else>loading...</span>
                        lately
                    </h5>
                </div>
            </div>
            <div class="content-center" ref="genre">
                <h3 class="top-genre-text">Your Top Genres</h3>
                <div v-if="year.topGenres.length > 0" class="genre-container">
                    <p v-for="(genre, index) in year.topGenres" :key="index" class="genre"
                        :class="{ 'current-genre': currentTrack.genres.includes(genre.name) }">
                        {{ genre.name }}
                    </p>
                </div>
                <div v-else>
                    <p class="loading">Loading top genres...</p>
                </div>
            </div>
            <div class="content-rightside">
            </div>
        </div>
        <div class="year" v-else-if="year && yearIndex === 0">
            <div class="year-title" :data-year="year.title"></div>
            <div class="content-leftside">
                <h2>Recently Played Songs</h2>
                <div v-if="year.recentTracks.length > 0">
                    <div v-for="(track) in year.recentTracks" :key="track.id" class="song"
                        :class="{ 'currently-playing': track.id === currentTrack.id }" @click="playTrack(track)">
                        <span class="material-symbols-rounded play-icon">
                            {{ track.id === currentTrack.id && playing ? 'pause' : 'play_arrow' }}
                        </span>
                        <img class="albumCover cover" :src="track.album.images[0].url" alt="album cover" />
                        <p class="song-name">
                            {{ track.name }}<br>
                            <span class="song-artist">{{ track.artists[0].name }}</span>
                        </p>
                    </div>
                </div>
                <div v-else>
                    <p class="loading">Loading Recently Played Tracks...</p>
                </div>
            </div>
            <div class="content-rightside">
            </div>
        </div>
    </div>
    <div class="line"></div>
</template>

<script setup>
import {onMounted, useTemplateRef, ref } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
const genreRef = useTemplateRef('genre');
const yearRef = useTemplateRef('year');

defineProps({
    yearIndex: Number,
    year: Object,
    currentTrack: Object,
    playing: Boolean,
    playTrack: Function
});

const selectedArtist = ref(null);

function open(artist) {
    if (selectedArtist.value === artist) {
        selectedArtist.value = null;
    } else {
        selectedArtist.value = artist;
    }
}

onMounted(async () => {
    console.log(genreRef.value)
    console.log(yearRef.value)
    if (genreRef.value && yearRef.value) {

        ScrollTrigger.create({
            trigger: yearRef.value,
            pin: genreRef.value,
            start: "top top", // when the top of the trigger hits the top of the viewport
            end: 'bottom bottom',
            markers: false
        });
    }
});

</script>



<style scoped>
.year {
    display: flex;
    justify-content: space-between;
    width: 90vw;
    left: 5vw;
    position: relative;
    z-index: 1;
}

.year-title {
    position: absolute;
    left: 0;
    top: 0;
}

.content-leftside,
.content-rightside,
.content-center {
    width: 30vw;
    display: flex;
    flex-direction: column;
}

.content-center {
    margin-top: 25%;
}

.content-rightside {
    text-align: right;
}

.song {
    display: flex;
    align-items: center;
    justify-content: left;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 1rem;
    padding: 0.5rem;
    margin: 0.5rem;
}

.artist {
    background-color: rgba(255, 255, 255, 0);
    border-radius: 1rem;
    padding: 0.5rem;
    margin: 0.5rem;
}

.artistHead {
    display: flex;
    align-items: center;
    justify-content: left;
}

.accordeon-icon {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.3);
    margin-right: 0.25rem;
    transition-duration: 0.4s;
}

.rotate-icon {
    transform: rotate(90deg);
}

.artistSongs {
    overflow: hidden;
    transition: height 0.2s ease-in-out;
}

.song:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);

    .play-icon {
        color: rgba(255, 255, 255, 0.3);
    }
}

.artist:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
}

.play-icon {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0);
    margin-right: 0.25rem;
}

.play-icon:hover {
    color: rgba(255, 255, 255, 0.8) !important;
}

.song-name,
.artist-name {
    font-size: 1.2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
}

.song-artist,
.artist-song {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
}

.cover {
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    opacity: 1;
    filter: grayscale(100%);
    transition: filter 0.3s ease, opacity 0.3s ease;
}

.artistCover {
    border-radius: 50%;
    object-fit: cover;
}

.currently-playing.song {
    background-color: rgba(255, 255, 255, 0.1);

    .play-icon {
        color: rgba(255, 255, 255, 0.3);
    }

    .cover {
        filter: grayscale(0%);
        opacity: 1;
    }
}

.currently-playing.artist {
    background-color: rgba(255, 255, 255, 0.1);

    .artistCover {
        filter: grayscale(0%);
        opacity: 1;
    }
}

.genre-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    max-height: 7.5rem;
    overflow: hidden;
}

.top-genre-text {
    color: rgba(255, 255, 255, 0.6);
    /* color: white; */
    margin-top: 4rem;
    text-align: center;
}

.genre {
    width: fit-content;
    max-width: 20vw;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.2rem;
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    color: rgba(255, 255, 255, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 2rem;
    cursor: default;
}

.current-genre {
    border-color: rgba(255, 255, 255, 0);
    background-color: rgba(255, 255, 255, 0.6);
    color: rgba(0, 0, 0, 1);
    font-weight: 700;
}

.loading {
    color: rgba(255, 255, 255, 0.5);
}

.line {
    height: 250px;
    background: none;
}

.zigzag {
    width: 10vw;
    height: 10vh;
    background:
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(16.36deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(32.73deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(49.09deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(65.45deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(81.81deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(98.18deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(114.54deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(130.90deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(147.27deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>"),
        url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-97 -3 256 262' stroke-dasharray='45, 35' stroke='lightgreen' stroke-width='6' fill='transparent' style='transform:rotate(164.2deg);'><polygon points='48,16 32,0 16,16' /><polygon points='48,240 16,240 32,256' stroke-dashoffset='-32' /></svg>");
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    filter: drop-shadow(0 0 20px #35bd69);
}

.zigzag:hover {
    animation: svg-glow 1.5s ease-in-out infinite alternate;
}

.material-symbols-rounded {
    font-size: 2.5rem;
    z-index: 2;
}

@keyframes svg-glow {
    0% {
        filter: drop-shadow(0 0 5px #35bd69);
    }

    50% {
        filter: drop-shadow(0 0 15px #4DD4AC);
    }

    100% {
        filter: drop-shadow(0 0 5px #1DB954);
    }
}

.container-badge {
    display: flex;
    align-items: center;
    margin-top: 5vh;
    margin-left: 5vh;
}

.badge-text {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 2vh;
    justify-content: center;
}
</style>