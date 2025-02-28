<template>
  <swiper :effect="'cards'" :grabCursor="true" :modules="modules" class="trending-swiper" @swiper="onSwiper"
    @click="slideNext">
    <swiper-slide v-for="screenplay in sortedScreenplays" :key="screenplay.id">
      <img :src="image + screenplay.poster_path" :alt="screenplay.name || screenplay.title" />
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import data from "@/data";

export default {
  props: {
    toDisplay: {
      type: Array,
      required: true,
    }
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      image: data.imagePath,
      swiperInstance: null, // Store swiper instance
      reverse: false, // Track if sliding backward
    };
  },
  computed: {
    sortedScreenplays() {
      return this.toDisplay
        .sort((a, b) => (b.popularity !== a.popularity ? b.popularity - a.popularity : b.vote_average - a.vote_average))
        .slice(0, 5);
    }
  },
  setup() {
    return {
      modules: [EffectCards],
    };
  },
  methods: {
    onSwiper(swiper) {
      this.swiperInstance = swiper;
    },
    slideNext() {
      if (this.reverse) {
        // If going backward
        if (this.swiperInstance.isBeginning) {
          this.reverse = false; // Switch to forward mode
          this.swiperInstance.slideNext();
        } else {
          this.swiperInstance.slidePrev(); // Move backward
        }
      } else {
        // If going forward
        if (this.swiperInstance.isEnd) {
          this.reverse = true; // Switch to backward mode
          this.swiperInstance.slidePrev();
        } else {
          this.swiperInstance.slideNext(); // Move forward
        }
      }
    }
  }
};
</script>

<style scoped>
.swiper {
  transition: 0.5s;
  width: 240px;
}

.swiper:hover {
  scale: 1.1;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  border: 5px solid #1E88E5;
}

.swiper-slide img {
  width: 100%;
}
</style>