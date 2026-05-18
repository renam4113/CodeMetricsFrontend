<template>
    <div class="page d-flex-column gap-20px">
        <div class="reports-header">
            <h2>Отчёты по проектам</h2>
            <span class="project-badge">
                <i class="pi pi-box"></i>
                {{ projectKey }}
            </span>
        </div>

        <div class="card">
            <div class="card-header">Quality Gate</div>
            <div v-if="isLoading" class="text-gray-500">Загрузка…</div>
            <div v-else :class="['qg-status', qualityGateClass]">
                <i :class="qualityGateIcon"></i>
                {{ qualityGateLabel }}
            </div>
            <p v-if="qualityGateDetail" class="qg-detail">{{ qualityGateDetail }}</p>
        </div>

        <div class="card">
            <div class="card-header">Метрики SonarQube</div>
            <div v-if="measureTiles.length" class="measures-grid">
                <div v-for="tile in measureTiles" :key="tile.key" class="measure-tile">
                    <div class="measure-tile__key">{{ tile.key }}</div>
                    <div class="measure-tile__value">{{ tile.value }}</div>
                </div>
            </div>
            <p v-else class="text-gray-500">Метрики не загружены</p>
        </div>

        <div class="card" v-if="scanSummary">
            <div class="card-header">Сводка scan-summary</div>
            <div class="grid-3 gap-12px" style="margin-bottom: 16px">
                <div class="measure-tile">
                    <div class="measure-tile__key">Quality Gate</div>
                    <div class="measure-tile__value">{{ scanSummary.qualityGateStatus || '—' }}</div>
                </div>
                <div class="measure-tile">
                    <div class="measure-tile__key">Открытых issues</div>
                    <div class="measure-tile__value">{{ scanSummary.openIssuesCount }}</div>
                </div>
                <div class="measure-tile">
                    <div class="measure-tile__key">Ветка</div>
                    <div class="measure-tile__value">{{ scanSummary.branch || '—' }}</div>
                </div>
            </div>
            <div v-if="summaryMeasureTiles.length" class="measures-grid">
                <div v-for="tile in summaryMeasureTiles" :key="'s-' + tile.key" class="measure-tile">
                    <div class="measure-tile__key">{{ tile.key }}</div>
                    <div class="measure-tile__value">{{ tile.value }}</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">Запуск сканирования</div>
            <div class="scan-toolbar">
                <span>
                    <label class="field-label">Ветка</label>
                    <InputText v-model="scanBranch" placeholder="main" style="min-width: 160px" />
                </span>
                <Button
                    label="Запустить сканирование"
                    icon="pi pi-play"
                    :loading="isScanning"
                    @click="runScan"
                />
                <Button
                    label="Обновить отчёт"
                    icon="pi pi-refresh"
                    severity="secondary"
                    :loading="isLoading"
                    @click="loadReport"
                />
            </div>
            <p v-if="lastScanResult" class="scan-result-msg" :class="{ error: !lastScanResult.success }">
                {{ lastScanResult.message || (lastScanResult.success ? 'Сканирование запущено' : 'Ошибка') }}
            </p>
        </div>

        <div class="card">
            <div class="card-header">История сканирований</div>
            <div v-if="scans.length" class="scan-list">
                <div
                    v-for="scan in scans"
                    :key="scan.id"
                    class="scan-item"
                    :class="`scan-item--${scan.status}`"
                >
                    <div class="scan-item__meta">
                        <span class="scan-item__branch">{{ scan.branch || '—' }}</span>
                        <span class="scan-item__date">{{ formatDate(scan.createdAt) }}</span>
                    </div>
                    <span class="scan-status-pill" :class="`scan-status-pill--${scan.status}`">
                        {{ statusLabel(scan.status) }}
                    </span>
                </div>
            </div>
            <p v-else class="text-gray-500">Сканирований пока нет</p>
        </div>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { Api } from '@/services';
import { TEST_SONAR_PROJECT } from '@/constants';
import { useScanHistory } from '@/composables/useScanHistory';
import {
    countFailedConditions,
    getQualityGateStatus,
    isQualityGateFailed,
    isQualityGatePassed,
    mapMeasuresToTiles,
    mapScanSummaryMeasures
} from '@/utils/sonarMappers';

/** @typedef {import('@/models/sonarQube.models.js').SonarQualityGateResult} SonarQualityGateResult */
/** @typedef {import('@/models/sonarQube.models.js').SonarMeasuresResult} SonarMeasuresResult */
/** @typedef {import('@/models/sonarQube.models.js').SonarScanSummaryDto} SonarScanSummaryDto */
/** @typedef {import('@/models/sonarQube.models.js').ScanTriggerResultDto} ScanTriggerResultDto */

