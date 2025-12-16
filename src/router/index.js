import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    { 
        path: '/', 
        redirect: '/1'
    },
    { 
        path: '/1', 
        component: () => import('@/pages/PageProjects.vue'), 
        name: 'PageAb' 
    },
    { 
        path: '/2', 
        component: () => import('@/pages/PageB.vue'), 
        name: 'PageB' 
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router