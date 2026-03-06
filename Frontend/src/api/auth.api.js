import axios from "./axios";

export const registerUser = (data) =>{
    return axios.post("/register",data);
}

export const loginUser = (data) =>{
    return axios.post("/login",data);
}



export const logoutUser = () =>{
    return axios.post("/logout");
}

