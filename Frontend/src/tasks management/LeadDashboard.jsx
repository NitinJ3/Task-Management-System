import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const LeadDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();


  useEffect(() => {
    
    if (user?.role_id == 1) {
      navigate("/head/dashboard");
    }
  }, [user]);

  return (
    <div>
      <h1>Team Lead Dashboard</h1>
    </div>
  );
};

export default LeadDashboard;
