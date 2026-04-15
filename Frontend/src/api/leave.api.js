import axios from "./axios";

//  Apply Leave
export const applyLeave = (data) => {
    return axios.post('/leave/apply', data);
};

//  Get My Leaves
export const showMyLeaves = () => {
    return axios.get('/leave/my');
};

//  Get Department Leaves (for head)
export const showDepartmentLeaves = () => {
    return axios.get('/leave/department');
};

//  Approve Leave
export const approveLeave = (id) => {
    return axios.put(`/leave/approve/${id}`);
};

//  Reject Leave
export const rejectLeave = (id) => {
    return axios.put(`/leave/reject/${id}`);
};