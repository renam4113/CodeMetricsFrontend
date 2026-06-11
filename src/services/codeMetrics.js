import { request, toQuery } from './http';

/** @typedef {import('@/models/codeMetrics.models.js').CommitListItemDto} CommitListItemDto */
/** @typedef {import('@/models/codeMetrics.models.js').AuthorSummaryDto} AuthorSummaryDto */
/** @typedef {import('@/models/codeMetrics.models.js').AuthorPerformanceDto} AuthorPerformanceDto */
/** @typedef {import('@/models/codeMetrics.models.js').ProjectMetricsDto} ProjectMetricsDto */
/** @typedef {import('@/models/codeMetrics.models.js').RepositoryDto} RepositoryDto */

const GETBY_EXTRA_INSTANCE = process.env.VUE_APP_GETBY_PERIOD_INSTANCE || '';

/**
 * @returns {Promise<RepositoryDto[]>}
 */
export function getRepositories() {
    return request('repositories');
}

/**
 * @param {string} name
 * @param {Date} [startDate]
 * @param {Date} [endDate]
 * @returns {Promise<CommitListItemDto[]>}
 */
export function getCommitsByRepository(name, startDate, endDate) {
    return request(`api/CodeMetrics/GetByPeriod${toQuery({
        ...(GETBY_EXTRA_INSTANCE ? { instance: GETBY_EXTRA_INSTANCE } : {}),
        name,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined
    })}`);
}

/**
 * @param {string} email
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<AuthorSummaryDto>}
 */
export function getAuthorSummary(email, startDate, endDate) {
    return request(`api/CodeMetrics/author/summary${toQuery({ email, startDate, endDate })}`);
}

/**
 * @param {string} email
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Promise<AuthorPerformanceDto>}
 */
export function getAuthorPerformance(email, startDate, endDate) {
    return request(`api/CodeMetrics/author/performance${toQuery({ email, startDate, endDate })}`);
}

/**
 * @param {Date} [startDate]
 * @param {Date} [endDate]
 * @returns {Promise<ProjectMetricsDto>}
 */
export function getProjectMetrics(startDate, endDate) {
    return request(`api/CodeMetrics/ProjectMetric${toQuery({ startDate, endDate })}`);
}

/**
 * @param {string|null} [repoName]
 * @param {string|null} [branch]
 * @param {number} [limit]
 */
export function updateDatabase(repoName = null, branch = null, limit = 100) {
    return request(`api/CodeMetrics/UpdateDataBase${toQuery({ repoName, branch, limit })}`, { method: 'POST' });
}

export function getWeeklyStability(repoName, weeks = 8) {
    return request(`api/CodeMetrics/stability/weekly/${encodeURIComponent(repoName)}${toQuery({ weeks })}`);
}

export function getNormalizationMetrics(repoName, period = 'month') {
    return request(`api/CodeMetrics/normalization/${encodeURIComponent(repoName)}${toQuery({ period })}`);
}

export function getTeamMetrics(repoName, startDate, endDate) {
    return request(`api/CodeMetrics/team-metrics${toQuery({ repoName, startDate, endDate })}`);
}
