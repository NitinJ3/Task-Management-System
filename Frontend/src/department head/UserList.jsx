import React from "react";
import { useEffect, useState } from "react";
import { getDepartmentEmployees } from "../api/user.api";
import { useNavigate } from "react-router-dom";
import { createCode } from "../api/user.api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");

  const [current_page, setCurrentPage] = useState();
  const [last_page, setLastPage] = useState();
  const [pages, setPages] = useState();

  function generatePages(cp, lp) {
    let new_obj = { p1: 0, p2: 0, p3: 0 };

    if (lp >= 3) {
      if (cp == 1) {
        new_obj.p1 = cp;
        new_obj.p2 = cp + 1;
        new_obj.p3 = cp + 2;
      } else if (cp > 1 && cp < lp) {
        new_obj.p1 = cp - 1;
        new_obj.p2 = cp;
        new_obj.p3 = cp + 1;
      } else if (cp == lp) {
        new_obj.p1 = cp - 2;
        new_obj.p2 = cp - 1;
        new_obj.p3 = cp;
      }
    } else {
      for (let i = 1; i <= lp; i++) {
        new_obj[`p${i}`] = i;
      }
    }

    return new_obj;
  }

  function fetchUsers(page = 1, searchValue = search) {
    getDepartmentEmployees(page, searchValue)
      .then((response) => {

        setUsers(response.data.employees.data);

        setCurrentPage(response.data.employees.current_page);

        setLastPage(response.data.employees.last_page);

        let cp = response.data.employees.current_page;
        let lp = response.data.employees.last_page;

        setPages(generatePages(cp, lp));

        console.log(response.data.employees);

      })
      .catch((error) => {
        if (error.response?.status == "404") {
          setUsers([]);
        } else {
          alert(error);
        }
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function createUser() {
    createCode()
      .then((response) => {
        const code = response.data.code;
        setCode(code);
        console.log(code);
      })
      .catch((error) => {
        alert(error);
      });
  }

  function handleNext() {
    fetchUsers(current_page + 1);
  }

  function handlePrev() {
    fetchUsers(current_page - 1);
  }

  return (
    <div>
      <h2>Department Employees</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          fetchUsers(1, e.target.value);
        }}
      />

      <br />
      <br />

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

                <td>
                  {user.is_active == 1
                    ? "Active"
                    : "Non Active"}
                </td>

                <td>{user.role.name}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/head/users/edit/${user.id}`)
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <button
        disabled={current_page === 1}
        onClick={handlePrev}
      >
        Prev
      </button>

      {pages != null &&
        Object.values(pages).map(
          (p) =>
            p != 0 && (
              <button
                key={p}
                onClick={() => fetchUsers(p)}
              >
                {p}
              </button>
            )
        )}

      <button
        disabled={current_page === last_page}
        onClick={handleNext}
      >
        Next
      </button>

      <br />
      <br />

      <button onClick={createUser}>Create User</button>

      {code && (
        <>
          <p>Registration Code: {code}</p>

          <p>
            Give this code to your employees for
            registration.
          </p>
        </>
      )}
    </div>
  );
};

export default UserList;