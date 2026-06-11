<template>
    <div class="page d-flex-column gap-20px">
        <h2>Аналитика разработчиков</h2>

        <div class="card">
            <div class="card-header">Поиск разработчика</div>
            <div class="d-flex gap-12px flex-wrap">
                <InputText
                    v-model="searchEmail"
                    placeholder="Email разработчика"
                    class="flex-1"
                    style="min-width: 220px"
                />
                <Calendar v-model="dateFrom" showTime hourFormat="24" placeholder="Дата начала" />
                <Calendar v-model="dateTo" showTime hourFormat="24" placeholder="Дата окончания" />
                <Button label="Анализировать" icon="pi pi-search" :loading="isLoading" @click="searchDeveloper" />
            </div>
            <p class="hint">Проект SonarQube: <strong>{{ testProject }}</strong> (заглушка)</p>
        </div>

        <template v-if="selectedDeveloper">
            <div class="grid-3">
                <div class="metric-card">
                    <div class="metric-label">Производительность</div>
                    <div class="metric-value">{{ developerMetrics.performance.toFixed(1) }}</div>
                    <div class="metric-subtitle">из 10</div>
                </div>
                <div class="metric-card" style="background: linear-gradient(135deg, #4caf50, #8bc34a)">
                    <div class="metric-label">Стабильность</div>
                    <div class="metric-value">{{ developerMetrics.stability.toFixed(1) }}</div>
                    <div class="metric-subtitle">из 10</div>
                </div>
                <div class="metric-card" style="background: linear-gradient(135deg, #ff9800, #ff5722)">
                    <div class="metric-label">Средний размер коммита</div>
                    <div class="metric-value">{{ developerMetrics.avgCommitSize }}</div>
                    <div class="metric-subtitle">строк</div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">Активность по неделям</div>
                <div v-if="chartData.labels.length" class="chart-wrap">
                    <Chart type="bar" :data="chartData" :options="chartOptions" />
                </div>
                <p v-else class="text-gray-500">Нет данных для графика</p>

                <div v-if="aiMessage" class="ai-comment">
                    <div class="ai-comment__title">
                        <i class="pi pi-sparkles"></i>
                        Комментарий ИИ (Ollama + SonarQube)
                    </div>
                    {{ aiMessage }}
                </div>
            </div>

            <div class="card">
                <div class="card-header">Детальная статистика</div>
                <DataTable :value="developerStats" class="p-datatable-sm">
                    <Column field="metric" header="Метрика" />
                    <Column field="value" header="Значение" />
                    <Column field="trend" header="Тренд">
                        <template #body="{ data }">
                            <i v-if="data.trend === 'up'" class="pi pi-arrow-up text-green-500"></i>
                            <i v-else-if="data.trend === 'down'" class="pi pi-arrow-down text-red-500"></i>
                            <span v-else class="text-gray-500">→</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import { Api } from '@/services';
import { TEST_SONAR_PROJECT } from '@/constants';
import {
    buildStatsTable,
    buildWeeklyChart,
    computePerformanceScore,
    computeStabilityScore,
    extractAiMessage
} from '@/utils/metrics';

export default {
    name: 'PageDevelopers',
    components: { InputText, Button, Calendar, DataTable, Column, Chart },
    setup() {
        const testProject = TEST_SONAR_PROJECT;
        const searchEmail = ref('');
        const dateFrom = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const dateTo = ref(new Date());
        const isLoading = ref(false);
        const selectedDeveloper = ref(null);
        const aiMessage = ref('');
        const developerMetrics = ref({ performance: 0, stability: 0, avgCommitSize: 0 });
        const developerStats = ref([]);
        const chartData = ref({ labels: [], datasets: [] });

        const chartOptions = computed(() => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }));

        const searchDeveloper = async () => {
            if (!searchEmail.value.trim()) {
                alert('Введите email разработчика');
                return;
            }

            isLoading.value = true;
            aiMessage.value = '';
            try {
                const data = await Api.analyzePerformance({
                    email: searchEmail.value.trim(),
                    startDate: dateFrom.value,
                    endDate: dateTo.value,
                    sonarProjectKey: testProject
                });

                selectedDeveloper.value = searchEmail.value.trim();
                aiMessage.value = extractAiMessage(data);

                const summary = data.metrics?.summary;
                const performance = data.metrics?.performance;

                developerMetrics.value = {
                    performance: computePerformanceScore(performance),
                    stability: computeStabilityScore(performance?.stability),
                    avgCommitSize: Math.round(summary?.averageChangeSize ?? 0)
                };

                developerStats.value = buildStatsTable(summary, performance);
                chartData.value = buildWeeklyChart(summary);
            } catch (error) {
                console.error(error);
                alert(`Ошибка анализа: ${error.message}`);
            } finally {
                isLoading.value = false;
            }
        };

        return {
            testProject,
            searchEmail,
            dateFrom,
            dateTo,
            isLoading,
            selectedDeveloper,
            developerMetrics,
            developerStats,
            chartData,
            chartOptions,
            aiMessage,
            searchDeveloper
        };
    }
};
</script>

<style scoped>
.hint {
    margin-top: 12px;
    font-size: 0.85rem;
    color: #64748b;
}
</style>
