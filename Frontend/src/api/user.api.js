import axios from "./axios";


export const getUser = () =>{
    return axios.get("/getUser");
}

export const getDepartmentTeamLeads = () => {
   return axios.get('/head/users/teamleads');
}

export const getDepartmentEmployees = (
  page = 1,
  search = ""
) => {
  return axios.get(
    `/users/employees?page=${page}&search=${search}`
  );
};

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

export const updateOwnDetails = (data) => {
    return axios.patch('/update/user',data);
}

export const forgotPassword = (email) => {
    return axios.post('/forgot-password', { email });
}

export const resetPassword = (data) => {
    return axios.post('/reset-password', data);
}