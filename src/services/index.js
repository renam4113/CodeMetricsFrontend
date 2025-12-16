class Api {
    static api = 'http://45.144.52.95:7254/';

    // Получение всех репозиториев
    static getRepositories() {
        const url = Api.api + 'repositories';
        return fetch(url, { method: "GET" });
    }

    // Получение коммитов по репозиторию
    static getCommitsByRepository(repoName, startDate, endDate) {
        const params = new URLSearchParams();
        params.append('instance', 'Repository');
        params.append('name', repoName);
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());

        const url = Api.api + 'api/CodeMetrics/GetByPeriod' + '?' + params.toString();
        return fetch(url, { method: "GET" });
    }

    // Получение статистики автора
    static getAuthorSummary(email, startDate, endDate) {
        const params = new URLSearchParams();
        params.append('email', email);
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());

        const url = Api.api + 'api/CodeMetrics/author/summary' + '?' + params.toString();
        return fetch(url, { method: "GET" });
    }

    // Получение производительности автора
    static getAuthorPerformance(email, startDate, endDate) {
        const params = new URLSearchParams();
        params.append('email', email);
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());

        const url = Api.api + 'api/CodeMetrics/author/performance' + '?' + params.toString();
        return fetch(url, { method: "GET" });
    }

    // Получение метрик проекта
    static getProjectMetrics(startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());

        const url = Api.api + 'api/CodeMetrics/ProjectMetric' + '?' + params.toString();
        return fetch(url, { method: "GET" });
    }

    // Обновление базы данных
    static updateDatabase(repoName = null, branch = null, limit = 100) {
        const params = new URLSearchParams();
        if (repoName) params.append('repoName', repoName);
        if (branch) params.append('branch', branch);
        params.append('limit', limit);

        const url = Api.api + 'api/CodeMetrics/UpdateDataBase' + '?' + params.toString();
        return fetch(url, { method: "POST" });
    }

    // Получение стабильности по дням недели
    static getWeeklyStability(repoName, weeks = 8) {
        const url = Api.api + `api/CodeMetrics/stability/weekly/${repoName}?weeks=${weeks}`;
        return fetch(url, { method: "GET" });
    }

    // Получение нормализации данных
    static getNormalizationMetrics(repoName, period = 'month') {
        const url = Api.api + `api/CodeMetrics/normalization/${repoName}?period=${period}`;
        return fetch(url, { method: "GET" });
    }

    // Получение метрик команды
    static getTeamMetrics(repoName, startDate, endDate) {
        const params = new URLSearchParams();
        params.append('repoName', repoName);
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());

        const url = Api.api + 'api/CodeMetrics/team-metrics' + '?' + params.toString();
        return fetch(url, { method: "GET" });
    }
}

export { Api };