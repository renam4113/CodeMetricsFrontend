export interface ApiErrorBody {
  error?: string;
  details?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface PeriodDto {
  start: string;
  end: string;
}

export interface WeeklyActivityDto {
  year: number;
  week: number;
  from: string;
  to: string;
  commitCount: number;
}

export interface DayActivityDto {
  day: string;
  commits: number;
}

export interface HourActivityDto {
  hour: number;
  commits: number;
}

export interface AuthorSummaryDto {
  author: string;
  period: PeriodDto;
  weekly: WeeklyActivityDto[];
  averageChangeSize: number;
  bestDays: DayActivityDto[];
  bestHours: HourActivityDto[];
}

export interface SpeedMetricsDto {
  commits: number;
  useful_Lines: number;
}

export interface StabilityMetricsDto {
  weeks: number[];
}

export interface NormalizationMetricsDto {
  max_Commits: number;
  min_Commits: number;
  max_Lines: number;
  min_Lines: number;
}

export interface AuthorPerformanceDto {
  author: string;
  speed: SpeedMetricsDto;
  stability: StabilityMetricsDto;
  normalization: NormalizationMetricsDto;
}

export interface ActiveCommitterDto {
  name: string;
  email: string;
  commitCount: number;
  totalChangedLines: number;
}

export interface ProjectMetricsDto {
  project: string;
  period: PeriodDto;
  activeCommitters: ActiveCommitterDto[];
  totalCommits: number;
  totalChangedLines: number;
  repositoryCount: number;
}

export interface RepositoryDto {
  repoName: string;
  ownerName: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  isFork: boolean;
}

export interface BranchDto {
  branchName: string;
  repoName: string;
  lastCommitHash: string;
}

export interface CommitListItemDto {
  hash: string;
  message: string;
  authorEmail: string;
  authorName: string;
  createdAt: string;
  repoName: string;
  committerEmail: string;
  committerName: string;
}

export interface CommitStatsRecordDto {
  commitHash: string;
  addedLines: number;
  deletedLines: number;
  changedFiles: number;
  totalChanges: number;
}

export interface SonarMeasure {
  metric: string;
  value?: string;
  periodValue?: string;
}

export interface SonarQualityGateResult {
  status: string;
  conditions: Array<{
    metricKey: string;
    status: string;
    actualValue?: string;
    errorThreshold?: string;
  }>;
}

export interface SonarIssue {
  key: string;
  rule: string;
  severity: string;
  message: string;
  status: string;
  branch?: string;
  component: string;
}

export interface SonarScanSummaryDto {
  projectKey: string;
  branch?: string;
  qualityGateStatus: string;
  measures: SonarMeasure[];
  openIssuesCount: number;
  issuesBySeverity: Record<string, number>;
}

export interface SonarMetricInfo {
  key: string;
  name: string;
  description?: string;
  type: string;
  domain?: string;
}

export interface SonarMetricsResponse {
  count: number;
  commonExamples: string[];
  metrics: SonarMetricInfo[];
}

export interface SyncResultDto {
  message: string;
  repositoriesAdded: number;
  usersAdded: number;
  commitsAdded: number;
  commitStatsAdded: number;
  branchesAdded: number;
}

export interface OllamaTextResponseDto {
  text: string;
}

export interface PerformanceAnalysisResponseDto {
  author: string;
  period: PeriodDto;
  comment: string;
  metrics: {
    summary: AuthorSummaryDto;
    performance: AuthorPerformanceDto;
    project: ProjectMetricsDto;
  };
}

export interface AppConfigDto {
  sonarProjectKey: string;
  sonarConfigured: boolean;
}
