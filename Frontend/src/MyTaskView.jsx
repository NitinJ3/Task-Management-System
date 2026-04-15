import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTask, toggleStatus } from "./api/task.api";

const MyTaskView = () => {
  const [task, setTask] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTask(id)
      .then((response) => {
        setTask(response.data.task);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  // handle status update
  function handleStatusChange(status) {
    toggleStatus(id,  status )
      .then((response) => {
        alert(response.data.message);

        // update UI instantly
        setTask((prev) => ({
          ...prev,
          status: status,
        }));
      })
      .catch((error) => {
        console.log(error);
        alert("Error updating status");
      });
  }

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h2>{task.title}</h2>

      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Due Date:</strong> {task.due_date}</p>

      {/* 🔥 Buttons */}
      <button
        onClick={() => handleStatusChange("active")}
        disabled={task.status === "active"}
      >
        Start
      </button>

      <button
        onClick={() => handleStatusChange("completed")}
        disabled={task.status === "completed"}
      >
        Mark Complete
      </button>
    </div>
  );
};

export default MyTaskView;