export default {
    name: 'PageReports',
    components: { InputText, Button },
    setup() {
        const projectKey = TEST_SONAR_PROJECT;
        const branch = ref('main');
        const scanBranch = ref('main');
        const isLoading = ref(false);
        const isScanning = ref(false);
        /** @type {import('vue').Ref<SonarQualityGateResult|null>} */
        const qualityGate = ref(null);
        /** @type {import('vue').Ref<SonarMeasuresResult|null>} */
        const measures = ref(null);
        /** @type {import('vue').Ref<SonarScanSummaryDto|null>} */
        const scanSummary = ref(null);
        /** @type {import('vue').Ref<ScanTriggerResultDto|null>} */
        const lastScanResult = ref(null);
        const { scans, addScan, updateScan, upsertFromSummary } = useScanHistory(projectKey);

        const qgStatus = computed(() => getQualityGateStatus(qualityGate.value));

        const qualityGateClass = computed(() => {
            if (isQualityGatePassed(qgStatus.value)) return 'qg-status--ok';
            if (isQualityGateFailed(qgStatus.value)) return 'qg-status--error';
            return 'qg-status--unknown';
        });

        const qualityGateIcon = computed(() => {
            if (isQualityGatePassed(qgStatus.value)) return 'pi pi-check-circle';
            if (isQualityGateFailed(qgStatus.value)) return 'pi pi-times-circle';
            return 'pi pi-question-circle';
        });

        const qualityGateLabel = computed(() => {
            const status = qgStatus.value;
            if (!status) return 'Статус неизвестен';
            if (isQualityGatePassed(status)) return 'Quality Gate пройден';
            if (isQualityGateFailed(status)) return 'Quality Gate не пройден';
            return `Статус: ${status}`;
        });

        const qualityGateDetail = computed(() => {
            const failed = countFailedConditions(qualityGate.value);
            return failed > 0 ? `${failed} условий не выполнено` : '';
        });

        const measureTiles = computed(() => mapMeasuresToTiles(measures.value));
        const summaryMeasureTiles = computed(() => mapScanSummaryMeasures(scanSummary.value));

        const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');
        const statusLabel = (s) => ({
            completed: 'Завершено',
            running: 'Выполняется',
            failed: 'Ошибка',
            pending: 'В очереди'
        }[s] || s);

        const loadReport = async () => {
            isLoading.value = true;
            try {
                const [qg, meas, summary] = await Promise.all([
                    Api.getQualityGate(projectKey, branch.value),
                    Api.getMeasures(projectKey, branch.value),
                    Api.getScanSummary(projectKey, branch.value)
                ]);
                qualityGate.value = qg;
                measures.value = meas;
                scanSummary.value = summary;
                upsertFromSummary(summary, branch.value);
            } catch (error) {
                console.error(error);
                alert(`Ошибка загрузки отчёта: ${error.message}`);
            } finally {
                isLoading.value = false;
            }
        };

        const runScan = async () => {
            const b = scanBranch.value.trim() || 'main';
            const scanId = `scan_${Date.now()}`;
            addScan({ id: scanId, branch: b, status: 'running' });
            isScanning.value = true;

            try {
                const result = await Api.postScan({ projectKey, branch: b });
                lastScanResult.value = result;
                branch.value = b;
                updateScan(scanId, { status: result.success ? 'completed' : 'failed' });
                if (result.success) {
                    await loadReport();
                }
            } catch (error) {
                console.error(error);
                lastScanResult.value = { success: false, message: error.message };
                updateScan(scanId, { status: 'failed', error: error.message });
                alert(`Ошибка сканирования: ${error.message}`);
            } finally {
                isScanning.value = false;
            }
        };

        onMounted(loadReport);

        return {
            projectKey,
            branch,
            scanBranch,
            isLoading,
            isScanning,
            qualityGate,
            measures,
            scanSummary,
            lastScanResult,
            scans,
            qualityGateClass,
            qualityGateIcon,
            qualityGateLabel,
            qualityGateDetail,
            measureTiles,
            summaryMeasureTiles,
            loadReport,
            runScan,
            formatDate,
            statusLabel
        };
    }
};
</script>

<style scoped>
.field-label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    margin-bottom: 4px;
}

.qg-detail {
    margin-top: 10px;
    font-size: 0.85rem;
    color: #64748b;
}

.scan-result-msg {
    margin-top: 12px;
    font-size: 0.9rem;
    color: #166534;
}

.scan-result-msg.error {
    color: #991b1b;
}
</style>
