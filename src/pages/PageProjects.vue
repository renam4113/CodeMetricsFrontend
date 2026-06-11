<template>
    <div class="page d-flex-column gap-20px">
        <h2>Аналитика репозиториев</h2>

        <div class="card">
            <div class="card-header">Параметры выборки</div>
            <div class="d-flex gap-12px flex-wrap">
                <Dropdown
                    v-model="selectedRepo"
                    :options="repoOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Выберите репозиторий"
                    class="flex-1"
                    style="min-width: 200px"
                />
                <Calendar v-model="dateFrom" showTime hourFormat="24" placeholder="Дата начала" />
                <Calendar v-model="dateTo" showTime hourFormat="24" placeholder="Дата окончания" />
                <Button label="Загрузить" icon="pi pi-download" :loading="isLoading" @click="loadCommits" />
            </div>
        </div>

        <div v-if="commits.length" class="grid-3">
            <div class="metric-card">
                <div class="metric-label">Коммитов</div>
                <div class="metric-value">{{ summary.commitCount }}</div>
                <div class="metric-subtitle">{{ summary.period }}</div>
            </div>
            <div class="metric-card" style="background: linear-gradient(135deg, #4caf50, #8bc34a)">
                <div class="metric-label">Активных авторов</div>
                <div class="metric-value">{{ summary.authorCount }}</div>
                <div class="metric-subtitle">за период</div>
            </div>
            <div class="metric-card" style="background: linear-gradient(135deg, #ff9800, #ff5722)">
                <div class="metric-label">Последний коммит</div>
                <div class="metric-value">{{ summary.lastCommitDate }}</div>
                <div class="metric-subtitle">локальное время</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">Коммиты репозитория</div>
            <DataTable :value="commitsTable" class="p-datatable-sm" responsiveLayout="scroll">
                <Column field="hash" header="Хеш" />
                <Column field="author" header="Автор" />
                <Column field="message" header="Сообщение" />
                <Column field="createdAt" header="Дата" />
            </DataTable>
        </div>

        <div v-if="chartData.labels.length" class="card">
            <div class="card-header">Динамика коммитов по дням</div>
            <div class="chart-wrap">
                <Chart type="bar" :data="chartData" :options="chartOptions" />
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chart from 'primevue/chart';
import { Api } from '@/services';

const FALLBACK_REPOS = [
    { label: 'CodeMetricsBackend', value: 'CodeMetricsBackend' },
    { label: 'CodeMetricsFrontend', value: 'CodeMetricsFrontend' }
];

export default {
    name: 'PageProjects',
    components: { Dropdown, Button, Calendar, DataTable, Column, Chart },
    setup() {
        const store = useStore();
        const selectedRepo = ref(null);
        const dateFrom = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const dateTo = ref(new Date());
        const isLoading = ref(false);
        const commits = ref([]);

        const repoOptions = computed(() => {
            const raw = store.getters['repositories/getRepositories'] || [];
            const mapped = raw
                .map((r) => {
                    const value = r.repoName ?? r.RepoName ?? r.name ?? '';
                    return value ? { label: value, value } : null;
                })
                .filter(Boolean);
            return mapped.length ? mapped : FALLBACK_REPOS;
        });

        watch(repoOptions, (opts) => {
            if (!selectedRepo.value && opts.length) {
                selectedRepo.value = opts[0].value;
            }
        }, { immediate: true });

        const commitsTable = computed(() =>
            commits.value.map((c) => ({
                hash: (c.hash ?? '').slice(0, 8),
                message: c.message ?? '',
                author: c.authorName || c.authorEmail || '—',
                createdAt: c.createdAt ? new Date(c.createdAt).toLocaleString() : ''
            }))
        );

        const summary = computed(() => {
            const authors = commits.value.map((c) => c.authorEmail || c.authorName).filter(Boolean);
            const dates = commits.value
                .map((c) => c.createdAt)
                .filter(Boolean)
                .map((d) => new Date(d))
                .sort((a, b) => b - a);

            return {
                commitCount: commits.value.length,
                authorCount: new Set(authors).size,
                lastCommitDate: dates[0] ? dates[0].toLocaleDateString() : '—',
                period: `${dateFrom.value.toLocaleDateString()} — ${dateTo.value.toLocaleDateString()}`
            };
        });

        const chartData = computed(() => {
            if (!dateFrom.value || !dateTo.value) return { labels: [], datasets: [] };

            const start = new Date(dateFrom.value);
            const end = new Date(dateTo.value);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            if (end < start) return { labels: [], datasets: [] };

            const dayMs = 86400000;
            const labels = [];
            const counts = [];

            for (let d = new Date(start); d <= end; d = new Date(d.getTime() + dayMs)) {
                labels.push(d.toLocaleDateString());
                counts.push(
                    commits.value.filter((c) => {
                        if (!c.createdAt) return false;
                        const cd = new Date(c.createdAt);
                        cd.setHours(0, 0, 0, 0);
                        return cd.getTime() === d.getTime();
                    }).length
                );
            }

            return {
                labels,
                datasets: [{
                    label: 'Коммиты',
                    backgroundColor: '#667eea',
                    borderColor: '#764ba2',
                    borderWidth: 1,
                    data: counts
                }]
            };
        });

        const chartOptions = computed(() => ({
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }));

        const loadCommits = async () => {
            if (!selectedRepo.value) {
                alert('Выберите репозиторий');
                return;
            }
            isLoading.value = true;
            try {
                const data = await Api.getCommitsByRepository(
                    selectedRepo.value,
                    dateFrom.value,
                    dateTo.value
                );
                commits.value = Array.isArray(data) ? data : [];
            } catch (error) {
                console.error(error);
                alert(`Ошибка загрузки: ${error.message}`);
            } finally {
                isLoading.value = false;
            }
        };

        return {
            repoOptions,
            selectedRepo,
            dateFrom,
            dateTo,
            isLoading,
            commitsTable,
            summary,
            chartData,
            chartOptions,
            commits,
            loadCommits
        };
    }
};
</script>
