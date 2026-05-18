import { ref, watch } from 'vue';

/** @typedef {import('@/models/sonarQube.models.js').SonarScanSummaryDto} SonarScanSummaryDto */

/**
 * @typedef {Object} ScanHistoryEntry
 * @property {string} id
 * @property {string} projectKey
 * @property {string} [branch]
 * @property {'pending'|'running'|'completed'|'failed'} status
 * @property {string} createdAt
 * @property {SonarScanSummaryDto} [summary]
 * @property {string} [error]
 */

const STORAGE_KEY = 'codeMetrics_scan_history';

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/**
 * @param {string} projectKey
 */
export function useScanHistory(projectKey) {
    /** @type {import('vue').Ref<ScanHistoryEntry[]>} */
    const scans = ref(load().filter((s) => s.projectKey === projectKey));

    watch(scans, (value) => {
        const others = load().filter((s) => s.projectKey !== projectKey);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...others, ...value]));
    }, { deep: true });

    /**
     * @param {Partial<ScanHistoryEntry>} entry
     */
    function addScan(entry) {
        scans.value.unshift({
            id: entry.id || `scan_${Date.now()}`,
            projectKey,
            status: entry.status || 'pending',
            ...entry,
            createdAt: entry.createdAt || new Date().toISOString()
        });
    }

    /**
     * @param {string} id
     * @param {Partial<ScanHistoryEntry>} patch
     */
    function updateScan(id, patch) {
        const idx = scans.value.findIndex((s) => s.id === id);
        if (idx >= 0) {
            scans.value[idx] = { ...scans.value[idx], ...patch };
        }
    }

    /**
     * @param {SonarScanSummaryDto|null|undefined} summary
     * @param {string} branch
     */
    function upsertFromSummary(summary, branch) {
        if (!summary) return;
        const resolvedBranch = branch || summary.branch || 'main';
        const existing = scans.value.find(
            (s) => s.branch === resolvedBranch && s.status === 'completed'
        );
        const payload = {
            branch: resolvedBranch,
            status: /** @type {'completed'} */ ('completed'),
            summary
        };
        if (existing) {
            updateScan(existing.id, payload);
        } else {
            addScan(payload);
        }
    }

    return { scans, addScan, updateScan, upsertFromSummary };
}
