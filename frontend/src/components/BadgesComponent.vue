<template>
    <div class="journey-sections" :id="badgeIndex">
        <h2 data-year="Your Badges">Your Badges</h2>
        <div class="badges">
            <div v-for="badge in badges" :key="badge.id" :badge="badge" class="container-badge">
                <span class="material-symbols-rounded badge">{{ badge.icon }}</span>
                <h5 class="badge-text">
                    {{ badge.text }}
                </h5>
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
        type: String,
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
    margin-left: 5vh;
}

.badge-text {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.8);
    margin-left: 2vh;
    justify-content: center;
    width: 20vw;
}

.line {
    height: 250px;
    background: none;
}
</style>