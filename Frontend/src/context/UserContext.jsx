import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../api/user.api";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  useEffect(() => { 

    if(localStorage.getItem('token')){
      getUser()
      .then((response)=>{
        setUser(response.data.user);
      })
      .catch((error)=>{
        console.log(error);
        setUser(null);
      })
    }

  },[])

  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); 

//wraping useContext hook in a function because hooks can only be run inside a jsx component
//to avoid calling it right now 
