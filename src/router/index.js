import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/repositories'
    },
    {
        path: '/repositories',
        component: () => import('@/pages/PageProjects.vue'),
        name: 'PageProjects',
        meta: { title: 'Аналитика репозиториев' }
    },
    {
        path: '/developers',
        component: () => import('@/pages/PageB.vue'),
        name: 'PageB',
        meta: { title: 'Аналитика разработчиков' }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
})

export default router