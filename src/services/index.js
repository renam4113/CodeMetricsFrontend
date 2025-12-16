// const getQuery = (arrObjKeyVal) => {
//     const obj = {};
//     console.log(arrObjKeyVal)
//     for(const key in arrObjKeyVal){
//         if(arrObjKeyVal[key])
//             obj[key] = arrObjKeyVal[key]
//     }
//     return new URLSearchParams(obj).toString();
// }
// function formatDate(date) {
//     const d = new Date(date);
//     const year = d.getUTCFullYear();
//     const month = String(d.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(d.getUTCDate()).padStart(2, '0');
//     const hours = String(d.getUTCHours()).padStart(2, '0');
//     const minutes = String(d.getUTCMinutes()).padStart(2, '0');
//     const seconds = String(d.getUTCSeconds()).padStart(2, '0');
    
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}+00`;
// }
class Api{
    static api = window.location.protocol 
        + '//' 
        + '45.144.52.95:7254/'
    static getProjects(){
        const url = Api.api + 'projects'
        return fetch(url, { method: "GET"});
    }
    static getProject(projectsKey){
        const url = Api.api + 'project' + `/${projectsKey}`
        return fetch(url, { method: "GET"});
    }

    static getReposByProject(projectsKey){
        const url = Api.api + 'repository' +'/project' + `/${projectsKey}`
        return fetch(url, { method: "GET"});
    }
    static getRepo(repoName){
        const url = Api.api + 'repository' +'/name' + `/${repoName}`
        return fetch(url, { method: "GET"});
    }


    /**
     * @param obj.timeFrom
     * @param obj.timeTo
     * 
     * @param obj.projectId
     * @param obj.repoName
     */
    static getCommits(obj){
        console.log(obj);
        const query = {
            instanceType: obj.instanceType || null,
            startDate: obj.timeFrom || null,
            endDate: obj.timeTo || null,
            name: obj.name || null
        };
        const params = new URLSearchParams();

        // const callback = (param) => {
        //     const val = query[param];
        //     if(val) params.append(param, val);
        // }
        // for(const it in query){
        //     callback(it);
        // }
        if (query.name) params.append('name', query.name);
        if(query.instanceType) params.append('instance', query.instanceType);
        if (query.startDate) params.append('startDate', query.startDate.toISOString().replace(/\.\d{3}Z$/, 'Z'));
        if (query.endDate) params.append('endDate', query.endDate.toISOString().replace(/\.\d{3}Z$/, 'Z'));
        console.log(query.endDate.toISOString().replace(/\.\d{3}Z$/, 'Z'));
        
        // const queryStr = getQuery(query);
        
        const url = Api.api + 'api/CodeMetrics/GetByPeriod' + (params.toString() ? '?' + params.toString() : '');
        console.log(url);
        return fetch(url, {})
    }
    /**
     * @param userEmail
     */
    static getUser(userEmail){

        const path = `user/${userEmail}`;
        console.log(path);
    }
    /**
     * @param commitHash
     */
    getInfoCommit(){
        const path = 'api/CodeMetrics/GetByPeriod';
        console.log(path);
        return fetch()
    }
}

export {
    Api
}