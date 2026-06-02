import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import CreateProject from "../pages/CreateProject";
import ProjectDetails from "../pages/ProjectDetails";
import Investors from "../pages/Investors";
import Login from "../pages/Login";
import Register from "../pages/Register";

const PrivateRoute = ({ children }) => {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppLayout = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return children;
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1">{children}</main>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <PrivateRoute>
                                <Projects />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/projects/create"
                        element={
                            <PrivateRoute>
                                <CreateProject />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/projects/:id"
                        element={
                            <PrivateRoute>
                                <ProjectDetails />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/investors"
                        element={
                            <PrivateRoute>
                                <Investors />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AppLayout>
        </Router>
    );
};

export default AppRoutes;
