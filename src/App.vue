<template>
    <div class="app d-flex-column">
        <header class="d-flex-center"><h1>Команда ИПМКН</h1></header>
        <main class="d-flex">
            <nav>
                Аналитика:
                <ul class="d-flex-column gap-10px pad-50">
                    <li @click="$router.push({name: 'PageAb'})">По проектам</li>
                    <!-- <li @click="$router.push({name: 'PageB'})">По сотрудникам</li> -->
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
    methods: {
        ...mapMutations({
            setProjects: 'projects/setProjects',
        }),
    },
    mounted(){
        return Api.getProjects()
        .then((response) => {
            console.log(response);
            return response.json()
            .then((data)=>{
                this.setProjects(data);
            })
        })
        .finally(()=>{
            this.isLoading = false;
        })
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
}
nav{
    border-right: 1px solid rgb(172, 172, 172);
}
li{
    /* list-style-type: none; */
}
.app{
    height: 100vh;
    overflow: hidden;
    /* border: 1px solid red; */
}
main{
    position: relative;
    overflow: hidden;
    height: 100%;
}
.content{
    flex: 1;
    overflow: hidden;
}
</style>