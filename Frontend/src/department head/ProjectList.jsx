import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showProjects } from "../api/project.api";

const ProjectList = () => {
  const [data, setData] = useState([]);
  const [current_page, setCurrentPage] = useState();
  const [last_page, setLastPage] = useState();
  const [pages, setPages] = useState();

  const navigate = useNavigate();

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

  function fetchData(page = 1) {
    showProjects(page)
      .then((response) => {
        setData(response.data.projects.data);
        setCurrentPage(response.data.projects.current_page);
        setLastPage(response.data.projects.last_page);
        let cp = response.data.projects.current_page;
        let lp = response.data.projects.last_page;
        setPages(generatePages(cp, lp));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (id) => navigate(`/head/projects/view/${id}`);
  const handleCreate = () => navigate("/head/projects/create");
  const handlePast = () => navigate("/head/projects/completed");
  const handleNext = () => fetchData(current_page + 1);
  const handlePrev = () => fetchData(current_page - 1);

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center"
        >
          <span className="mr-2 text-lg">+</span> Create Project
        </button>
        <button
          onClick={handlePast}
          className="bg-white text-slate-600 border border-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          Completed Projects
        </button>
      </div>

      <h1 className="text-2xl font-black text-slate-800 tracking-tight">Project List</h1>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
            <p className="font-medium">No Projects Found</p>
          </div>
        ) : (
          data.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-6">{project.name}</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Start Date</span>
                    <span className="text-slate-600 font-semibold">
                      {new Date(project.start_date + "T00:00:00").toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">End Date</span>
                    <span className="text-slate-600 font-semibold">
                      {new Date(project.end_date + "T00:00:00").toLocaleDateString("en-GB", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleView(project.id)}
                className="w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            disabled={current_page === 1}
            onClick={handlePrev}
            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            &larr;
          </button>

          {pages != null &&
            Object.values(pages).map(
              (p) =>
                p != 0 && (
                  <button
                    key={p}
                    onClick={() => fetchData(p)}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                      current_page === p
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                        : "text-slate-500 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
            )}

          <button
            disabled={current_page === last_page}
            onClick={handleNext}
            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectList;