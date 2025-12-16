<template>
    <div class="page d-flex-center
    ">
    {{ isLoading }}
    {{ getProjects }}
    <Button @click="getAllProj">Получить список проектов</Button>
    </div>
</template>

<script>

import Button from 'primevue/button';
import { mapGetters } from 'vuex';
import { ref } from 'vue';
export default {
    name: "PageB",
    components: {
        Button
    },
    setup(){
        const projects = ref([]);
        const isLoading = ref(false);
        return {
            projects,
            isLoading
        }
    },
    computed: {
        ...mapGetters({
            getProjects: 'projects/getProjects',
        })
    }
}
</script>

<style scoped>

</style>