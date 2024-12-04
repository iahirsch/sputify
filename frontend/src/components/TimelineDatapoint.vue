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
        element.scrollIntoView({ behavior: 'smooth' });
    }
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: baseline;
    cursor: pointer;
}

.yearTitle {
    margin-right: 20px;
    white-space: nowrap;
    transition: font-size 0.3s ease;
    font-family: 'Franie', sans-serif;
    font-size: 0.8em;
    font-weight: 100;
    color: #b8b8b8;
}

.yearTitle.active {
    font-weight: 550;
    color: white;
    font-size: 1.6em;
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
