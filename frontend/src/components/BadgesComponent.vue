<template>
    <div class="journey-sections" :id="badgeIndex">
        <h2 data-year="Your Badges">Your Badges</h2>
        <div class="badges">
            <div v-for="badge in badges" :badge="badge" class="container-badge">
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
    font-size: 2rem;
    padding: 1vh;
    color: white;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
}

.container-badge {
    display: flex;
    align-items: center;
    margin-left: 5vw;
    cursor: default;
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

.bold {
    font-weight: bold;
}

.container-badge:hover {
    .badge {
        animation: glow 1s ease-in-out infinite alternate;
    }

    .badge-text {
        visibility: visible;
    }
}

@keyframes glow {
    0% {
        box-shadow: 0 0 0 0px #35bd69;
    }

    50% {
        box-shadow: 0 0 10px 10px #4DD4AC;
    }

    100% {
        box-shadow: 0 0 0 0px #1DB954;
    }
}

.line {
    height: 250px;
    background: none;
}
</style>
<template>
    <div class="journey-sections" :id="badgeIndex">
        <h2 data-year="Your Badges">Your Badges</h2>
        <div class="badges">
            <div v-for="badge in badges" :badge="badge" class="container-badge">
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
    font-size: 2rem;
    padding: 1vh;
    color: white;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
}

.container-badge {
    display: flex;
    align-items: center;
    margin-left: 5vh;
    cursor: default;
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

.bold {
    font-weight: bold;
}

.container-badge:hover {
    .badge {
        animation: glow 1s ease-in-out infinite alternate;
    }

    .badge-text {
        visibility: visible;
    }
}

@keyframes glow {
    0% {
        box-shadow: 0 0 0 0px #35bd69;
    }

    50% {
        box-shadow: 0 0 10px 10px #4DD4AC;
    }

    100% {
        box-shadow: 0 0 0 0px #1DB954;
    }
}

.line {
    height: 250px;
    background: none;
}
</style>