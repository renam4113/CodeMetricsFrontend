import { request, toQuery } from './http';

/** @typedef {import('@/models/ollama.models.js').OllamaTextRequestDto} OllamaTextRequestDto */
/** @typedef {import('@/models/ollama.models.js').OllamaTextResponseDto} OllamaTextResponseDto */
/** @typedef {import('@/models/ollama.models.js').PerformanceAnalysisResponseDto} PerformanceAnalysisResponseDto */

/**
 * @param {Object} params
 * @param {string} params.email
 * @param {Date} params.startDate
 * @param {Date} params.endDate
 * @param {string} [params.sonarProjectKey]
 * @param {string} [params.sonarBranch]
 * @param {string} [params.context]
 * @returns {Promise<PerformanceAnalysisResponseDto>}
 */
export function analyzePerformance({ email, startDate, endDate, sonarProjectKey, sonarBranch, context }) {
    return request(`api/Olama/analyze-performance${toQuery({
        email,
        startDate,
        endDate,
        sonarProjectKey,
        sonarBranch,
        context
    })}`);
}

/**
 * @param {OllamaTextRequestDto} payload
 * @returns {Promise<OllamaTextResponseDto>}
 */
export function ask(payload) {
    return request('api/Olama/ask', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}
