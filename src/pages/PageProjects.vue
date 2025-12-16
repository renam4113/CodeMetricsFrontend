<template>
    <div class="page d-flex-column gap-10px">
        <div class="loading" v-if="isLoading">Загрузка...</div>
        <div class="cont d-flex-ai-center">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem] flex-1"/>
        <div class="panel d-flex-column gap-10px">
            <Select v-model="selectedProj" :options="getProjects.map(el=>{ return {name: el.name, code: el.projectKey}})" optionLabel="name" placeholder="Выберите проект" class="w-full md:w-56" :key="getProjects"/>

            <div class="line d-flex-column gap-5px">
                <div class="label">Диапозон от и до</div>
                <div class="dates d-flex gap-5px">
                    <DatePicker v-model="dateFrom" showTime hourFormat="24" fluid/>
                    <DatePicker v-model="dateTo" showTime hourFormat="24" fluid />
                </div>
            </div>


            <Button @click="updateGraphic" severity="Primary">Обновить график</Button>
        </div>
        </div>
        Самый активный разрабочик: {{ getMostAcitveDev }}
        
    </div>
</template>

<script>
import Button from 'primevue/button';
import { Select } from 'primevue';
import Chart from 'primevue/chart';
import DatePicker from 'primevue/datepicker';
import { mapGetters } from 'vuex';
import { ref, watch } from 'vue';

import { Api } from '@/services';

export default {
    name: "PageProjects",
    components: {
        Button,
        Select,
        DatePicker,
        Chart
    },
    setup() {
        const isLoading = ref(false);
        const selectedProj = ref();
        const dateFrom = ref(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        const dateTo = ref(new Date());
        const commits = ref([]);
        const aggregationType = ref('day');

        const aggregationOptions = ref([
            { label: 'По дням', value: 'day' },
            { label: 'По неделям', value: 'week' },
            { label: 'По месяцам', value: 'month' }
        ]);

        // Добавляем watch для автоматического обновления графика при смене агрегации
        watch(aggregationType, () => {
            if (commits.value.length > 0) {
                // Принудительно обновляем chartData
                chartData.value = getChartData();
            }
        });

        // Исправленный метод агрегации данных
        const getAggregatedData = () => {
            const commitsByPeriod = {};
            
            commits.value.forEach(commit => {
                const date = new Date(commit.CreatedAt);
                let periodKey;
                let sortKey;
                const weekStart = new Date(date);
                const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
                const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                switch (aggregationType.value) {
                    case 'week':
                        weekStart.setDate(date.getDate() - date.getDay());
                        weekStart.setHours(0, 0, 0, 0);
                        periodKey = `Нед. ${weekStart.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}`;
                        sortKey = weekStart.toISOString().split('T')[0];
                        break;
                    case 'month':
                        periodKey = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
                        sortKey = monthStart.toISOString().split('T')[0];
                        break;
                    default:
                        periodKey = date.toLocaleDateString('ru-RU');
                        sortKey = dayStart.toISOString().split('T')[0];
                }

                if (!commitsByPeriod[periodKey]) {
                    commitsByPeriod[periodKey] = {
                        count: 0,
                        sortKey: sortKey
                    };
                }
                commitsByPeriod[periodKey].count += 1;
            });

            return Object.entries(commitsByPeriod)
                .sort(([, a], [, b]) => a.sortKey.localeCompare(b.sortKey))
                .map(([x, data]) => ({ x, y: data.count }));
        };

        const getChartData = () => {
            if (!commits.value.length) {
                return {
                    datasets: [{
                        label: 'Коммиты',
                        data: [],
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                };
            }

            const aggregatedData = getAggregatedData();
            
            return {
                labels: aggregatedData.map(item => item.x),
                datasets: [{
                    label: 'Количество коммитов',
                    data: aggregatedData.map(item => item.y),
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            };
        };

        const chartData = ref(getChartData());

        watch(commits, () => {
            chartData.value = getChartData();
        });

        const chartOptions = ref({
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#6c757d'
                    },
                    grid: {
                        color: '#e9ecef'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#6c757d'
                    },
                    grid: {
                        color: '#e9ecef'
                    },
                    title: {
                        display: true,
                        text: 'Количество коммитов'
                    }
                }
            }
        });

        return {
            selectedProj,
            dateFrom,
            dateTo,
            isLoading,
            commits,
            chartData,
            chartOptions,
            aggregationType,
            aggregationOptions
        }
    },
    methods: {
        updateGraphic(){
            if (!this.selectedProj) {
                alert('Пожалуйста, выберите проект');
                return;
            }

            this.isLoading = true;

            const objTOSend = {
                instanceType: 'Project',
                timeFrom: this.dateFrom || null,
                timeTo: this.dateTo || null,
                name: this.selectedProj.name
            };

            return Api.getCommits(objTOSend)
            .then(r => {
                if (!r.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                return r.json();
            })
            .then(data => {
                this.commits = data;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ошибка при загрузке коммитов');
            })
            .finally(() => {
                this.isLoading = false;
            });
        },
    },
    computed: {
        getMostAcitveDev(){
            const mapUsers = {}
            for(const com of this.commits){
                console.log(com)
                if(!mapUsers[com['committerEmail']]){
                    mapUsers[com['committerEmail']] = 1;
                    continue;
                }
                mapUsers[com['committerEmail']] ++;
            }
            const max = {
                user: null,
                count: 0
            }
            for(const [a, count] of Object.entries(mapUsers)){
                if(count > max.count){
                    max.user = a;
                    max.count = count;
                }
            }
            return max;
        },
        ...mapGetters({
            getProjects: 'projects/getProjects',
        })
    }
}
</script>

<style scoped>
.panel{
    position: relative;
}
.loading{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.page{
    height: 100%;
    width: 100%;
    overflow: hidden;

    justify-content: center;
}

#myChart {
    max-width: 600px;
    max-height: 400px;
}
</style>