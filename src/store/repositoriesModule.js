export const repositoriesModule = {
    state: () => ({
        repositories: [],
        branches: {},
        metrics: {
            teamPerformance: 0,
            teamStability: 0,
            collaboration: 0,
            weeklyStability: [],
            normalization: {
                commits: { min: 0, max: 0 },
                lines: { min: 0, max: 0 }
            }
        }
    }),
    getters: {
        getRepositories: (state) => {
            return state.repositories;
        },
        getBranches: (state) => (repoName) => {
            return state.branches[repoName] || [];
        },
        getMetrics: (state) => {
            return state.metrics;
        },
        getTeamPerformance: (state) => {
            return state.metrics.teamPerformance;
        },
        getTeamStability: (state) => {
            return state.metrics.teamStability;
        },
        getCollaboration: (state) => {
            return state.metrics.collaboration;
        }
    },
    mutations: {
        setRepositories(state, repositories) {
            state.repositories = repositories;
        },
        setBranches(state, { repoName, branches }) {
            state.branches = {
                ...state.branches,
                [repoName]: branches
            };
        },
        setMetrics(state, metrics) {
            state.metrics = metrics;
        },
        updateTeamPerformance(state, performance) {
            state.metrics.teamPerformance = performance;
        },
        updateTeamStability(state, stability) {
            state.metrics.teamStability = stability;
        },
        updateCollaboration(state, collaboration) {
            state.metrics.collaboration = collaboration;
        }
    },
    actions: {
        async fetchBranches({ commit }, repoName) {
            try {
                // Заглушка для веток
                const mockBranches = [
                    { name: 'main', value: 'main' },
                    { name: 'develop', value: 'develop' },
                    { name: 'feature', value: 'feature' }
                ];
                commit('setBranches', { repoName, branches: mockBranches });
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        }
    },
    namespaced: true
}