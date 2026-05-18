/**
 * @file Модели CodeMetrics API (swagger: CodeMetrics).
 */

/**
 * @typedef {Object} PeriodDto
 * @property {string|null} [start]
 * @property {string|null} [end]
 */

/**
 * @typedef {Object} WeeklyActivityDto
 * @property {number} year
 * @property {number} week
 * @property {string|null} [from]
 * @property {string|null} [to]
 * @property {number} commitCount
 */

/**
 * @typedef {Object} DayActivityDto
 * @property {string|null} [day]
 * @property {number} commits
 */

/**
 * @typedef {Object} HourActivityDto
 * @property {number} hour
 * @property {number} commits
 */

/**
 * @typedef {Object} AuthorSummaryDto
 * @property {string|null} [author]
 * @property {PeriodDto} [period]
 * @property {WeeklyActivityDto[]|null} [weekly]
 * @property {number} averageChangeSize
 * @property {DayActivityDto[]|null} [bestDays]
 * @property {HourActivityDto[]|null} [bestHours]
 */

/**
 * @typedef {Object} SpeedMetricsDto
 * @property {number} commits
 * @property {number} Useful_Lines
 */

/**
 * @typedef {Object} StabilityMetricsDto
 * @property {number[]|null} [weeks]
 */

/**
 * @typedef {Object} NormalizationMetricsDto
 * @property {number} Max_Commits
 * @property {number} Min_Commits
 * @property {number} Max_Lines
 * @property {number} Min_Lines
 */

/**
 * @typedef {Object} AuthorPerformanceDto
 * @property {string|null} [author]
 * @property {SpeedMetricsDto} [speed]
 * @property {StabilityMetricsDto} [stability]
 * @property {NormalizationMetricsDto} [normalization]
 */

/**
 * @typedef {Object} ActiveCommitterDto
 * @property {string|null} [name]
 * @property {string|null} [email]
 * @property {number} commitCount
 * @property {number} totalChangedLines
 */

/**
 * @typedef {Object} ProjectMetricsDto
 * @property {string|null} [project]
 * @property {PeriodDto} [period]
 * @property {ActiveCommitterDto[]|null} [activeCommitters]
 * @property {number} totalCommits
 * @property {number} totalChangedLines
 * @property {number} repositoryCount
 */

/**
 * @typedef {Object} CommitListItemDto
 * @property {string|null} [hash]
 * @property {string|null} [message]
 * @property {string|null} [authorEmail]
 * @property {string|null} [authorName]
 * @property {string} createdAt
 * @property {string|null} [repoName]
 * @property {string|null} [committerEmail]
 * @property {string|null} [committerName]
 */

/**
 * @typedef {Object} CommitStatsDto
 * @property {number} addedLines
 * @property {number} deletedLines
 * @property {number} changedFiles
 * @property {number} totalChanges
 */

/**
 * @typedef {Object} CommitDetailDto
 * @property {string|null} [hash]
 * @property {string|null} [message]
 * @property {string|null} [authorEmail]
 * @property {string|null} [authorName]
 * @property {string} createdAt
 * @property {string|null} [repoName]
 * @property {string|null} [committerEmail]
 * @property {string|null} [committerName]
 * @property {CommitStatsDto} [stats]
 */

/**
 * @typedef {Object} BranchDto
 * @property {string|null} [branchName]
 * @property {string|null} [repoName]
 * @property {string|null} [lastCommitHash]
 */

/**
 * @typedef {Object} RepositoryDto
 * @property {string|null} [repoName]
 * @property {string|null} [ownerName]
 * @property {string|null} [defaultBranch]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {boolean} isFork
 */

/**
 * @typedef {Object} UserDto
 * @property {string|null} [userEmail]
 * @property {string|null} [userName]
 */

/**
 * @typedef {Object} SyncResultDto
 * @property {string|null} [message]
 * @property {number} repositoriesAdded
 * @property {number} usersAdded
 * @property {number} commitsAdded
 * @property {number} commitStatsAdded
 * @property {number} branchesAdded
 */

export {};
