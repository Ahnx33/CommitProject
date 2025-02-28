<script>
import { RouterLink } from 'vue-router'

export default {
    props: {
        ...RouterLink.props
    },
    computed: {
        isExternal() {
            return typeof this.to === 'string' && this.to.startsWith('http')
        }
    }
}
</script>

<template>
    <a :href="to" v-if="isExternal" target="_blank" rel="noopener" class="external-link">
        <slot></slot>
    </a>
    <router-link v-bind="$props" v-else class="internal-link">
        <slot></slot>
    </router-link>
</template>