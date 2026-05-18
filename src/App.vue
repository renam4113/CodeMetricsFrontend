<template>
    <div class="app d-flex-column">
        <header class="d-flex-center header">
            <h1>Аналитика репозиториев Gitea</h1>
        </header>
        <main class="d-flex main-container">
            <nav class="sidebar">
                <h3 class="sidebar-title">Разделы</h3>
                <ul class="nav-list">
                    <li
                        v-for="item in navItems"
                        :key="item.name"
                        class="nav-item"
                        :class="{ active: $route.name === item.name }"
                        @click="$router.push({ name: item.name })"
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                    </li>
                </ul>
            </nav>
            <div class="content flex-1">
                <router-view />
            </div>
        </main>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { Api } from '@/services';

export default {
    name: 'App',
    data() {
        return {
            navItems: [
                { name: 'PageProjects', label: 'По репозиториям', icon: 'pi pi-folder' },
                { name: 'PageDevelopers', label: 'По разработчикам', icon: 'pi pi-users' },
                { name: 'PageReports', label: 'Отчёты по проектам', icon: 'pi pi-chart-bar' },
                { name: 'PageFeedback', label: 'Обратная связь', icon: 'pi pi-comments' }
            ]
        };
    },
    methods: {
        ...mapMutations({
            setRepositories: 'repositories/setRepositories'
        })
    },
    async mounted() {
        try {
            const data = await Api.getRepositories();
            this.setRepositories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    }
};
</script>

<style>
@import url('@/styles/index.css');

html {
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
    background-color: #f5f7fa;
    color: #333;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header h1 {
    font-size: 1.8rem;
    font-weight: 500;
}

.main-container {
    height: calc(100vh - 72px);
}

.sidebar {
    width: 260px;
    min-width: 260px;
    background: #fff;
    border-right: 1px solid #e0e0e0;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.04);
}

.sidebar-title {
    padding: 20px 20px 10px;
    color: #667eea;
    font-size: 1.05rem;
    font-weight: 600;
    border-bottom: 1px solid #f0f0f0;
}

.nav-list {
    list-style: none;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    cursor: pointer;
    color: #555;
    font-weight: 500;
    transition: all 0.2s ease;
}

.nav-item:hover {
    background: #f0f4ff;
    color: #667eea;
}

.nav-item.active {
    background: #667eea;
    color: #fff;
}

.app {
    height: 100vh;
    overflow: hidden;
}

main {
    position: relative;
    overflow: hidden;
    height: 100%;
}

.content {
    flex: 1;
    overflow: auto;
    padding: 20px;
    background-color: #f8fafc;
}
</style>
