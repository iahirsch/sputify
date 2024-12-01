<template>
    <div class="timeline-container">
        <div class="timeline">
            <TimelineDatapoint v-for="n in datapoints" :key="n" :positionStyle="getCirclePosition(n)"
                :active="isActive(n)" />
        </div>
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import TimelineDatapoint from './TimelineDatapoint.vue';

const props = defineProps({
    datapoints: {
        type: Number,
        required: true,
        validator: (value) => value > 0,
    },
    active: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const { datapoints } = toRefs(props);

const getCirclePosition = (index) => {
    const position = (index - 1) / (datapoints.value - 1) * 100;
    return { top: `${position}%` };
};

const isActive = (index) => {
    // Define your logic to determine if the datapoint is active
    // For example, you can return true for the first datapoint
    return index === 1;
};
</script>

<style scoped>
.timeline-container {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
}

.timeline {
    position: relative;
    height: 80vh;
    width: 1px;
    background-color: #9c9c9c;
    margin-right: 40px;
    top: 10%
}
</style>