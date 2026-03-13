import axios from "./axios";

export const createTask = (data) =>{
    return axios.post("/tasks/create",data);
}

export const showTasks = (project_id) => {
    return axios.get(`/project/tasks/${project_id}`);
}

export const deleteTask = (id) =>{
    return axios.delete(`/tasks/delete/${id}`);
}

export const updateTask = (data) => {
    return axios.patch(`/tasks/edit`,data);
}

export const getTask = (id) => {
    return axios.get(`/tasks/${id}`);
} 

