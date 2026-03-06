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