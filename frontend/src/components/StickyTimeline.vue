<template>
    <div class="timeline-container">
        <div class="timeline-content">
            <TimelineDatapoint v-for="(year, index) in years" :key="index" :positionStyle="getCirclePosition(index + 1)"
                :active="activeId === index.toString()" :title="year?.title || ''" />
            <TimelineDatapoint :positionStyle="getCirclePosition(years.length + 1)" :active="activeId === years.length.toString()" :title="'Share Journey'" />
        </div>
        <span class="timeline"></span>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, toRefs, watch } from 'vue';
import TimelineDatapoint from './TimelineDatapoint.vue';

const props = defineProps({
    years: {
        type: Array,
        required: true,
        validator: (value) => value.length > 0
    },
});

const { years: years } = toRefs(props);

const getCirclePosition = (index) => {
    const position = (index - 1) / (years.value.length - 1) * 100;
    return { top: `${position}%` };
};

const activeId = ref(0);
let observer;

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                activeId.value = entry.target.id;
            }
        });
    }, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    document.querySelectorAll('.journey-sections').forEach((section) => {
        observer.observe(section);
    });
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<style scoped>
.timeline-container {
    position: fixed;
    top: 0;
    right: 3vw;
    width: 15%;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
    z-index: 10;
}

.timeline-content {
    display: flex;
    position: relative;
    height: 80vh;
    width: 50%;
    top: 10%;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
    z-index: 2;
}

.timeline-content.active {
    font-family: 'FranieBlack', sans-serif;
    color: white;
    font-size: 1.6em;
}

.timeline {
    position: relative;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.6);
    top: 12.3vh;
    height: 75.2vh;
    right: 11px;
    z-index: 1;
}
</style>