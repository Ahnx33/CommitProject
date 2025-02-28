<template>
    <div id="first-enter">
        <div id="content">
            <div id="swipers" class="container-fluid row navigation-font">
                <!-- First Column with Hover Effect on Circle -->
                <div class="col-4">
                    <div class="swiper-container">
                        <div class="circle first-circle">
                            <img src="https://image.tmdb.org/t/p/original/2g0iU9jt32nwHmjyTJDRvnpVEZ8.jpg"
                                alt="Film/TV Image" class="circle-img" />
                            <span class="circle-text">{{ $t('message.Movies') }}</span>
                        </div>
                    </div>
                </div>
                <!-- Middle Column (no hover effect) -->
                <div class="col-4">
                    <div class="swiper-container">
                        <FirstEnterSwiper
                            :to-display="[...data.state.initialScreenplays[0], ...data.state.initialScreenplays[1]]"
                            :width-in-vw="20">
                        </FirstEnterSwiper>
                    </div>
                </div>
                <!-- Last Column with Hover Effect on Circle -->
                <div class="col-4">
                    <div class="swiper-container">
                        <div class="circle last-circle">
                            <img src="https://image.tmdb.org/t/p/original/2g0iU9jt32nwHmjyTJDRvnpVEZ8.jpg"
                                alt="Catalog Image" class="circle-img" />
                            <span class="circle-text">{{ $t('message.TV_Series') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>




<script setup>
import FirstEnterSwiper from './FirstEnterSwiper.vue';
import data from '@/data';

</script>

<style scoped>
#content {
    height: 90%;
}

#content::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vw / 1.778);
    background: url('/public/images/home.jpeg') no-repeat center center;
    background-size: cover;
    opacity: 0.6;
    z-index: -1;
}

#swipers {
    width: 100%;
    height: 90%;
    margin: 0;
}

.swiper-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 5px solid #1E88E5;
    background-color: black;
    box-shadow: 0 0 100px rgb(90, 90, 90);
}

.circle-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    /* Ensure the image fills the circle without distortion */
    transition: opacity 0.3s ease;
    image-rendering: crisp-edges;
}

.circle-text {
    color: #127252;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    transition: opacity 0.3s ease;
    text-shadow: 1px 0 #fff, -1px 0 #fff, 0 1px #fff, 0 -1px #fff,
        1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff;
}

.circle:hover {
    .circle-text {
        opacity: 1;
    }

    .circle-img {
        opacity: 0.4;
    }
}
</style>
