import React, { useEffect, useState } from 'react';
import { getProjectsByEmployee } from './api/project.api';

const UserProject = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjectsByEmployee()
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>My Projects</h1>

      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id}>
            <h3>Name: {project.name}</h3>
            <p>Status: {project.status}</p>

            <p>
              Start Date:{" "}
              {new Date(project.start_date + "T00:00:00").toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <p>
              End Date:{" "}
              {new Date(project.end_date + "T00:00:00").toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          </div>
        ))
      ) : (
        <p>No Projects Available</p>
      )}
    </div>
  );
};

export default UserProject;