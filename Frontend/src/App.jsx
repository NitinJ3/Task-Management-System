import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./Welcome";
import Signup from "./Signup";
import Login from "./Login";
import HeadDashboard from "./department head/HeadDashboard";
import HeadRoute from "./department head/HeadRoute";
import Navbar from "./department head/Navbar";
import ProjectCreate from "./department head/ProjectCreate";
import ProjectList from "./department head/ProjectList";
import ProjectView from "./department head/ProjectView";
import TaskRoute from "./tasks management/TaskRoute";
import TaskList from "./tasks management/TaskList";
import TaskCreate from "./tasks management/TaskCreate";

import LeadDashboard from "./tasks management/LeadDashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },

    {
      path: "/login",
      element: <Login />,
    },

    // Department Head Routes
    {
      element: <HeadRoute />,
      children: [
        {
          path: "/head/dashboard",
          element: (
            <>
            
                <Navbar />
                <HeadDashboard />
            
            </>
          ),
        },
        {
          path: "/head/projects",
          element: (
            <>
              <Navbar />
              <ProjectList />
            </>
          ),
        },
        {
          path: "/head/projects/create",
          element: (
            <>
              <Navbar />
              <ProjectCreate />
            </>
          ),
        },
        {
          path: "/head/projects/view/:id",
          element: (
            <>
              <Navbar />
              <ProjectView />
            </>
          ),
        },
        {
          path: "/head/projects/edit/:id",
          element: (
            <>
              <Navbar />
              <ProjectCreate />
            </>
          ),
        },
      ],
    },

    //department head and team leader routes

    {
      element: <TaskRoute />,
      children: [
        {
          path: "/lead/dashboard",
          element: (
            <>
              <Navbar />
              <LeadDashboard />
            </>
          ),
        },
        {
          path: "/tasks",
          element: (
            <>
              <Navbar />
              <TaskList />
            </>
          ),
        },
        {
          path: "/tasks/:id",
          element: (
            <>
              <Navbar />
              <TaskList />
            </>
          ),
        },
        {
          path: "/tasks/create",
          element: (
            <>
              <Navbar />
              <TaskCreate />
            </>
          ),
        },
        {
          path: "/tasks/edit/:id",
          element: (
            <>
              <Navbar />
              <TaskCreate />
            </>
          ),
        }
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
