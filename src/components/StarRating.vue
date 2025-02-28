<template>
    <div class="star-rating">
        <span v-for="n in maxStars" :key="n" class="star">
            <font-awesome-icon :icon="starIcons[n - 1]" />
        </span>
        <font-awesome-icon class="ms-3" :icon="highlyRecommended" bounce="" v-if="rating > 4.25" />
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfStroke as halfStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons';

export default {
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            highlyRecommended: faRankingStar
        }
    },
    props: {
        rating: { type: Number, required: true },
        maxStars: { type: Number, default: 5 },
    },
    computed: {
        starIcons() {
            let stars = [];
            let fullStars = Math.floor(this.rating);
            let halfStars = this.rating % 1 >= 0.5 ? 1 : 0;
            let emptyStars = this.maxStars - fullStars - halfStars;

            // Push full stars
            for (let i = 0; i < fullStars; i++) {
                stars.push(solidStar);
            }
            // Push half star if needed
            if (halfStars == 1) {
                console.log(halfStar);
                stars.push(halfStar);
            }

            // Push empty stars
            for (let i = 0; i < emptyStars; i++) {
                stars.push(emptyStar);
            }

            return stars;
        },
    },
};
</script>


<style scoped>
.star-rating {
    color: rgb(0, 255, 170);
    font-size: 1.5rem;
    margin: 0;
}

.star {
    margin-right: 5px;
}
</style>