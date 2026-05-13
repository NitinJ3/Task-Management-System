import axios from "./axios";

export const createTask = (data) => {
    return axios.post("/tasks/create", data);
}

export const showTasks = (project_id) => {
    return axios.get(`/project/tasks/${project_id}`);
}

export const deleteTask = (id) => {
    return axios.delete(`/tasks/delete/${id}`);
}

export const updateTask = (data) => {
    return axios.patch(`/tasks/edit`, data);
}

export const getTask = (id) => {
    return axios.get(`/tasks/${id}`);
}

export const toDoTasks = (id) => {
    return axios.get(`/mytasks/${id}`);
}
export const toggleStatus = (id, status) => {
    return axios.put(`/tasks/status/${id}`, { status });
};

export const getCompletedTasks = (id) => {
    return axios.get(`/completed/tasks/${id}`);
}

export const getTaskStatistics = () => {
    return axios.get('/tasks/statistics');
}

export const getPersonalTaskStatistics = () => {
    return axios.get('/employee/task/statistics');
}