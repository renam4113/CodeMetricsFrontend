<template>
    <div class="page d-flex-column gap-20px">
        <h2>Аналитика репозиториев</h2>

        <div class="card">
            <div class="card-header">Параметры выборки</div>
            <div class="d-flex gap-12px flex-wrap">
                <Dropdown v-model="selectedRepo"
                          :options="repoOptions"
                          optionLabel="label"
                          optionValue="value"
                          placeholder="Выберите репозиторий"
                          class="flex-1" />
                <DatePicker v-model="dateFrom"
                            showTime
                            hourFormat="24"
                            placeholder="Дата начала" />
                <DatePicker v-model="dateTo"
                            showTime
                            hourFormat="24"
                            placeholder="Дата окончания" />
                <Button @click="loadCommits"
                        severity="primary"
                        :loading="isLoading">
                    Загрузить
                </Button>
            </div>
        </div>

        <div v-if="commitsTable.length" class="grid-3 gap-20px">
            <div class="metric-card">
                <div class="metric-label">Коммитов</div>
                <div class="metric-value">{{ summary.commitCount }}</div>
                <div class="metric-subtitle">{{ summary.period }}</div>
            </div>

            <div class="metric-card" style="background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);">
                <div class="metric-label">Активных авторов</div>
                <div class="metric-value">{{ summary.authorCount }}</div>
                <div class="metric-subtitle">за выбранный период</div>
            </div>

            <div class="metric-card" style="background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);">
                <div class="metric-label">Последний коммит</div>
                <div class="metric-value">{{ summary.lastCommitDate }}</div>
                <div class="metric-subtitle">локальное время</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">Коммиты репозитория</div>
            <DataTable :value="commitsTable" class="p-datatable-sm" responsiveLayout="scroll">
                <Column field="hash" header="Хеш"></Column>
                <Column field="author" header="Автор"></Column>
                <Column field="message" header="Сообщение"></Column>
                <Column field="createdAt" header="Дата"></Column>
            </DataTable>
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
    import { Api } from '@/services';

    export default {
        name: "PageProjects",
        components: {
            Dropdown,
            Button,
            DatePicker: Calendar,
            DataTable,
            Column
        },
        setup() {
            const store = useStore();
            const repositories = computed(() => store.getters['repositories/getRepositories'] || []);
            const repoOptions = computed(() => repositories.value.map(r => {
                const label = typeof r === 'string'
                    ? r
                    : r.name || r.repoName || r.RepoName || r.label || '';

                return label ? { label, value: label } : null;
            }).filter(Boolean));

            const selectedRepo = ref(null);
            const dateFrom = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
            const dateTo = ref(new Date());
            const isLoading = ref(false);
            const commits = ref([]);

            watch(repoOptions, (opts) => {
                if (!selectedRepo.value && opts.length) {
                    selectedRepo.value = opts[0].value;
                }
            }, { immediate: true });

            const commitsTable = computed(() => commits.value.map((c) => {
                const hash = c.hash || c.Hash || '';
                const message = c.message || c.Message || '';
                const author = c.authorName || c.authorEmail || c.AuthorName || c.AuthorEmail || 'Неизвестно';
                const createdAtRaw = c.createdAt || c.CreatedAt;
                const createdAt = createdAtRaw
                    ? new Date(createdAtRaw).toLocaleString()
                    : '';

                return { hash, message, author, createdAt };
            }));

            const summary = computed(() => {
                const authorEmails = commits.value
                    .map((c) => c.authorEmail || c.AuthorEmail || c.authorName || c.AuthorName)
                    .filter(Boolean);

                const lastCommitDate = commits.value
                    .map((c) => c.createdAt || c.CreatedAt)
                    .filter(Boolean)
                    .map((d) => new Date(d))
                    .sort((a, b) => b.getTime() - a.getTime())[0];

                return {
                    commitCount: commits.value.length,
                    authorCount: new Set(authorEmails).size,
                    lastCommitDate: lastCommitDate ? lastCommitDate.toLocaleDateString() : '—',
                    period: `${dateFrom.value.toLocaleDateString()} — ${dateTo.value.toLocaleDateString()}`
                };
            });

            const loadCommits = async () => {
                if (!selectedRepo.value) {
                    alert('Выберите репозиторий');
                    return;
                }

                isLoading.value = true;
                try {
                    const response = await Api.getCommitsByRepository(selectedRepo.value, dateFrom.value, dateTo.value);
                    if (!response.ok) {
                        throw new Error('Не удалось загрузить коммиты');
                    }

                    const data = await response.json();
                    commits.value = Array.isArray(data) ? data : [];
                } catch (error) {
                    console.error('Error loading commits:', error);
                    alert('Ошибка при загрузке данных по репозиторию');
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
                loadCommits
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