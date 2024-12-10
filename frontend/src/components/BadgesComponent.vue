<template>
    <div class="journey-sections" :id="badgeIndex">
        <h2 data-year="Your Badges">Your Badges</h2>
        <div class="badges">
            <div v-for="(badge, index) in filteredBadges" :key="index" :badge="badge" class="container-badge">
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
                <span class="material-symbols-rounded more">chevron_left</span>
                <p class="badge-text" :title="badge.text">
                    {{ badge.text }}
                </p>
            </div>
        </div>
    </div>
    <div class="line"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import sound from '@/assets/sound.wav';

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

const showBadge = ref([]);

onMounted(() => {
    const trigger = document.querySelector(".badges");

    const handleScroll = () => {
        const rect = trigger.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            props.badges.forEach((badge, index) => {
                setTimeout(() => {
                    showBadge.value[index] = true;
                    const audio = new Audio(sound);
                    audio.play().catch(() => {
                        console.log("Sound could not be played");
                    });
                }, index * 1000 + 1000);
            });
            window.removeEventListener("scroll", handleScroll);
        }
    };

    window.addEventListener("scroll", handleScroll);
});

const filteredBadges = computed(() => {
    return props.badges.filter((badge, index) => showBadge.value[index]);
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
    height: 35rem;
    max-height: 80vh;
    overflow: hidden;
    flex-direction: column;
}

.badge {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    padding: 0.6rem;
    color: white;
    font-size: 2.5rem;
    z-index: 2;
}

.container-badge {
    display: flex;
    align-items: center;
    margin-left: 10vw;
    cursor: default;
    height: 7rem;
    max-width: 50vw;
    width: fit-content;
    padding-right: 1rem;
    border-radius: 2rem;
    animation: show 1s ease-in-out;
}

@keyframes show {
    0% {
        opacity: 0;
        transform: scale(0.1) translateX(-20vw);
    }

    100% {
        opacity: 1;
        transform: scale(1) translateX(0);
    }
}

.badge-title {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 3vw;
    justify-content: center;
    width: fit-content;
    max-width: 20vw;
}

.more {
    font-size: 3rem;
    color: rgba(255, 255, 255, 0.4);
    margin-left: 1rem;
    visibility: hidden;
}

.badge-text {
    visibility: hidden;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.4);
    justify-content: center;
    width: 20vw;
    max-height: 6rem;
    left: 25vw;
    overflow: hidden;
}

.zigzag {
    width: 5rem;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    transform: translate(-0.7rem, 0);
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

    background: linear-gradient(90deg, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.8) 50%);

    .badge {
        animation: glow 2s ease-in-out infinite alternate;
    }

    .badge-text {
        visibility: visible;
    }

    .more {
        visibility: visible;
    }
}

.line {
    height: 250px;
    background: none;
}

@media screen and (max-width: 1000px) {
    .container-badge {
        max-width: 80vw;
        width: 80vw;
    }

    .badges {
        height: 50rem;
    }

    .badge-title {
        margin-left: 2rem;
        font-size: 1.2rem;
        max-width: 30vw;
        width: fit-content;
    }

    .badge-text {
        width: fit-content;
        font-size: 1rem;
        max-height: 6.5rem;
    }

    .more {
        margin-left: 2vw;
        font-size: 2rem;
    }

}
</style>