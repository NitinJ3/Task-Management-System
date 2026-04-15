import axios from "./axios";


export const getUser = () =>{
    return axios.get("/getUser");
}

export const getDepartmentTeamLeads = () => {
   return axios.get('/head/users/teamleads');
}

export const getDepartmentEmployees = () => {
    return axios.get('/users/employees');
}

export const getUserById = (id) =>{
    return axios.get(`/user/employee/${id}`);
}
export const updateUser = (data) =>{
    return axios.patch('/user/employee/update',data)
}

export const createCode = () => {
    return axios.get('/users/add');
}
export const deleteUser = (id) => {
    return axios.delete(`/user/employee/delete/${id}`);
}