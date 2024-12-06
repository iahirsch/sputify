<template>
    <div class="journey-sections" :id="badgeIndex">
        <h2 data-year="Your Badges">Your Badges</h2>
        <div class="badges">
            <div v-for="badge in badges" :badge="badge" class="container-badge">
                <svg viewBox="0 0 500 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" class="zigzag">
                    <path stroke="#35bd69" fill="none" stroke-width="15"
                        d="M 500,250 473.216,279.409 491.536,314.718 458.049,336.172 466.532,375.03 428.619,387.055
                        426.778,426.778 387.044,428.619 375.02,466.543 336.161,458.049 314.707,491.547 279.409,473.226 250,500 220.581,473.226
                        185.282,491.547 163.818,458.049 124.959,466.543 112.945,428.619 73.222,426.778 71.371,387.044 33.458,375.021 41.941,336.172
                        8.453,314.718 26.774,279.409 0,250 26.774,220.591 8.453,185.282 41.941,163.829 33.458,124.97 71.371,112.956 73.222,73.222
                        112.956,71.381 124.97,33.468 163.829,41.952 185.282,8.463 220.581,26.784 250,0 279.409,26.784 314.718,8.463 336.172,41.962
                        375.03,33.468 387.044,71.381 426.778,73.232 428.619,112.966 466.532,124.98 458.049,163.839 491.536,185.282 473.216,220.591 z" />
                </svg>
                <span class="material-symbols-rounded badge">{{ badge.icon }}</span>
                <h5 class="badge-title">
                    {{ badge.title }}
                </h5>
                <p class="badge-text">
                    {{ badge.text }}
                </p>
            </div>
        </div>
    </div>
    <div class="line"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    badges: {
        type: Array,
        required: true
    },
    badgeIndex: {
        type: Number,
        required: true
    }
});

onMounted(() => {

});
</script>

<style scoped>
h2 {
    margin-left: 5vw;
}

.badges {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    margin-top: 5vh;
    max-height: 80vh;
    overflow: hidden;
    flex-direction: column;
}

.badge {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    padding: 1vh;
    color: white;
    font-size: 2.5rem;
    z-index: 2;
}

.container-badge {
    display: flex;
    align-items: center;
    margin-left: 5vw;
    cursor: default;
    height: 7rem;
}

.badge-title {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 2vh;
    justify-content: center;
    width: fit-content;
    max-width: 20vw;
}

.badge-text {
    visibility: hidden;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 2vh;
    justify-content: center;
    width: 20vw;
    position: absolute;
    left: 25vw;
}

.zigzag {
    width: 5rem;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 4vw;
    overflow: visible;
    filter: drop-shadow(0 0 0.5rem #35bd69);
}

@keyframes glow {
    0% {
        filter: drop-shadow(0 0 0.1rem #1DB954);
    }

    50% {
        filter: drop-shadow(0 0 0.5rem #4DD4AC);
    }

    100% {
        filter: drop-shadow(0 0 0.1rem #1DB954);
    }
}

.container-badge:hover {
    .badge {
        animation: glow 2s ease-in-out infinite alternate;
    }

    .badge-text {
        visibility: visible;
    }
}

.line {
    height: 250px;
    background: none;
}
</style>