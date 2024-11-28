<template>
  <div class="year">
    <h1 class="year-title">{{ year.title }}</h1>
    <div class="content-leftside">
      <h2>your top songs</h2>
      <div v-if="year.topTracks.length > 0">
        <div v-for="(track) in year.topTracks" :key="track.id" class="song"
          :class="{ 'currently-playing': track.id === currentTrack.id }" @click="playTrack(track)">
          <span class="material-symbols-rounded play-icon">
            {{ track.id === currentTrack.id && playing ? 'pause' : 'play_arrow' }}
          </span>
          <img class="albumCover" :src="track.album.images[0].url" alt="album cover" />
          <p class="song-name">
            {{ track.name }}<br>
            <span class="song-artist">{{ track.artists[0].name }}</span>
          </p>
        </div>
      </div>
      <div v-else>
        <p class="loading">Loading top tracks...</p>
      </div>
      <div style="height: 40vh;"></div>
      <h2>your top artists</h2>
      <div v-if="year.topArtists.length > 0">
        <div v-for="(artist, index) in year.topArtists" :key="index" class="artist"
          :class="{ 'currently-playing': artist.tracks && artist.tracks[0] && artist.tracks[0].id === currentTrack.id }"
          @click="playTrack(artist.tracks[0])">
          <span class="material-symbols-rounded play-icon">
            {{ artist.tracks && artist.tracks[0] && artist.tracks[0].id === currentTrack.id && playing ? 'pause' :
            'play_arrow' }}
          </span>
          <p class="artist-name">
            {{ artist.name }}<br>
            <span v-if="artist.tracks.length > 0" class="artist-song">{{ artist.tracks[0].name }}</span>
          </p>
        </div>
      </div>
      <div v-else>
        <p class="loading">Loading top artists...</p>
      </div>
    </div>
    <div class="content-rightside">
      <h2>your top genres</h2>
      <div v-if="year.topGenres.length > 0" class="genre-container">
        <p v-for="(genre, index) in year.topGenres" :key="index" class="genre"
          :class="{ 'current-genre': false }">{{ genre }}</p>
      </div>
      <div v-else>
        <p class="loading">Loading top genres...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  year: Object,
  currentTrack: Object,
  playing: Boolean,
  playTrack: Function
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
  font-size: 5rem;
  color: rgba(255, 255, 255, 0.5);
}

.content-leftside,
.content-rightside {
  width: 30vw;
  display: flex;
  flex-direction: column;
  padding-top: 200px;
}

.content-rightside {
  text-align: right;
}

.song,
.artist {
  display: flex;
  align-items: center;
  justify-content: left;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 20px;
  padding: 0.5rem;
  margin: 0.5rem;
}

.song:hover,
.artist:hover {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);

  .play-icon {
    color: rgba(255, 255, 255, 0.3);
  }
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

.albumCover {
  width: 3vw;
  margin-right: 2%;
  opacity: 1;
  filter: grayscale(100%);
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.albumCover:hover {
  opacity: 1;
  filter: grayscale(0%);
}

.currently-playing .albumCover {
  filter: grayscale(0%);
  opacity: 1;
}


.currently-playing {
  background-color: rgba(255, 255, 255, 0.1);

  .play-icon {
    color: rgba(255, 255, 255, 0.3);
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
  border-radius: 50px;
}

.loading {
  color: rgba(255, 255, 255, 0.5);
}
</style>