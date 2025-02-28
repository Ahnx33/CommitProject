<template>
    <!-- Component swiper che riceve l'array(da usare anche per i trending) -->
    <!-- Slider main container -->
    <div class="swiper navigation-font" :id="'swiper' + genreId">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
            <!-- Slides -->
            <div v-for="screenplay in genre" class="swiper-slide">
                <img :src="image + screenplay.backdrop_path" :alt="screenplay.title || screenplay.name"
                    @dblclick="navigateToDetail(screenplay)">
                <span class="name_type">{{ screenplay.title || screenplay.name }}</span>
                <!-- screenplay.media_type.toUpperCase() + ... when hover -->
            </div>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
    genre: Array,
    genreId: Number,
});

// Init Swiper
onMounted(() => {
    let swiper = document.getElementById(`swiper${props.genreId}`)

    let swiperInstance = new Swiper(swiper, {
        modules: [Navigation, Autoplay],
        loop: true,
        slidesPerView: 3,
        spaceBetween: 20,
        speed: 800,
        centeredSlides: true,
        slideActiveClass: 'active-slide',
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 2000,
        },
        breakpoints: {
            768: {
                slidesPerView: 3,
            },
            /* 1280: {
                slidesPerView: 5,
                loopAdditionalSlides: 1,
            } */
        }
    });
    swiperInstance.autoplay.stop();
    /*     swiper.addEventListener('mouseenter', () => swiperInstance.autoplay.start());
        swiper.addEventListener('mouseleave', () => swiperInstance.autoplay.stop()); */

    swiperInstance.on('click', () => {
        setTimeout(() => {
            let length = document.querySelectorAll(`#swiper${props.genreId} .swiper-slide`).length;
            swiperInstance.slideToLoop(
                (length + swiperInstance.realIndex - (swiperInstance.activeIndex - swiperInstance.clickedIndex)) % length
            );
        }, 300); // Delay execution by 300ms
    });
});
</script>

<script>
import data from '@/data';


export default {
    data() {
        return {
            image: data.imagePath
        }
    },
    methods: {
        navigateToDetail(screenplay) {
            this.$router.push({ screenPlayId: screenplay.id, mediatype: screenplay?.title ? 'movie' : 'tv' });
        }
    }
}
</script>

<style scoped>
.swiper {
    width: 100%;
    z-index: 1;
    mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1),
            rgba(0, 0, 0, 1), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1),
            rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1));

    .swiper-slide img {
        width: 100%;
        border-radius: 20px;
        border: 2px solid rgba(224, 224, 224, 0.247);
    }

    .swiper-button-prev,
    .swiper-button-next {
        color: white;
        transition: 0.3s;
    }

    .swiper-button-prev:hover,
    .swiper-button-next:hover {
        scale: 1.1;
    }

    .swiper-slide {
        opacity: 0.8;
        transition: 0.5s;
        transform: scale(0.8);
        position: relative;
    }

    .swiper-slide.active-slide {
        opacity: 1;
        transform: scale(1);

        .name_type {
            opacity: 1;
        }
    }

    /* mask-image non supporta transition */
    /* .swiper-slide.swiper-slide-next {
        mask-image: linear-gradient(to right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1));
    }

    .swiper-slide.swiper-slide-prev {
        mask-image: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1));
        animation: leftOpacity 0.5s;
    } */


    .swiper-slide:hover {
        opacity: 1;
        cursor: grab;
        mask-image: none;

        .name_type {
            opacity: 1;
        }
    }

    @keyframes leftOpacity {
        from {
            mask-image: linear-gradient(to left, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1));
        }

        to {
            mask-image: unset;
        }
    }

    .name_type {
        position: absolute;
        bottom: 2px;
        left: 10px;
        opacity: 0.5;
        font-size: 1.5rem;
        transition: 0.5s;
        color: #1E88E5;
        text-shadow: 2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff,
            1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
    }
}
</style>