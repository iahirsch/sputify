<template>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded" rel="stylesheet" />
    <div class="content">
        <div class="container">
            <h1 ref="topH1" class="username">{{ userName }}'s</h1>
            <h2>_</h2>
            <h1 ref="bottomH1">Music Journey</h1>
        </div>
        <span class="material-symbols-rounded arrow">keyboard_double_arrow_down</span>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { getUserInfo } from '../api/user.js';

gsap.registerPlugin(ScrollTrigger); // Only register ScrollTrigger (not ScrollSmoother)

const topH1 = ref(null);
const bottomH1 = ref(null);
const userName = ref('');

getUserInfo().then(response => {
    userName.value = response.display_name;
}).catch(error => {
    console.error("Error fetching user info:", error);
});
console.log("User Name: ", userName);

onMounted(() => {
    gsap.fromTo(topH1.value, {
        y: 400,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: 'power2.out'
    });

    gsap.fromTo(bottomH1.value, {
        y: -200,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
        delay: 0.2 // Delay the second animation to create a staggered effect
    });
});

onBeforeUnmount(() => {
    // Clean up GSAP animations when the component unmounts for better performance
    gsap.killTweensOf(topH1.value);
    gsap.killTweensOf(bottomH1.value);
    gsap.killTweensOf(arrow.value);
});
</script>

<style scoped>
h2 {
    opacity: 0;
}

h5 {
    font-family: 'Franie', sans-serif;
}

.username {
    font-family: 'Franie', sans-serif;
    background: -webkit-linear-gradient(180deg, #4DD4AC 0%, #1DB954 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Franie', sans-serif;
    font-size: 3rem;
    color: white;
}

.conten {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 150vh;
}

.material-symbols-rounded {
    margin-top: 2vh;
    font-family: 'Material Symbols Rounded';
    font-size: 3rem;
    opacity: 0.3;
}


.arrow {
    animation: arrow-bounce 2s infinite;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

@keyframes arrow-bounce {
    0% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-30px);
    }

    100% {
        transform: translateY(0);
    }
}
</style>