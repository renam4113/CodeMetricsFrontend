import { apiRequest, defaultPeriod } from './client';
import type {
  AuthorPerformanceDto,
  AuthorSummaryDto,
  CommitDetailDto,
  CommitListItemDto,
  ProjectMetricsDto,
  SyncResultDto,
} from '../types';

const controller = '/api/CodeMetrics';

export async function getAuthorSummary(
  email: string,
  startDate?: string,
  endDate?: string,
): Promise<AuthorSummaryDto> {
  const period = defaultPeriod();
  return apiRequest<AuthorSummaryDto>(`${controller}/author/summary`, {
    params: {
      email,
      startDate: startDate ?? period.start,
      endDate: endDate ?? period.end,
    },
  });
}

export async function getAuthorPerformance(
  email: string,
  startDate?: string,
  endDate?: string,
): Promise<AuthorPerformanceDto> {
  const period = defaultPeriod();
  return apiRequest<AuthorPerformanceDto>(`${controller}/author/performance`, {
    params: {
      email,
      startDate: startDate ?? period.start,
      endDate: endDate ?? period.end,
    },
  });
}

export async function getProjectMetrics(
  startDate?: string,
  endDate?: string,
): Promise<ProjectMetricsDto> {
  const period = defaultPeriod();
  return apiRequest<ProjectMetricsDto>(`${controller}/ProjectMetric`, {
    params: {
      startDate: startDate ?? period.start,
      endDate: endDate ?? period.end,
    },
  });
}

export async function syncFromGitea(
  repoName?: string,
  branch?: string,
  limit = 100,
): Promise<SyncResultDto> {
  return apiRequest<SyncResultDto>(`${controller}/UpdateDataBase`, {
    method: 'POST',
    params: { repoName, branch, limit },
  });
}

export async function getCommits(repoName: string): Promise<CommitListItemDto[]> {
  return apiRequest<CommitListItemDto[]>(`${controller}/Commits`, {
    params: { repoName },
  });
}

export async function getCommit(repoName: string, hash: string): Promise<CommitDetailDto> {
  return apiRequest<CommitDetailDto>(`${controller}/Commit`, {
    params: { repoName, hash },
  });
}
