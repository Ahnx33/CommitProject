<template>
    <div class="content">
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script setup>
import data from '@/data';
await data.init()
</script>