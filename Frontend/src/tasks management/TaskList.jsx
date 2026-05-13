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
import { useSearchParams } from "react-router-dom";

const TaskList = () => {
  const [project, setProject] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [task, setTask] = useState([]);

  const [current_page, setCurrentPage] = useState();
  const [last_page, setLastPage] = useState();
  const [pages, setPages] = useState();

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const past = searchParams.get("completed") == "true";

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

  function fetchTasks(project_id, page = 1) {
    showTasks(project_id, page)
      .then((response) => {
        setCurrentProject(project_id);

        console.log(response.data.tasks);

        setTask(response.data.tasks.data);

        setCurrentPage(response.data.tasks.current_page);

        setLastPage(response.data.tasks.last_page);

        let cp = response.data.tasks.current_page;
        let lp = response.data.tasks.last_page;

        setPages(generatePages(cp, lp));
      })
      .catch((error) => {
        if (error.response.status == "404") {
          console.log(error.response.data.message);
          setTask([]);
          setCurrentProject(null);
        } else {
          console.log(error);
        }
      });
  }

  useEffect(() => {
    
    if (user?.role_id === 1) {

  async function fetchAllProjects() {
    try {

      let allProjects = [];
      let page = 1;
      let lastPage = 1;

      do {
        const response = await showProjects(page);

        allProjects = [
          ...allProjects,
          ...response.data.projects.data
        ];

        lastPage = response.data.projects.last_page;

        page++;

      } while (page <= lastPage);

      setProject(allProjects);

      if (id) {
        fetchTasks(id);
      } else if (allProjects.length > 0) {
        fetchTasks(allProjects[0].id);
      }

    } catch (error) {

      if (error.response) {
        if (error.response.status == "404") {
          console.log(error.response.data.message);
        }
      } else {
        console.log(error);
      }

    }
  }

  fetchAllProjects();
}

     else if (user?.role_id === 2) {
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

  function handleNext() {
    fetchTasks(currentProject, current_page + 1);
  }

  function handlePrev() {
    fetchTasks(currentProject, current_page - 1);
  }

  return (
    <div>
      {project?.length === 0 ? (
        <p>No Projects Available</p>
      ) : (
        <>
          {past ? (
            <></>
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
        </>
      )}

      <h2>Tasks</h2>

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
              <p>Assigned To: {t.user?.name || "Not Assigned"}</p>

              <button onClick={() => handleEdit(t.id)}>Edit</button>

              <button onClick={() => handleDelete(t.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>

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
                onClick={() => fetchTasks(currentProject, p)}
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

      <button
        onClick={() =>
          navigate(`/tasks/create/?project_id=${currentProject}`)
        }
      >
        Add New Task
      </button>
    </div>
  );
};

export default TaskList;