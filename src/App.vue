<template>
    <div class="app d-flex-column">
        <header class="d-flex-center header">
            <h1>Аналитика репозиториев Gitea</h1>
        </header>
        <main class="d-flex main-container">
            <nav class="sidebar">
                <h3 class="sidebar-title">Аналитика:</h3>
                <ul class="d-flex-column gap-10px pad-20">
                    <li class="nav-item" @click="$router.push({name: 'PageProjects'})">По репозиториям</li>
                    <li class="nav-item" @click="$router.push({name: 'PageB'})">По разработчикам</li>
                </ul>
            </nav>
            <div class="content flex-1">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import { Api } from '@/services';

    export default {
        name: "App",
        data() {
            return {
                isLoading: true
            };
        },
        methods: {
            ...mapMutations({
                setRepositories: 'repositories/setRepositories',
            }),
        },
        mounted() {
            this.isLoading = true;
            return Api.getRepositories()
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Ошибка загрузки репозиториев');
                    }
                    return response.json();
                })
                .then((data) => {
                    this.setRepositories(data);
                })
                .catch((error) => {
                    console.error('Error loading repositories:', error);
                    alert('Ошибка при загрузке репозиториев');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
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
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

        .header h1 {
            font-size: 1.8rem;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

    .main-container {
        height: calc(100vh - 80px);
    }

    .sidebar {
        border-right: 1px solid #e0e0e0;
        background: #ffffff;
        width: 250px;
        min-width: 250px;
        box-shadow: 2px 0 5px rgba(0,0,0,0.05);
    }

    .sidebar-title {
        padding: 20px 20px 10px;
        color: #667eea;
        font-size: 1.1rem;
        font-weight: 600;
        border-bottom: 1px solid #f0f0f0;
    }

    .nav-item {
        list-style-type: none;
        padding: 12px 20px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        color: #555;
        font-weight: 500;
        margin: 5px 0;
    }

        .nav-item:hover {
            background-color: #f0f4ff;
            color: #667eea;
            transform: translateX(5px);
        }

        .nav-item.active {
            background-color: #667eea;
            color: white;
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