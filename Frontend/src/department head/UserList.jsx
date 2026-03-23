import React from "react";
import { useEffect, useState } from "react";
import { getDepartmentEmployees } from "../api/user.api";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();  


  useEffect(() => {
    getDepartmentEmployees()
      .then((response) => {
        setUsers(response.data.employees);
        console.log(response.data.employees);
      })
      .catch((error) => {
        if (error.response.data.status == "404") {
          alert(error.response.data.message);
        } else {
          alert(error);
        }
      });
  }, []);

  return (
    <div>
      <h2>Department Employees</h2>
      <div>
        <table border={1}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Active</th>
              <th>Role</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.is_active == 1 ? "Active" : "Non Active"}</td>
                <td>{user.role.name}</td>
                <td>
                <button onClick={()=>navigate(`/head/users/edit/${user.id}`)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
