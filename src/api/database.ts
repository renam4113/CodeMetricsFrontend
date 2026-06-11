import { apiRequest } from './client';
import type {
  BranchDto,
  CommitListItemDto,
  CommitStatsRecordDto,
  RepositoryDto,
  UserDto,
} from '../types';

const base = '/api/database';

export async function getRepositories(): Promise<RepositoryDto[]> {
  return apiRequest<RepositoryDto[]>(`${base}/repositories`);
}

export async function getRepository(repoName: string): Promise<RepositoryDto> {
  return apiRequest<RepositoryDto>(`${base}/repositories/${encodeURIComponent(repoName)}`);
}

export async function getBranches(repoName: string): Promise<BranchDto[]> {
  return apiRequest<BranchDto[]>(`${base}/repositories/${encodeURIComponent(repoName)}/branches`);
}

export async function getCommitsByRepo(repoName: string): Promise<CommitListItemDto[]> {
  return apiRequest<CommitListItemDto[]>(
    `${base}/repositories/${encodeURIComponent(repoName)}/commits`,
  );
}

export async function getCommitStats(hash: string): Promise<CommitStatsRecordDto> {
  return apiRequest<CommitStatsRecordDto>(`${base}/commits/${encodeURIComponent(hash)}/stats`);
}

export async function getUser(email: string): Promise<UserDto> {
  return apiRequest<UserDto>(`${base}/users/${encodeURIComponent(email)}`);
}
