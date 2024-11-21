<template>
    <div class="content">
        <h1 ref="title" class="title"><span class="name">{{ userName }}'s</span> Music Journey</h1>
        <span class="material-symbols-rounded arrow-icon">keyboard_double_arrow_down</span>
    </div>
</template>

<script setup>
const props = defineProps({
    userName: String
});
import { onMounted, ref } from 'vue';
import gsap from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger); // Only register ScrollTrigger (not ScrollSmoother)

const title = ref(null);

onMounted(() => {
    gsap.fromTo(title.value, {
        y: -400,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: 'power2.out'
    });
});
</script>

<style scoped>
.title {
    text-align: center;
}

.name {
    background: -webkit-linear-gradient(180deg, #4DD4AC 0%, #1DB954 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 150vh;
    font-family: 'Franie', sans-serif;
    font-size: 3rem;
    color: white;
}


.arrow-icon {
    font-size: 3rem;
    animation: arrow-bounce 2s infinite;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0.3;
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