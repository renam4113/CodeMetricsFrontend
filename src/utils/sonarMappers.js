/** @typedef {import('@/models/sonarQube.models.js').SonarQualityGateResult} SonarQualityGateResult */
/** @typedef {import('@/models/sonarQube.models.js').SonarMeasuresResult} SonarMeasuresResult */
/** @typedef {import('@/models/sonarQube.models.js').SonarScanSummaryDto} SonarScanSummaryDto */
/** @typedef {import('@/models/sonarQube.models.js').Measure} Measure */

/**
 * @param {SonarQualityGateResult|null|undefined} data
 * @returns {string|null}
 */
export function getQualityGateStatus(data) {
    return data?.status ?? null;
}

/**
 * @param {SonarQualityGateResult|null|undefined} data
 * @returns {number}
 */
export function countFailedConditions(data) {
    return (data?.conditions ?? []).filter((c) => c.status === 'ERROR').length;
}

/**
 * @param {SonarMeasuresResult|null|undefined} data
 * @returns {{ key: string, value: string }[]}
 */
export function mapMeasuresToTiles(data) {
    return (data?.measures ?? []).map((m) => ({
        key: m.metric ?? '—',
        value: m.value ?? m.periodValue ?? '—'
    }));
}

/**
 * @param {SonarScanSummaryDto|null|undefined} summary
 * @returns {{ key: string, value: string }[]}
 */
export function mapScanSummaryMeasures(summary) {
    return (summary?.measures ?? []).map((m) => ({
        key: m.metric ?? '—',
        value: m.value ?? '—'
    }));
}

/**
 * @param {string|null|undefined} status
 */
export function isQualityGatePassed(status) {
    return status === 'OK' || status === 'PASSED';
}

/**
 * @param {string|null|undefined} status
 */
export function isQualityGateFailed(status) {
    return status === 'ERROR' || status === 'FAILED';
}
