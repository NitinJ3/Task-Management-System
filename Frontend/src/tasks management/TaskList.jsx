import React from "react";
import { useEffect, useState } from "react";
import { showTasks } from "../api/task.api";
import { showProjects } from "../api/project.api";
import { deleteTask } from "../api/task.api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getProjectsByEmployee } from "../api/project.api";
import { getTeamLeaderProjects } from "../api/project.api";

const TaskList = () => {
  const [project, setProject] = useState([]);
  const [task, setTask] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  function fetchTasks(project_id) {
    showTasks(project_id)
      .then((response) => {
        console.log(response.data.tasks);
        setTask(response.data.tasks);
      })
      .catch((error) => {
        if (error.response.status == "404") {
          console.log(error.response.data.message);
          setTask([]);
        } else {
          console.log(error);
        }
      });
  }


  useEffect(() => {
    if (user?.role_id === 1) {
      showProjects()
        .then((response) => {
          setProject(response.data.projects);
          if (id) {
            fetchTasks(id);
          } else {
            fetchTasks(response.data.projects[0].id);
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == "404") {
              console.log(error.response.data.message);
            }
          } else {
            console.log(error);
          }
        });
    } else if (user?.role_id === 2) {
      getTeamLeaderProjects()
        .then((response) => {
          setProject(response.data.projects);
          if (id) {
            fetchTasks(id);
          } else {
            fetchTasks(response.data.projects[0].id);
          }
        })
        .catch((error) => {
          if (error.response.status == "404") {
            console.log(error.response.data.message);
          } else {
            console.log(error);
          }
        });
    }
  }, []);

  function handleEdit(task_id) {
    navigate(`/tasks/edit/${task_id}`);
  }
  function handleDelete(task_id) {
    deleteTask(task_id)
      .then((response) => {
        console.log(response.data.message);
        alert(response.data.message);
        setTask(task.filter((t) => t.id !== task_id));
      })
      .catch((error) => {
        console.log(error);
        alert("Error deleting task: " + error.response.data.message);
      });
  }
  return (
    <div>
      {project?.length === 0 ? (
        <p>No Projects Available</p>
      ) : (
        <select
          defaultValue={id ? id : project[0].id}
          onChange={(e) => {
            fetchTasks(e.target.value);
          }}
        >
          {project.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      <div>
        {task?.length === 0 ? (
          <p>No Tasks Available</p>
        ) : (
          task.map((t) => (
            <div key={t.id}>
              <h3> Title: {t.title}</h3>
              <p> Description: {t.description}</p>
              <p> Status: {t.status}</p>
              <p> Priority: {t.priority}</p>
              <p> Due Date: {t.due_date}</p>
              <p> Assigned To: {t.user.name}</p>
              <button onClick={() => handleEdit(t.id)}>Edit</button>
              <button onClick={() => handleDelete(t.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
      <button onClick={() => navigate("/tasks/create")}>Add New Task</button>
    </div>
  );
};

export default TaskList;
