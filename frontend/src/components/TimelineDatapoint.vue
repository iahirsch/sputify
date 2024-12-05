<template>
    <div :style="positionStyle" class="container" @click="scrollToPoint">
        <div :class="['yearTitle', { active }]">{{ title }}</div>
        <div :class="['datapoint', { active }]"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    positionStyle: {
        type: Object,
        required: true,
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
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.yearTitle {
    margin-right: 20px;
    white-space: nowrap;
    transition: font-size 0.3s ease;
    font-family: 'FranieSemiBold', sans-serif;
    font-size: 0.8em;
    color: rgba(255, 255, 255, 0.8);
}

.yearTitle.active {
    font-family: 'FranieBlack', sans-serif;
    color: white;
    font-size: 1.5em;
}

.datapoint {
    width: 20px;
    height: 20px;
    background-color: #333333;
    border: 0.8px solid white;
    border-radius: 50%;
}

.datapoint.active {
    background-color: white;
    color: white;
}
</style>
