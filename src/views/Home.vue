<script setup>
import HomeContent from './HomeContent.vue';

</script>

<template>
    <Suspense class="home">
        <template #default>
            <HomeContent></HomeContent>
        </template>

        <!-- Fallback UI -->
        <template #fallback>
            Loading
        </template>
    </Suspense>
</template>

<style lang="css" scoped>
.home::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: url('/public/images/home.jpeg') no-repeat center center;
    background-size: cover;
    opacity: 0.6;
    z-index: -1;
}
</style>