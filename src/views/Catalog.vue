<script setup>
import CatalogContent from './CatalogContent.vue';


</script>

<template>
  <Suspense>
    <template #default>
      <CatalogContent></CatalogContent>
    </template>

    <!-- Fallback UI -->
    <template #fallback>
      Loading
    </template>
  </Suspense>
</template>