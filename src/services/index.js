import { API_BASE } from '@/constants';
import * as codeMetrics from './codeMetrics';
import * as ollama from './ollama';
import * as sonarQube from './sonarQube';

export const Api = {
    api: API_BASE,
    ...codeMetrics,
    ...ollama,
    ...sonarQube
};

export { codeMetrics, ollama, sonarQube };
