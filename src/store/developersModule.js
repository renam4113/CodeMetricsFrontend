export const developersModule = {
    state: () => ({
        developers: [],
        developerMetrics: {},
        teamCollaboration: {
            sharedCommits: 0,
            codeReviews: 0,
            pairProgramming: 0
        }
    }),
    getters: {
        getDevelopers: (state) => state.developers,
        getDeveloperMetrics: (state) => (email) => state.developerMetrics[email],
        getTeamCollaboration: (state) => state.teamCollaboration
    },
    mutations: {
        setDevelopers(state, developers) {
            state.developers = developers;
        },
        setDeveloperMetrics(state, { email, metrics }) {
            state.developerMetrics = {
                ...state.developerMetrics,
                [email]: metrics
            };
        },
        setTeamCollaboration(state, collaboration) {
            state.teamCollaboration = collaboration;
        }
    },
    actions: {
        async fetchDeveloperMetrics(_, { email, startDate, endDate }) {
            try {
                // Здесь в будущем можно будет вызывать API
                console.log(`Fetching metrics for ${email} from ${startDate} to ${endDate}`);
            } catch (error) {
                console.error('Error fetching developer metrics:', error);
            }
        }
    },
    namespaced: true
}