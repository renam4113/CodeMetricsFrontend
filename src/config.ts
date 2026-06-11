export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  sonarProjectKey: import.meta.env.VITE_SONAR_PROJECT_KEY ?? 'renamshina',
  defaultBranch: import.meta.env.VITE_SONAR_DEFAULT_BRANCH ?? 'main',
} as const;
