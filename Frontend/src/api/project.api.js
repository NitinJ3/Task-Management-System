import axios from "./axios";

export const showProjects = (data) =>{
    return axios.get('/head/projects');
}

export const createProjects = (data) =>{
    return axios.post('head/projects/create',data);
}

export const getProject = (id) => {
    return axios.get(`/head/projects/view/${id}`);
}

export const updateProject = (data) => {
    return axios.patch("/head/projects/edit",data);
}

