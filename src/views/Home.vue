<script setup>
import HomeContent from './HomeContent.vue';

</script>

<template>
    <Suspense>
        <template #default>
            <HomeContent></HomeContent>
        </template>

        <!-- Fallback UI -->
        <template #fallback>
            Loading
        </template>
    </Suspense>
</template>