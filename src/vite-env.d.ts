/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_SONAR_PROJECT_KEY?: string;
  readonly VITE_SONAR_DEFAULT_BRANCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
