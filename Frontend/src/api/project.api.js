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

export const deleteProject = (id) => {
    return axios.delete(`/head/projects/delete/${id}`);
}

export const getTeamLeaderProjects = () => {
    return axios.get('/leader/projects');
}

export const getAsscociatedEmployees = (project_id) => {
    return axios.get(`/project/employees/${project_id}`);
}

export const getProjectsByEmployee = (employee_id) => {
    return axios.get(`/employee/projects/${employee_id}`);
}