import React, { useEffect, useState } from "react";
import { applyLeave, showMyLeaves } from "./api/leave.api";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    reason: "",
    start_date: "",
    end_date: "",
  });

  // ✅ Fetch leaves
  function fetchLeaves() {
    showMyLeaves()
      .then((res) => {
        setLeaves(res.data.leaves);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ Handle input change
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // ✅ Submit leave
  function handleSubmit(e) {
    e.preventDefault();

    applyLeave(form)
      .then((res) => {
        alert(res.data.message);

        // reset form
        setForm({
          reason: "",
          start_date: "",
          end_date: "",
        });

        // refresh list
        fetchLeaves();
      })
      .catch((err) => {
        console.log(err);
        alert(err.response?.data?.message || "Error applying leave");
      });
  }

  return (
    <div>
      <h1>Leave Management</h1>

      {/* 🔥 Apply Leave Form */}
      <h2>Apply Leave</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Reason:</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Apply Leave</button>
      </form>

      {/* 🔥 My Leaves */}
      <h2>My Leave Requests</h2>

      {leaves.length === 0 ? (
        <p>No leave requests</p>
      ) : (
        leaves.map((leave) => (
          <div key={leave.id}>
            <p><strong>Reason:</strong> {leave.reason}</p>

            <p>
              <strong>Start:</strong>{" "}
              {new Date(leave.start_date + "T00:00:00").toLocaleDateString("en-GB")}
            </p>

            <p>
              <strong>End:</strong>{" "}
              {new Date(leave.end_date + "T00:00:00").toLocaleDateString("en-GB")}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    leave.status === "approved"
                      ? "green"
                      : leave.status === "rejected"
                      ? "red"
                      : "orange",
                }}
              >
                {leave.status}
              </span>
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Leave;