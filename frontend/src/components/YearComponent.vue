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
                        <img class="cover" :src="track.album.images[0]?.url" alt="album cover" />
                        <p class="song-name">
                            {{ track.name }}<br>
                            <span class="song-artist">{{ track.artists[0]?.name }}</span>
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
                            <img class="artistCover cover" :src="artist.images[0]?.url" alt="artist image" />
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
                                <img class="cover" :src="track.album.images[0]?.url" alt="album cover" />
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
            </div>
            <div class="content-center" ref="genre">
                <h3 class="top-genre-text">Your Top Genres</h3>
                <div v-if="year.topGenres.length > 0" class="genre-container">
                    <div v-for="(genre, index) in year.topGenres" :key="index" class="genre"
                        :class="{ 'current-genre': currentTrack.genres.includes(genre.name) }">
                        {{ genre.name }}
                        <div class="genre-artists">
                            <img v-for="(artist, index) in genre.artists" :key="index" class="genre-artist"
                                :style="{ '--index': index }" :src="artist.images[0]?.url" :title="artist.name">
                        </div>
                    </div>
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
                        <img class="cover" :src="track.album.images[0]?.url" alt="album cover" />
                        <p class="song-name">
                            {{ track.name }}<br>
                            <span class="song-artist">{{ track.artists[0]?.name }}</span>
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
import { onMounted, onUnmounted, useTemplateRef, ref } from 'vue';
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
    let scrollTriggerInstance = null;

    const createScrollTrigger = () => {
        if (window.innerWidth > 1000 && genreRef.value && yearRef.value) {
            scrollTriggerInstance = ScrollTrigger.create({
                trigger: yearRef.value,
                pin: genreRef.value,
                start: "center 97%",
                end: 'bottom 95%',
                markers: false
            });
        }
    };

    const handleResize = () => {
        if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
            scrollTriggerInstance = null;
        }
        createScrollTrigger();
    };

    window.addEventListener('resize', handleResize);

    createScrollTrigger();

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
        }
    });
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
    height: fit-content;
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
    padding: 0.4rem 1rem 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 2rem;
    cursor: default;
    display: flex;
}

.genre:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.current-genre {
    border-color: rgba(255, 255, 255, 0);
    background-color: rgba(255, 255, 255, 0.6);
    color: rgba(0, 0, 0, 1);
    font-weight: 700;
}

.current-genre:hover {
    background-color: rgba(255, 255, 255, 0.45);
}

.genre-artists {
    display: none;
    position: fixed;
    width: 8rem;
    height: 2rem;
    transform: translate(0, -2rem);
}

.genre-artist {
    width: 2rem;
    height: 2rem;
    object-fit: cover;
    border-radius: 50%;
    margin-left: 0.5rem;
    position: absolute;
    transform: translate(calc(0.5rem + 2.5rem * var(--index)), 0);
    box-shadow: 0 0 1rem 0 black;
    display: block;
}

.genre:hover,
.genre-artists:hover {
    .genre-artists {
        display: flex;
    }
}

.loading {
    color: rgba(255, 255, 255, 0.5);
}

.line {
    height: 250px;
    background: none;
}

@media screen and (max-width: 1000px) {
    .year {
        flex-direction: column;
    }

    .content-leftside {
        width: 85vw;
    }

    .content-rightside {
        display: none;
    }

    .content-center {
        width: 85vw;
        position: absolute;
        margin: 0;
        top: 27rem;
    }

    .top-genre-text {
        width: 85vw;
    }

    .genre-container {
        max-height: 6rem;
    }

    .genre {
        max-width: 70vw;
        font-size: 1rem;
        padding: 0.2rem 0.7rem 0.4rem;
        margin: 0.4rem;
    }

    .genre-artists {
        width: 6rem;
        height: 1.5rem;
        position: absolute;
    }

    .genre-artist {
        width: 1.8rem;
        height: 1.8rem;
        transform: translate(calc(2.2rem * var(--index)), 0.4rem);
    }

    .end {
        height: 0;
    }
}
</style>