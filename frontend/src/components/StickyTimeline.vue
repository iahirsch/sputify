<template>
    <div class="timeline-container">
        <div class="timeline-content">
            <TimelineDatapoint v-for="(title, index) in yearsTitles" :key="index"
                :positionStyle="getCirclePosition(index + 1)" :active="isActive(index + 1)" :title="title" />
        </div>
        <span class="timeline"></span>
    </div>
</template>

<script setup>
import { toRefs } from 'vue';
import TimelineDatapoint from './TimelineDatapoint.vue';

const props = defineProps({
    yearsTitles: {
        type: Array,
        required: true,
        validator: (value) => value.length > 0, //must be a non-empty array. If an empty array is passed, Vue will issue a warning in the console.
    },
    active: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const { yearsTitles } = toRefs(props);

const getCirclePosition = (index) => {
    const position = (index - 1) / (yearsTitles.value.length - 1) * 100;
    return { top: `${position}%` };
};

const isActive = (index) => {
    return index === 1;
};
</script>

<style scoped>
.timeline-container {
    position: fixed;
    top: 0;
    right: 5vw;
    height: 100vh;
    width: 50%;
    display: flex;
    justify-content: flex-end;
}

.timeline-content {
    display: flex;
    position: relative;
    height: 80vh;
    width: 50%;
    top: 10%;
    /* left: 1vw; */
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 2;
}

.timeline {
    position: relative;
    height: 73vh;
    width: 1px;
    background-color: #9c9c9c;
    top: 14%;
    right: 11px;
    z-index: 1;
}
</style>