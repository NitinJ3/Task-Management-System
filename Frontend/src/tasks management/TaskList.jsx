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
    <div className="space-y-8">
      {/* Project Selection & Action Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Project Tasks</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Viewing tasks for the selected project</p>
        </div>

        <div className="flex items-center gap-4">
          {project?.length > 0 && !past && (
            <select
              defaultValue={id ? id : project[0].id}
              onChange={(e) => fetchTasks(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              {project.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => navigate(`/tasks/create/?project_id=${currentProject}`)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            + Add New Task
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
        {task?.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <p className="font-medium">No Tasks Available</p>
          </div>
        ) : (
          task.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md border-t-8 ${t.priority === 'High' ? 'border-t-red-500' :
                  t.priority === 'Medium' ? 'border-t-amber-400' : 'border-t-blue-500'
                }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{t.title}</h3>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                    {t.status}
                  </span>
                </div>

                <p className="text-gray-500 text-xs mb-6 line-clamp-2">{t.description}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Assigned To</span>
                    <span className="text-slate-700 font-black">{t.user?.name || "Not Assigned"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Due Date</span>
                    <span className="text-red-500 font-black">{t.due_date}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleEdit(t.id)}
                  className="text-indigo-600 font-bold text-xs py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-gray-300 font-bold text-xs py-2 rounded-lg hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 pt-10">
        <button
          disabled={current_page === 1}
          onClick={handlePrev}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
        >
          &larr;
        </button>

        {pages != null &&
          Object.values(pages).map((p) => p != 0 && (
            <button
              key={p}
              onClick={() => fetchTasks(currentProject, p)}
              className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${current_page === p ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-gray-100"
                }`}
            >
              {p}
            </button>
          ))}

        <button
          disabled={current_page === last_page}
          onClick={handleNext}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default TaskList;