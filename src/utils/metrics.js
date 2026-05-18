/** @typedef {import('@/models/codeMetrics.models.js').AuthorSummaryDto} AuthorSummaryDto */
/** @typedef {import('@/models/codeMetrics.models.js').AuthorPerformanceDto} AuthorPerformanceDto */
/** @typedef {import('@/models/codeMetrics.models.js').StabilityMetricsDto} StabilityMetricsDto */
/** @typedef {import('@/models/ollama.models.js').PerformanceAnalysisResponseDto} PerformanceAnalysisResponseDto */

/**
 * @param {StabilityMetricsDto|undefined|null} stability
 */
export function computeStabilityScore(stability) {
    const weeks = stability?.weeks ?? [];
    if (!weeks.length) return 0;

    const mean = weeks.reduce((a, b) => a + b, 0) / weeks.length;
    if (mean === 0) return 0;

    const variance = weeks.reduce((sum, v) => sum + (v - mean) ** 2, 0) / weeks.length;
    const cv = Math.sqrt(variance) / mean;
    return Math.max(0, Math.min(10, 10 - cv * 10));
}

/**
 * @param {AuthorPerformanceDto|undefined|null} performance
 */
export function computePerformanceScore(performance) {
    const speed = performance?.speed;
    const commits = speed?.commits ?? 0;
    const lines = speed?.Useful_Lines ?? 0;
    const raw = commits * 0.4 + Math.min(lines / 100, 10) * 0.6;
    return Math.max(0, Math.min(10, raw));
}

/**
 * @param {AuthorSummaryDto|undefined|null} summary
 */
export function buildWeeklyChart(summary) {
    const weekly = summary?.weekly ?? [];
    return {
        labels: weekly.map((w) => `Нед. ${w.week}`),
        datasets: [{
            label: 'Коммиты',
            backgroundColor: '#667eea',
            borderColor: '#764ba2',
            borderWidth: 1,
            data: weekly.map((w) => w.commitCount)
        }]
    };
}

/**
 * @param {AuthorSummaryDto|undefined|null} summary
 * @param {AuthorPerformanceDto|undefined|null} performance
 */
export function buildStatsTable(summary, performance) {
    const speed = performance?.speed;
    const weeks = performance?.stability?.weeks ?? [];

    return [
        {
            metric: 'Количество коммитов',
            value: String(speed?.commits ?? 0),
            trend: 'stable'
        },
        {
            metric: 'Полезные строки',
            value: String(speed?.Useful_Lines ?? 0),
            trend: 'up'
        },
        {
            metric: 'Средний размер изменения',
            value: String(Math.round(summary?.averageChangeSize ?? 0)),
            trend: 'stable'
        },
        {
            metric: 'Недель в выборке',
            value: String(weeks.length),
            trend: 'stable'
        },
        {
            metric: 'Лучший день недели',
            value: summary?.bestDays?.[0]?.day ?? '—',
            trend: 'stable'
        }
    ];
}

/**
 * @param {PerformanceAnalysisResponseDto|undefined|null} data
 */
export function extractAiMessage(data) {
    return data?.comment ?? '';
}
