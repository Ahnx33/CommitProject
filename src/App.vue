<script setup>
import TheNavigation from './components/TheNavigation.vue';
</script>

<template>
  <TheNavigation></TheNavigation>
  <router-view v-slot="{ Component }" name="LeftSidebar">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>
  <div>
    <router-view v-slot="{ Component }">
      <transition :name="$route.meta.transition" mode="out-in">
        <div :key="$route.fullPath">
          <component :is="Component"></component>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<style>
.slideUp-enter-active,
.slideUp-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slideUp-enter-from,
.slideUp-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slideLeft-enter-active,
.slideLeft-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.slideLeft-enter-from,
.slideLeft-leave-to {
  opacity: 0;
  transform: translateX(20%);
}
</style>
