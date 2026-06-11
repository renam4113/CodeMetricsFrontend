import { apiRequest, encodePathSegment } from './client';
import type {
  AppConfigDto,
  SonarIssue,
  SonarMeasure,
  SonarMetricsResponse,
  SonarQualityGateResult,
  SonarScanSummaryDto,
} from '../types';

const controller = '/api/SonarQube';

export async function getAppConfig(): Promise<AppConfigDto> {
  return apiRequest<AppConfigDto>('/api/config');
}

export async function getScanSummary(projectKey: string, branch?: string): Promise<SonarScanSummaryDto> {
  return apiRequest<SonarScanSummaryDto>(
    `${controller}/scan-summary/${encodePathSegment(projectKey)}`,
    { params: { branch } },
  );
}

export async function getQualityGate(projectKey: string, branch?: string): Promise<SonarQualityGateResult> {
  return apiRequest<SonarQualityGateResult>(
    `${controller}/quality-gate/${encodePathSegment(projectKey)}`,
    { params: { branch } },
  );
}

export async function getMeasures(
  projectKey: string,
  branch?: string,
  metrics?: string[],
): Promise<{ name: string; measures: SonarMeasure[] }> {
  const params: Record<string, string | string[] | undefined> = { branch };
  if (metrics?.length) {
    params.metrics = metrics;
  }
  return apiRequest(`${controller}/measures/${encodePathSegment(projectKey)}`, { params });
}

export async function getIssues(
  projectKey: string,
  branch?: string,
  statuses = 'OPEN,CONFIRMED',
): Promise<SonarIssue[]> {
  return apiRequest<SonarIssue[]>(`${controller}/issues/${encodePathSegment(projectKey)}`, {
    params: { branch, statuses },
  });
}

export async function getAvailableMetrics(): Promise<SonarMetricsResponse> {
  return apiRequest<SonarMetricsResponse>(`${controller}/metrics`);
}

export async function triggerScan(
  projectKey: string,
  projectPath: string,
  branch?: string,
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`${controller}/scan`, {
    method: 'POST',
    body: JSON.stringify({ projectKey, projectPath, branch }),
  });
}
