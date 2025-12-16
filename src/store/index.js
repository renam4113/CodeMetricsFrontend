import {createStore} from "vuex";
import { projectsModule } from "@/store/projectsModule.js";
export default createStore({
    state: {
        isAuth: false,
    },
    modules: {
        projects: projectsModule,
    }
})