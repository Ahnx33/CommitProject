<template>
    <div class="container">
        <svg :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
            <path v-for="(path, index) in paths" :key="index" :d="path.d" :fill="path.fill">
                <animate attributeName="d" :values="path.values" dur="4s" repeatCount="indefinite" />
            </path>
        </svg>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const viewBox = ref("0 0 120 28");
const paths = ref([
    {
        d: "M0 14 Q 30 -5 60 14 T 120 14 V 28 H 0 Z",
        fill: "#69b3a2",
        values:
            "M0 14 Q 30 -5 60 14 T 120 14 V 28 H 0 Z; M0 14 Q 30 25 60 14 T 120 14 V 28 H 0 Z; M0 14 Q 30 -5 60 14 T 120 14 V 28 H 0 Z",
    },
    {
        d: "M0 14 Q 30 10 60 14 T 120 14 V 28 H 0 Z",
        fill: "#40798c",
        values:
            "M0 14 Q 30 10 60 14 T 120 14 V 28 H 0 Z; M0 14 Q 30 -10 60 14 T 120 14 V 28 H 0 Z; M0 14 Q 30 10 60 14 T 120 14 V 28 H 0 Z",
    },
]);
</script>

<style scoped>
.container {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
}

svg {
    width: 100%;
    height: 100%;
}
</style>