/**
 * @file Модели SonarQube API (swagger: SonarQube).
 */

/**
 * @typedef {Object} Condition
 * @property {string|null} [metricKey]
 * @property {string|null} [status]
 * @property {string|null} [actualValue]
 * @property {string|null} [errorThreshold]
 */

/**
 * @typedef {Object} SonarQualityGateResult
 * @property {string|null} [status]
 * @property {Condition[]|null} [conditions]
 */

/**
 * @typedef {Object} Measure
 * @property {string|null} [metric]
 * @property {string|null} [value]
 * @property {string|null} [periodValue]
 */

/**
 * @typedef {Object} SonarMeasuresResult
 * @property {string|null} [name]
 * @property {Measure[]|null} [measures]
 */

/**
 * @typedef {Object} IssueTextRange
 * @property {number|null} [startLine]
 * @property {number|null} [endLine]
 * @property {number|null} [startOffset]
 * @property {number|null} [endOffset]
 */

/**
 * @typedef {Object} SonarIssue
 * @property {string|null} [key]
 * @property {string|null} [rule]
 * @property {string|null} [severity]
 * @property {string|null} [message]
 * @property {string|null} [status]
 * @property {string|null} [branch]
 * @property {string|null} [component]
 * @property {IssueTextRange} [textRange]
 */

/**
 * @typedef {Object} SonarMetricInfo
 * @property {string|null} [key]
 * @property {string|null} [name]
 * @property {string|null} [description]
 * @property {string|null} [type]
 * @property {string|null} [domain]
 */

/**
 * @typedef {Object} SonarAvailableMetricsResponseDto
 * @property {number} count
 * @property {string[]|null} [commonExamples]
 * @property {SonarMetricInfo[]|null} [metrics]
 */

/**
 * @typedef {Object} SonarScanSummaryDto
 * @property {string|null} [projectKey]
 * @property {string|null} [branch]
 * @property {string|null} [qualityGateStatus]
 * @property {Measure[]|null} [measures]
 * @property {number} openIssuesCount
 * @property {Record<string, number>|null} [issuesBySeverity]
 */

/**
 * @typedef {Object} ScanRequestDto
 * @property {string|null} [projectKey]
 * @property {string|null} [projectPath]
 * @property {string|null} [branch]
 * @property {Record<string, string>|null} [additionalParams]
 */

/**
 * @typedef {Object} ScanTriggerResultDto
 * @property {boolean} success
 * @property {string|null} [message]
 */

/** @typedef {'OK'|'ERROR'|'PASSED'|'FAILED'|string} QualityGateStatus */

export {};
