<template>
    <div class="year">
        <h1 class="year-title">{{ year.title }}</h1>
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
                        <span class="material-symbols-rounded accordeon-icon"
                            :class="{'rotate-icon': selectedArtist === artist}">chevron_right
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
                            :class="{ 'currently-playing': track.id === currentTrack.id }" @click="playTrack(track)">
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
                <span class="material-symbols-rounded badge ">Favorite</span>
                <h5 class="badge-text">
                    you're obsessed with
                    <span v-if="year.topArtists.length > 0">{{ year.topArtists[0].name }}</span>
                    <span v-else>loading...</span>
                    lately
                </h5>
            </div>
        </div>
        <div class="content-rightside">
            <h2>your top genres</h2>
            <div v-if="year.topGenres.length > 0" class="genre-container">
                <p v-for="(genre, index) in year.topGenres" :key="index" class="genre"
                    :class="{ 'current-genre': false }">
                    {{
                        genre }}</p>
            </div>
            <div v-else>
                <p class="loading">Loading top genres...</p>
            </div>
        </div>
    </div>
    <div class="line"></div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
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
    font-size: 5rem;
    color: rgba(255, 255, 255, 0.5);
}

.content-leftside,
.content-rightside {
    width: 40vw;
    display: flex;
    flex-direction: column;
    padding-top: 200px;
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
    justify-content: flex-end;
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
    color: rgba(255, 255, 255, 0.8);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
}

.loading {
    color: rgba(255, 255, 255, 0.5);
}

.line {
    height: 250px;
    background: none;
}

.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-size: 2rem;
  padding: 1vh;
  color: white;
  /* background: -webkit-linear-gradient(180deg, #4DD4AC 0%, #1DB954 100%); */
  background-color: rgba(255, 255, 255, 0.3); 
  border-radius: 50%;
}
.badge:hover {
  /* Animation for smooth glow effect (optional) */
  animation: glow 1s ease-in-out infinite alternate;
}
@keyframes glow {
  0% {
    box-shadow: 0 0 0 5px #35bd69;
  }
  50% {
    box-shadow: 0 0 10px 10px #4DD4AC;
  }
  100% {
    box-shadow: 0 0 0 5px #1DB954;
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