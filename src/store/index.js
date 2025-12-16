import { createStore } from "vuex";
import { repositoriesModule } from "@/store/repositoriesModule.js";
import { developersModule } from "@/store/developersModule.js";

export default createStore({
    state: {
        isAuth: false,
        isLoading: false
    },
    getters: {
        isLoading: (state) => state.isLoading
    },
    mutations: {
        setLoading(state, isLoading) {
            state.isLoading = isLoading;
        }
    },
    modules: {
        repositories: repositoriesModule,
        developers: developersModule
    }
});