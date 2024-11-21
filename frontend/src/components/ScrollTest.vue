<template>
    <div class="container">
        <section class="section" id="section1">Section 1</section>
        <section class="section" id="section2">
            <div class="inner-container">
                <div class="box" id="left">Left</div>
                <div class="box" id="center">Center</div>
                <div class="box" id="right">Right</div>
            </div>
        </section>
        <section class="section" id="section3">Section 3</section>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { gsap } from "gsap-trial";
import { ScrollTrigger } from "gsap-trial/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
    gsap.from("#left", {
        y: 200,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: "#section2",
            start: "top top",
            markers: true,
        },
    });
    gsap.from("#center", {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: "#section2",
            start: "top top",
            markers: true,
        },
    });
});

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}

.section {
    padding: 20px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: white;
}

#section2 {
    align-items: baseline;
    color: black;
}

#center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.inner-container {
    display: flex;
    width: 100%;
    justify-content: space-around;
}

.box {
    width: 30%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: lightgray;
}
</style>