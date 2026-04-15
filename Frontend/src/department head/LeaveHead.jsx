import React, { useEffect, useState } from "react";
import { showDepartmentLeaves } from "../api/leave.api";
import { approveLeave, rejectLeave } from "../api/leave.api";

const LeaveHead = () => {
    const [leaves, setLeaves] = useState([]);

    // ✅ Fetch department leaves
    function fetchLeaves() {
        showDepartmentLeaves()
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

    // ✅ Approve
    function handleApprove(id) {
        approveLeave(id)
            .then((res) => {
                alert(res.data.message);

                // update UI without refetch
                setLeaves((prev) =>
                    prev.map((l) =>
                        l.id === id ? { ...l, status: "approved" } : l
                    )
                );
            })
            .catch((err) => {
                console.log(err);
                alert("Error approving leave");
            });
    }

    // ✅ Reject
    function handleReject(id) {
        rejectLeave(id)
            .then((res) => {
                alert(res.data.message);

                setLeaves((prev) =>
                    prev.map((l) =>
                        l.id === id ? { ...l, status: "rejected" } : l
                    )
                );
            })
            .catch((err) => {
                console.log(err);
                alert("Error rejecting leave");
            });
    }

    return (
        <div>
            <h1>Department Leave Requests</h1>

            {leaves.length === 0 ? (
                <p>No leave requests</p>
            ) : (
                leaves.map((leave) => (
                    <div key={leave.id}>
                        <h3>User: {leave.user?.name}</h3>

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

                        {/* 🔥 Action Buttons */}
                        {leave.status === "pending" && (
                            <>
                                <button onClick={() => handleApprove(leave.id)}>
                                    Approve
                                </button>

                                <button onClick={() => handleReject(leave.id)}>
                                    Reject
                                </button>
                            </>
                        )}

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
};

export default LeaveHead;