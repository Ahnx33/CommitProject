<template>
  <div class="content">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import LeftSideBar from '@/components/LeftSideBar.vue';
import ScreenplayCard from '@/components/ScreenplayCard.vue';

export default {
  components: {
    ScreenplayCard,
    LeftSideBar
  },
}
</script>


<!-- <template>
  <div>
    <div v-for="screenplay in allScreenplays" :key="screenplay.id">
      <p>{{ screenplay.title || screenplay.name }}</p>
      <img :src="image + screenplay.poster_path" alt="Poster" />
    </div>
    <div ref="loadMoreTrigger"></div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { fetchData, imagePath, allScreenplays as initialData, nPagesToPreload } from "@/data"; // Import API helper

const API_URL = "https://api.themoviedb.org/3/trending/movie/day?language=en-US"; // Update for TV if needed

export default {
  data() {
    return {
      allScreenplays: [...initialData], // Start with preloaded data
      image: imagePath,
      page: nPagesToPreload + 1, // Start using the PreLoaded in data.js
      observer: null,
    };
  },
  methods: {
    async fetchMoreData() {
      const newScreenplays = await fetchPagedData(`${API_URL}`, this.page);
      if (newScreenplays.length) {
        this.allScreenplays.push(...newScreenplays);
        this.page++;
      }
    },
  },
  mounted() {
    const loadMoreTrigger = this.$refs.loadMoreTrigger;
    if (loadMoreTrigger) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.fetchMoreData();
        }
      });
      this.observer.observe(loadMoreTrigger);
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
};
</script>

<style scoped>
img {
  width: 100px;
  height: auto;
  margin-bottom: 10px;
}
</style>
 -->