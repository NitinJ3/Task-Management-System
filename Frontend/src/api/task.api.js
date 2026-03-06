import axios from "./axios";

export const createTask = (data) =>{
    return axios.post("/tasks/create",data);
}

export const showTask = (data) => {
    return axios.get("/tasks");
}

