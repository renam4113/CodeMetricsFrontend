import { request, toQuery } from './http';

/** @typedef {import('@/models/sonarQube.models.js').SonarQualityGateResult} SonarQualityGateResult */
/** @typedef {import('@/models/sonarQube.models.js').SonarMeasuresResult} SonarMeasuresResult */
/** @typedef {import('@/models/sonarQube.models.js').SonarScanSummaryDto} SonarScanSummaryDto */
/** @typedef {import('@/models/sonarQube.models.js').SonarAvailableMetricsResponseDto} SonarAvailableMetricsResponseDto */
/** @typedef {import('@/models/sonarQube.models.js').ScanRequestDto} ScanRequestDto */
/** @typedef {import('@/models/sonarQube.models.js').ScanTriggerResultDto} ScanTriggerResultDto */
/** @typedef {import('@/models/sonarQube.models.js').SonarIssue} SonarIssue */

/**
 * @param {string} projectKey
 * @param {string} [branch]
 * @returns {Promise<SonarQualityGateResult>}
 */
export function getQualityGate(projectKey, branch) {
    return request(`api/SonarQube/quality-gate/${encodeURIComponent(projectKey)}${toQuery({ branch })}`);
}

/**
 * @param {string} projectKey
 * @param {string} [branch]
 * @param {string[]} [metrics]
 * @returns {Promise<SonarMeasuresResult>}
 */
export function getMeasures(projectKey, branch, metrics) {
    return request(`api/SonarQube/measures/${encodeURIComponent(projectKey)}${toQuery({ branch, metrics })}`);
}

/**
 * @param {string} projectKey
 * @param {string} [branch]
 * @returns {Promise<SonarScanSummaryDto>}
 */
export function getScanSummary(projectKey, branch) {
    return request(`api/SonarQube/scan-summary/${encodeURIComponent(projectKey)}${toQuery({ branch })}`);
}

/**
 * @returns {Promise<SonarAvailableMetricsResponseDto>}
 */
export function getAvailableMetrics() {
    return request('api/SonarQube/metrics');
}

/**
 * @param {string} projectKey
 * @param {string} [branch]
 * @param {string} [statuses]
 * @returns {Promise<SonarIssue[]>}
 */
export function getIssues(projectKey, branch, statuses = 'OPEN,CONFIRMED') {
    return request(`api/SonarQube/issues/${encodeURIComponent(projectKey)}${toQuery({ branch, statuses })}`);
}

/**
 * @param {ScanRequestDto} payload
 * @returns {Promise<ScanTriggerResultDto>}
 */
export function postScan(payload) {
    return request('api/SonarQube/scan', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
