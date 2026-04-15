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
import UserList from "./department head/UserList";
import LeadDashboard from "./tasks management/LeadDashboard";
import UserEdit from "./department head/UserEdit";
import Leader_Projects from "./Leader_Projects";
import CompletedProjects from "./department head/CompletedProjects";
import MyTask from "./MyTask";
import MyTaskView from "./MyTaskView";
import UserProject from "./UserProject";
import UserDashboard from "./UserDashboard";
import Leave from "./Leave";
import LeaveHead from "./department head/LeaveHead";


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
          element: <Navbar />,
          children: [
            {
              path: "/head/dashboard",
              element: <HeadDashboard />,
            },
            {
              path: "/head/projects",
              element: <ProjectList />,
            },
            {
              path: "/head/projects/create",
              element: <ProjectCreate />,
            },
            {
              path: "/head/projects/view/:id",
              element: <ProjectView />,
            },
            {
              path: "/head/projects/edit/:id",
              element: <ProjectCreate />,
            },
            {
              path: "/head/users",
              element: <UserList />
            },
            {
              path: "/head/users/edit/:id",
              element: <UserEdit />
            },
            {
              path: "/head/projects/completed",
              element: <CompletedProjects />,

            },
            {
              path:"/head/leaves",
              element:<LeaveHead />
            }
          ],
        },
      ],
    },

    //department head or team leader routes

    {
      element: <TaskRoute />,
      children: [
        {
          element: <Navbar />,
          children: [
            {
              path: "/lead/dashboard",
              element: <LeadDashboard />,
            },
            {
              path: "/lead/projects",
              element: <Leader_Projects />,
            },
            {
              path: "/tasks",
              element: <TaskList />,
            },
            {
              path: "/tasks/:id",
              element: <TaskList />,
            },
            {
              path: "/tasks/create",
              element: <TaskCreate />,
            },
            {
              path: "/tasks/edit/:id",
              element: <TaskCreate />,
            },
          ],
        },
      ],
    },
    {
      element: <Navbar />,
      children: [
        {
          path: "/mytasks",
          element: <MyTask />,
        },
        {
          path: "/mytasks/task/:id",
          element: <MyTaskView />
        },
        {
          path: "/UserProjects",
          element: <UserProject />
        },
        {
          path: "/UserDashboard",
          element: <UserDashboard />
        },
        {
          path:"/leaves",
          element:<Leave/>
        }
      ]
    },

  ]);

  return (
    <div>

      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
