import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getTeamLeaderProjects } from "../api/project.api";
import { getPersonalTaskStatistics } from "../api/task.api";

const LeadDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projectCount,setProjectCount] = useState(0)
  const [taskstats,setTaskStats] = useState({
    total:0,
    unfinished : 0,
    completed : 0
  })

  useEffect(() => {
    
    if (user?.role_id == 1) {
      navigate("/head/dashboard");
    }

    getTeamLeaderProjects()
    .then((response)=>{
      setProjectCount(response.data.count)
    })
    .catch((error)=>{
      console.log(error);
    })

     getPersonalTaskStatistics()
    .then((response)=>{
      setTaskStats({
        total:response.data.total,
        unfinished:response.data.noncompleted,
        completed:response.data.completed
      })
    })
    .catch((error)=>{
      console.log(error);
    })

  }, [user]);

  return (
    <div>
      <h1>Team Lead Dashboard</h1>
      <div>
      <h3>Active Projects Your Leading</h3>
      <p>{projectCount}</p>
      </div>

        <div>
      <h3>Personal Tasks Completed</h3>
      <p>{taskstats.completed}/{taskstats.total}</p>
      </div>
      

    </div>
  );
};

export default LeadDashboard;
