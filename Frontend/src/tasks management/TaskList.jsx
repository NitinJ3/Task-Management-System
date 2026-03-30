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
  <div className="min-h-screen bg-gray-100 p-6">
    
    <div className="max-w-6xl mx-auto">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        {project?.length === 0 ? (
          <p className="text-gray-600">No Projects Available</p>
        ) : (
          <select
            defaultValue={id ? id : project[0].id}
            onChange={(e) => {
              fetchTasks(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {project.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={() => navigate("/tasks/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add New Task
        </button>
      </div>

      {/* Tasks */}
      <div>
        {task?.length === 0 ? (
          <p className="text-gray-600">No Tasks Available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {task.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t.title}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {t.description}
                </p>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p><span className="font-medium">Status:</span> {t.status}</p>
                  <p><span className="font-medium">Priority:</span> {t.priority}</p>
                  <p><span className="font-medium">Due:</span> {t.due_date}</p>
                  <p><span className="font-medium">Assigned:</span> {t.user.name}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(t.id)}
                    className="flex-1 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="flex-1 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  </div>
);
};

export default TaskList;
