/**
 * @file Модели Ollama API (swagger: Olama).
 */

/** @typedef {import('./codeMetrics.models.js').AuthorSummaryDto} AuthorSummaryDto */
/** @typedef {import('./codeMetrics.models.js').AuthorPerformanceDto} AuthorPerformanceDto */
/** @typedef {import('./codeMetrics.models.js').ProjectMetricsDto} ProjectMetricsDto */
/** @typedef {import('./codeMetrics.models.js').PeriodDto} PeriodDto */

/**
 * @typedef {Object} OllamaTextRequestDto
 * @property {string|null} [text]
 * @property {string|null} [sonarProjectKey]
 * @property {string|null} [sonarBranch]
 * @property {string|null} [metricsAuthorEmail]
 * @property {string|null} [metricsStartDate]
 * @property {string|null} [metricsEndDate]
 */

/**
 * @typedef {Object} OllamaTextResponseDto
 * @property {string|null} [text]
 */

/**
 * @typedef {Object} PerformanceAnalysisMetricsDto
 * @property {AuthorSummaryDto} [summary]
 * @property {AuthorPerformanceDto} [performance]
 * @property {ProjectMetricsDto} [project]
 */

/**
 * @typedef {Object} PerformanceAnalysisResponseDto
 * @property {string|null} [author]
 * @property {PeriodDto} [period]
 * @property {string|null} [comment]
 * @property {PerformanceAnalysisMetricsDto} [metrics]
 */

/**
 * @typedef {Object} FineTuningMethodDto
 * @property {string|null} [name]
 * @property {string|null} [description]
 * @property {string|null} [difficulty]
 */

/**
 * @typedef {Object} FineTuningGuideDto
 * @property {string|null} [currentModel]
 * @property {boolean} canFineTuneLocally
 * @property {string|null} [summary]
 * @property {string[]|null} [recommendations]
 * @property {FineTuningMethodDto[]|null} [methods]
 */

export {};
