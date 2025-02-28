import { createRouter, createWebHistory } from "vue-router";
import data from "@/data";

const routes = [
    { path: '/', name: 'Home', component: () => import('@/views/Home.vue'), meta: { transition: 'fade' } },
    {
        path: '/test', name: 'Test', component: () => import('@/views/Test.vue'),
        children: [{
            path: 'hello', name: 'TestChild', component: () => import('@/Test/TestChild.vue')
        }]
    },
    {
        path: '/catalog', name: 'Catalog',
        components: { default: () => import('@/views/Catalog.vue'), LeftSidebar: () => import('@/components/LeftSideBar.vue') },
        meta: { transition: 'slideUp' },
        children: [
            {
                path: ':screenPlayId(\\d+)/:mediatype', name: 'screenplay.show', component: () => import('@/views/ScreenplayShow.vue'),
                props: route => ({ screenPlayId: parseInt(route.params.screenPlayId), mediatype: route.params.mediatype }),
                meta: { transition: 'slideLeft' }
            },
            {
                path: ':mediatype/:id/:genre', name: 'media.show', component: () => import('@/views/Media.vue'),
                props: route => ({ ...route.params, mediatype: route.params.mediatype, id: parseInt(route.params.id) }),
                meta: { transition: 'slideUp' },
                beforeEnter(to, from) {
                    const exists = data.state.allGenres.find(genre => genre.id == parseInt(to.params.id))

                    if (!(exists || to.params.id == -1)) {
                        return {
                            name: 'NotFound'
                        }
                    }
                }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/components/NotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'custom-router-link-active',
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || new Promise((resolve) => {
            setTimeout(() => resolve({ top: 0 }), 500)
        })
    }
})

export default router