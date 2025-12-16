export const projectsModule = {
    state: () => ({
        projects: []
    }),
    getters: {
        getProjects: (state) => {
            return state.projects;
        },
    },
    mutations: {
        setProjects(state, projects) {
            state.projects = projects;
        },
    },
    namespaced: true
}