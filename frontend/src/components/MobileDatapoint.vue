<template>
    <div class="container" @click="scrollToPoint">
        <div :class="['datapoint', { active }]"></div>
        <div :class="['yearTitle', { active }]">{{ title }}</div>
    </div>
</template>

<script setup>

import { toggleSidebar } from './MobileTimeline.vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false,
    },
});

const scrollToPoint = () => {
    const element = document.querySelector(`[data-year="${props.title}"]`);
    if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    setTimeout(() => {
        toggleSidebar();
    }, 1000);
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 1rem;
}

.yearTitle {
    margin-right: 20px;
    white-space: nowrap;
    transition: font-size 0.3s ease;
    font-family: 'FranieSemiBold', sans-serif;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    padding-top: 0.3rem;
}

.yearTitle.active {
    font-family: 'FranieBlack', sans-serif;
    font-size: 1.5rem;
    color: white;
}

.datapoint {
    min-width: 1rem;
    height: 1rem;
    background-color: #333333;
    border: 0.8px solid white;
    border-radius: 50%;
    margin-right: 0.5rem;
}

.datapoint.active {
    background-color: white;
    color: white;
}
</style>
