<template>
    <div :class="['datapoint', { active }]" :style="positionStyle">
        <!-- Add any content or styling for the datapoint here -->
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    positionStyle: {
        type: Object,
        required: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});
</script>

<style scoped>
.datapoint {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background-color: #333333;
    border: 0.8px solid white;
    border-radius: 50%;
}

.datapoint.active {
    background-color: white;
}
</style>
