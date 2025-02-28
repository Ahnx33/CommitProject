<template>
    <swiper :effect="'cube'" :grabCursor="true" :cubeEffect="{
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 1.1,

    }" :loop="true" :modules="modules" class="mySwiper" :style="{ '--width-': `${widthInVw}vw` }">
        <swiper-slide v-for="screenplay in firstFour">
            <AppLink
                :to="{ name: 'screenplay.show', params: { screenPlayId: screenplay.id, mediatype: screenplay?.title ? 'movie' : 'tv' } }">
                <img :src="image + screenplay.poster_path" />
            </AppLink>
        </swiper-slide>
    </swiper>
</template>
<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/effect-cube';
import { EffectCube } from 'swiper/modules';

import data from '@/data';
import { ref } from 'vue';

export default {
    props: {
        toDisplay: {
            type: Array,
            required: true,
        },
        widthInVw: {
            type: Number,
            required: true
        }
    },
    components: {
        Swiper,
        SwiperSlide,
    },
    computed: {
        firstFour() {
            return this.toDisplay.sort((a, b) => {
                return b.popularity - a.popularity
            }).slice(0, 4)
        },
    },
    setup(props) {
        const image = ref(data.imagePath)
        return {
            modules: [EffectCube],
            toDisplay: props.toDisplay,
            image: image
        };
    },
};
</script>

<style scoped>
.swiper {
    width: var(--width-) !important;
    position: absolute;
}

.swiper-slide {
    background-position: center;
    background-size: cover;
}

.swiper-slide img {
    display: block;
    width: 100%;
}

.swiper-slide img:hover {
    cursor: grab;
}

:deep(.swiper-cube-shadow::before) {
    background: white !important;
    /* Set the background color to white */
}
</style>