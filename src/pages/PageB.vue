<template>
    <div class="page d-flex-column gap-20px">
        <h2>Аналитика разработчиков</h2>

        <div class="card">
            <div class="card-header">Поиск разработчика</div>
            <div class="d-flex gap-12px">
                <InputText v-model="searchEmail"
                           placeholder="Введите email разработчика"
                           class="flex-1" />
                <DatePicker v-model="dateFrom"
                            showTime
                            hourFormat="24"
                            placeholder="Дата начала" />
                <DatePicker v-model="dateTo"
                            showTime
                            hourFormat="24"
                            placeholder="Дата окончания" />
                <Button @click="searchDeveloper"
                        severity="primary"
                        :loading="isLoading">
                    Найти
                </Button>
            </div>
        </div>

        <div v-if="selectedDeveloper" class="grid-3 gap-20px">
            <div class="metric-card">
                <div class="metric-label">Производительность</div>
                <div class="metric-value">{{ developerMetrics.performance.toFixed(1) }}</div>
                <div class="metric-subtitle">из 10</div>
            </div>

            <div class="metric-card" style="background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);">
                <div class="metric-label">Стабильность</div>
                <div class="metric-value">{{ developerMetrics.stability.toFixed(1) }}</div>
                <div class="metric-subtitle">из 10</div>
            </div>

            <div class="metric-card" style="background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);">
                <div class="metric-label">Средний размер коммита</div>
                <div class="metric-value">{{ developerMetrics.avgCommitSize }}</div>
                <div class="metric-subtitle">строк</div>
            </div>
        </div>

        <div v-if="selectedDeveloper" class="card">
            <div class="card-header">Детальная статистика</div>
            <DataTable :value="developerStats" class="p-datatable-sm">
                <Column field="metric" header="Метрика"></Column>
                <Column field="value" header="Значение"></Column>
                <Column field="trend" header="Тренд">
                    <template #body="slotProps">
                        <i v-if="slotProps.data.trend === 'up'" class="pi pi-arrow-up text-green-500"></i>
                        <i v-if="slotProps.data.trend === 'down'" class="pi pi-arrow-down text-red-500"></i>
                        <span v-if="slotProps.data.trend === 'stable'" class="text-gray-500">→</span>
                    </template>
                </Column>
            </DataTable>
        </div>

        <div class="card">
            <div class="card-header">Сотрудничество в команде</div>
            <div class="grid-3 gap-20px">
                <div class="collaboration-card">
                    <i class="pi pi-users text-4xl text-blue-500"></i>
                    <div class="collaboration-value">{{ teamCollaboration.sharedCommits }}</div>
                    <div class="collaboration-label">Совместные коммиты</div>
                </div>
                <div class="collaboration-card">
                    <i class="pi pi-eye text-4xl text-green-500"></i>
                    <div class="collaboration-value">{{ teamCollaboration.codeReviews }}</div>
                    <div class="collaboration-label">Code Reviews</div>
                </div>
                <div class="collaboration-card">
                    <i class="pi pi-code text-4xl text-orange-500"></i>
                    <div class="collaboration-value">{{ teamCollaboration.pairProgramming }}</div>
                    <div class="collaboration-label">Парное программирование</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useStore } from 'vuex';
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';
    import DatePicker from 'primevue/datepicker';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import { Api } from '@/services';

    export default {
        name: "PageB",
        components: {
            InputText,
            Button,
            DatePicker,
            DataTable,
            Column
        },
        setup() {
            const store = useStore();
            const searchEmail = ref('');
            const dateFrom = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
            const dateTo = ref(new Date());
            const isLoading = ref(false);
            const selectedDeveloper = ref(null);
            const developerMetrics = ref({
                performance: 7.5,
                stability: 8.2,
                avgCommitSize: 125
            });
            const developerStats = ref([
                { metric: 'Количество коммитов', value: '42', trend: 'up' },
                { metric: 'Полезные строки', value: '5,240', trend: 'up' },
                { metric: 'Измененные файлы', value: '156', trend: 'stable' },
                { metric: 'Коэффициент вариации', value: '0.32', trend: 'down' },
                { metric: 'Лучший день недели', value: 'Среда', trend: 'stable' }
            ]);
            const teamCollaboration = ref({
                sharedCommits: 24,
                codeReviews: 18,
                pairProgramming: 12
            });

            const searchDeveloper = async () => {
                if (!searchEmail.value) {
                    alert('Введите email разработчика');
                    return;
                }

                isLoading.value = true;
                try {
                    // Загрузка метрик разработчика
                    const [performanceRes, summaryRes] = await Promise.all([
                        Api.getAuthorPerformance(searchEmail.value, dateFrom.value, dateTo.value),
                        Api.getAuthorSummary(searchEmail.value, dateFrom.value, dateTo.value)
                    ]);

                    if (performanceRes.ok && summaryRes.ok) {
                        selectedDeveloper.value = searchEmail.value;
                        const performanceData = await performanceRes.json();
                        const summaryData = await summaryRes.json();

                        // Обновляем метрики на основе полученных данных
                        developerMetrics.value = {
                            performance: performanceData.score || 7.5,
                            stability: performanceData.stability || 8.2,
                            avgCommitSize: summaryData.averageChangeSize || 125
                        };
                    }
                } catch (error) {
                    console.error('Error searching developer:', error);
                    alert('Ошибка при поиске разработчика');
                } finally {
                    isLoading.value = false;
                }
            };

            return {
                searchEmail,
                dateFrom,
                dateTo,
                isLoading,
                selectedDeveloper,
                developerMetrics,
                developerStats,
                teamCollaboration,
                searchDeveloper
            };
        }
    }
</script>

<style scoped>
    .collaboration-card {
        background: white;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        border: 1px solid #e2e8f0;
        transition: transform 0.3s ease;
    }

        .collaboration-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

    .collaboration-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #667eea;
        margin: 15px 0;
    }

    .collaboration-label {
        font-size: 1rem;
        color: #718096;
    }
</style>