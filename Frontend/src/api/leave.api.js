import axios from "./axios";

export const applyLeave = (data)=>{
    return axios.post('/employee/leaves/apply',data); 
}
export const showLeaves = (page=1)=>{
    return axios.get(`/department/leaves?page=${page}`);
}
export const showMyLeaves = (page=1)=>{
    return axios.get(`/employee/leaves?page=${page}`);
}
export const approveLeave = (id)=>{
    return axios.patch(`/head/leaves/approve/${id}`);
}
export const rejectLeave = (id)=>{
    return axios.patch(`/head/leaves/reject/${id}`);
}
