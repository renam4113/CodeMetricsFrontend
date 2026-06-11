import { createWebHistory, createRouter } from 'vue-router';

const routes = [
    { path: '/', redirect: '/repositories' },
    {
        path: '/repositories',
        name: 'PageProjects',
        component: () => import('@/pages/PageProjects.vue'),
        meta: { title: 'Аналитика репозиториев' }
    },
    {
        path: '/developers',
        name: 'PageDevelopers',
        component: () => import('@/pages/PageDevelopers.vue'),
        meta: { title: 'Аналитика разработчиков' }
    },
    {
        path: '/reports',
        name: 'PageReports',
        component: () => import('@/pages/PageReports.vue'),
        meta: { title: 'Отчёты по проектам' }
    },
    {
        path: '/feedback',
        name: 'PageFeedback',
        component: () => import('@/pages/PageFeedback.vue'),
        meta: { title: 'Обратная связь' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    document.title = to.meta.title ? `${to.meta.title} — CodeMetrics` : 'CodeMetrics';
    next();
});

export default router;
