import { apiRequest, defaultPeriod } from './client';
import type { OllamaTextResponseDto, PerformanceAnalysisResponseDto } from '../types';

const controller = '/api/Olama';

export async function askOllama(payload: {
  text: string;
  sonarProjectKey?: string;
  sonarBranch?: string;
  metricsAuthorEmail?: string;
  metricsStartDate?: string;
  metricsEndDate?: string;
}): Promise<OllamaTextResponseDto> {
  return apiRequest<OllamaTextResponseDto>(`${controller}/ask`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function chatOllama(text: string): Promise<OllamaTextResponseDto> {
  return apiRequest<OllamaTextResponseDto>(`${controller}/chat`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function analyzePerformance(params: {
  email: string;
  startDate?: string;
  endDate?: string;
  context?: string;
  sonarProjectKey?: string;
  sonarBranch?: string;
}): Promise<PerformanceAnalysisResponseDto> {
  const period = defaultPeriod();
  return apiRequest<PerformanceAnalysisResponseDto>(`${controller}/analyze-performance`, {
    params: {
      email: params.email,
      startDate: params.startDate ?? period.start,
      endDate: params.endDate ?? period.end,
      context: params.context,
      sonarProjectKey: params.sonarProjectKey,
      sonarBranch: params.sonarBranch,
    },
  });
}
