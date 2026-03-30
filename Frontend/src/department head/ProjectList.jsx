import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showProjects } from "../api/project.api";

const ProjectList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    showProjects()
      .then((response) => {
        console.log(response.data);
        setData(response.data.projects);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  function handleView(id){
    navigate(`//head/projects/view/${id}`);
  }

  function handleCreate(){
    navigate("/head/projects/create")
  }




return (
  <div className=" bg-gray-100 p-6">

    <div className="max-w-5xl mx-auto">
      
      {data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No Projects Found
        </p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Project List
            </h1>

            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Project
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {data.map((project) => (
              <div
                key={project.id}
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {project.name}
                </h3>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(project.start_date + "T00:00:00").toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">End:</span>{" "}
                  {new Date(project.end_date + "T00:00:00").toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

                <button
                  onClick={() => handleView(project.id)}
                  className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                >
                  View
                </button>
              </div>
            ))}

          </div>
        </>
      )}

    </div>
  </div>
);
}

export default ProjectList;
