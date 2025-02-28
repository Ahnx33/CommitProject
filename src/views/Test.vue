<script>
import FirstEnterSwiper from '@/components/FirstEnterSwiper.vue';
import LangSwitch from '@/components/LangSwitch.vue';
import LeftSideBar from '@/components/LeftSideBar.vue';
import StarRating from '@/components/StarRating.vue';
import SyncLoader from '@/components/SyncLoader.vue';
import data from '@/data';

export default {
    components: {
        LangSwitch,
        LeftSideBar,
        SyncLoader,
        StarRating,
        FirstEnterSwiper
    },
    data() {
        return {
            ciao: data.state.filmsCatalog
        }
    }
}




/* import Sole from '@/Test/Sole.vue'; */
</script>

<template>
    <div>
        <LeftSideBar></LeftSideBar>

        <FirstEnterSwiper :to-display="ciao" :width-in-vw="20" style="margin-left: 500px; margin-top: 50px;">
        </FirstEnterSwiper>
        <!-- <Sole></Sole> -->
    </div>
</template>