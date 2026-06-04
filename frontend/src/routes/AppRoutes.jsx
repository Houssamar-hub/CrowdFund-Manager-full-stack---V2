import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../UI/components/Sidebar";
import Dashboard from "../UI/pages/Dashboard";
import Projects from "../UI/pages/Projects";
import CreateProject from "../UI/pages/CreateProject";
import ProjectDetails from "../UI/pages/ProjectDetails";
import Investors from "../UI/pages/Investors";
import Login from "../UI/pages/Login";
import Register from "../UI/pages/Register";
import Wallet from "../UI/pages/Wallet";
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");

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
                    <Route
                        path="/wallet"
                        element={
                            <PrivateRoute>
                                <Wallet />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AppLayout>
        </Router>
    );
};

export default AppRoutes;
