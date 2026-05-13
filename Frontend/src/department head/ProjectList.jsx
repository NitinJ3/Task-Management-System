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
        console.log(response.data.projects);

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

  function handleView(id) {
    navigate(`//head/projects/view/${id}`);
  }

  function handleCreate() {
    navigate("/head/projects/create");
  }

  function handlePast() {
    navigate("/head/projects/completed");
  }

  function handleNext() {
    fetchData(current_page + 1);
  }

  function handlePrev() {
    fetchData(current_page - 1);
  }

  return (
    <div>
      <div>
        {data.length === 0 ? (
          <p>No Projects Found</p>
        ) : (
          <>
            <h1>Project List</h1>

            {data.map((project) => (
              <div key={project.id}>
                <h3>Name: {project.name}</h3>

                <p>
                  Start Date:
                  {new Date(
                    project.start_date + "T00:00:00"
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p>
                  End Date:
                  {new Date(
                    project.end_date + "T00:00:00"
                  ).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <button onClick={() => handleView(project.id)}>
                  View
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <br />

      <button disabled={current_page === 1} onClick={handlePrev}>
        Prev
      </button>

      {pages != null &&
        Object.values(pages).map(
          (p) =>
            p != 0 && (
              <button key={p} onClick={() => fetchData(p)}>
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

      <button onClick={handleCreate}>Create Project</button>
      <button onClick={handlePast}>Completed Projects</button>
    </div>
  );
};

export default ProjectList;