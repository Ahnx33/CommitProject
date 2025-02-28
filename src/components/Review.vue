<template>
    <div class="review-section">
        <h3 class="review-title">{{ $t('message.Review') }}</h3>

        <div v-if="!userReviewed" class="review-form">
            <div class="rating-container">
                <span class="rating-label">{{ $t('message.YourRating') }}: </span>
                <div class="interactive-stars">
                    <span v-for="star in 10" :key="star" class="star" :class="{ 'filled': star <= userRating }"
                        @click="setRating(star)" @mouseover="hoverRating = star" @mouseleave="hoverRating = 0">
                        ★
                    </span>
                    <span class="rating-value" v-if="userRating > 0">{{ userRating }} / 10</span>
                </div>
            </div>

            <div class="review-text-container">
                <label for="review-text">{{ $t('message.YourReview') }}:</label>
                <textarea id="review-text" v-model="reviewText" rows="4"
                    :placeholder="$t('message.WriteReviewPlaceholder')" class="review-textarea"></textarea>
            </div>

            <div class="review-actions">
                <button @click="submitReview" class="submit-btn" :disabled="!canSubmit">
                    {{ $t('message.SubmitReview') }}
                </button>
                <span v-if="submitError" class="error-message">{{ submitError }}</span>
                <span v-if="submitSuccess" class="success-message">{{ $t('message.ReviewSubmitted') }}</span>
            </div>
        </div>

        <div v-else class="user-review">
            <h4>{{ $t('message.YourReview') }}</h4>
            <div class="user-rating">
                <StarRating :rating="userRating / 2" />
                <span class="rating-value">{{ userRating }} / 10</span>
            </div>
            <p class="user-review-text">{{ reviewText }}</p>
            <button @click="editReview" class="edit-btn">{{ $t('message.EditReview') }}</button>
        </div>

        <div v-if="loading" class="loading-container">
            <SyncLoader />
        </div>

        <div class="other-reviews" v-if="reviews.length > 0">
            <h4>{{ $t('message.OtherReviews') }}</h4>
            <div v-for="(review, index) in reviews" :key="index" class="review-item">
                <div class="review-header">
                    <span class="reviewer-name">{{ review.author }}</span>
                    <div class="review-rating" v-if="review.author_details?.rating">
                        <StarRating :rating="review.author_details.rating / 2" />
                        <span class="rating-value">{{ review.author_details.rating }} / 10</span>
                    </div>
                </div>
                <p class="review-content">{{ review.content }}</p>
                <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import StarRating from '@/components/StarRating.vue';
import SyncLoader from '@/components/SyncLoader.vue';
import data from '@/data';

export default {
    name: 'MovieReview',
    components: {
        StarRating,
        SyncLoader
    },
    props: {
        screenPlayId: { type: Number, required: true },
        mediatype: { type: String, required: true }
    },
    data() {
        return {
            userRating: 0,
            hoverRating: 0,
            reviewText: '',
            loading: false,
            submitError: null,
            submitSuccess: false,
            userReviewed: false,
            reviews: []
        };
    },
    computed: {
        canSubmit() {
            return this.userRating > 0;
        }
    },
    created() {
        this.fetchReviews();
    },
    methods: {
        setRating(rating) {
            this.userRating = rating;
        },
        async submitReview() {
            if (!this.canSubmit) return;

            this.loading = true;
            this.submitError = null;

            try {
                // Submit rating to TMDB API
                const endpoint = this.mediatype === 'movie' ? 'movie' : 'tv';

                const response = await fetch(`${data.baseURL}/${endpoint}/${this.screenPlayId}/rating`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: `Bearer ${data.API_Key}`
                    },
                    body: JSON.stringify({ value: this.userRating })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.status_message || 'Failed to submit rating');
                }

                // If we have a review text, we'd store it somewhere
                // This would depend on your backend implementation
                // For now, we'll just simulate success by storing in localStorage
                if (this.reviewText) {
                    // Store the review in localStorage (optional)
                    localStorage.setItem(`review_${this.mediatype}_${this.screenPlayId}`, this.reviewText);
                }

                this.submitSuccess = true;
                this.userReviewed = true;

                // Refresh reviews after submission
                setTimeout(() => {
                    this.fetchReviews();
                }, 1000);

            } catch (error) {
                this.submitError = error.message;
                console.error('Review submission error:', error);
            } finally {
                this.loading = false;
            }
        },
        editReview() {
            this.userReviewed = false;
            this.submitSuccess = false;
        },
        async fetchReviews() {
            this.loading = true;

            try {
                const endpoint = this.mediatype === 'movie' ? 'movie' : 'tv';

                // Use your data module's fetchData method
                const reviewsData = await data.fetchData(`${data.baseURL}/${endpoint}/${this.screenPlayId}/reviews`, {
                    language: data.getLangUrl()
                });

                if (reviewsData?.results) {
                    this.reviews = reviewsData.results;
                }

                // Check for user's existing review in localStorage (optional)
                const savedReview = localStorage.getItem(`review_${this.mediatype}_${this.screenPlayId}`);
                if (savedReview) {
                    this.reviewText = savedReview;
                    // We don't know the actual rating from localStorage, so let's set a default
                    // In a real app, you'd want to store this info in a database
                    if (!this.userReviewed) {
                        this.userReviewed = true;
                    }
                }

            } catch (error) {
                console.error('Fetch reviews error:', error);
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';

            try {
                const date = new Date(dateString);
                return new Intl.DateTimeFormat(data.getLangUrl().split('-')[0], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }).format(date);
            } catch (error) {
                console.error('Date formatting error:', error);
                return dateString;
            }
        }
    }
};
</script>

<style scoped>
.review-section {
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 1rem;
    padding: 2rem;
    margin-top: 2rem;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.review-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: white;
    text-align: center;
}

.review-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.rating-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.rating-label {
    font-size: 1.1rem;
    color: white;
    white-space: nowrap;
}

.interactive-stars {
    display: flex;
    align-items: center;
}

.star {
    font-size: 2rem;
    cursor: pointer;
    color: #555;
    transition: color 0.2s ease;
}

.star.filled,
.star:hover {
    color: gold;
}

.rating-value {
    margin-left: 1rem;
    font-size: 1.1rem;
    color: white;
}

.review-text-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.review-text-container label {
    color: white;
    font-size: 1.1rem;
}

.review-textarea {
    color: #666;
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    resize: vertical;
    font-family: inherit;
}

.review-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.submit-btn {
    padding: 0.75rem 1.5rem;
    background-color: #1a8fe3;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
    background-color: #0e6baa;
}

.submit-btn:disabled {
    background-color: #555;
    cursor: not-allowed;
}

.error-message {
    color: #ff6b6b;
}

.success-message {
    color: #4cd964;
}

.user-review {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
}

.user-rating {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.user-review-text {
    color: #333;
    line-height: 1.6;
}

.edit-btn {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: white;
    border: 1px solid white;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.loading-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
}

.other-reviews {
    margin-top: 2rem;
}

.other-reviews h4 {
    color: white;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.review-item {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.reviewer-name {
    font-weight: bold;
    color: white;
}

.review-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.review-content {
    text-align: justify;
    color: white;
    margin-bottom: 0.5rem;
    line-height: 1.4;
    max-height: 300px;
    overflow-y: auto;
}

.review-date {
    color: #ccc;
    font-size: 0.9rem;
    display: block;
    text-align: right;
}
</style>