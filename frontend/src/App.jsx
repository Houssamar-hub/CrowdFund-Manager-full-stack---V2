import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./UI/components/Sidebar";
import Dashboard from "./UI/pages/Dashboard";
import Projects from "./UI/pages/Projects";
import CreateProject from "./UI/pages/CreateProject";
import ProjectDetails from "./UI/pages/ProjectDetails";
import Investors from "./UI/pages/Investors";
import Portfolio from "./UI/pages/Portfolio";
import Wallet from "./UI/pages/Wallet";
import Login from "./UI/pages/Login";
import Register from "./UI/pages/Register";

function PrivateRoute({ children }) {
    const { token } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function PublicRoute({ children }) {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            {/* Public Routes - Authentication */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Private Routes - Dashboard avec Sidebar */}
            <Route
                path="/*"
                element={
                    <PrivateRoute>
                        <div style={{ display: "flex", minHeight: "100vh" }}>
                            <Sidebar />
                            <div
                                style={{
                                    flex: 1,
                                    padding: "20px",
                                    backgroundColor: "#f9fafb",
                                }}
                            >
                                <Routes>
                                    {/* Dashboard Home */}
                                    <Route path="/" element={<Dashboard />} />

                                    {/* Projects Management */}
                                    <Route
                                        path="/projects"
                                        element={<Projects />}
                                    />
                                    <Route
                                        path="/projects/create"
                                        element={<CreateProject />}
                                    />
                                    <Route
                                        path="/projects/:id"
                                        element={<ProjectDetails />}
                                    />
                                    <Route
                                        path="/projects/:id/investors"
                                        element={<Investors />}
                                    />

                                    {/* Investors Management */}
                                    <Route
                                        path="/investors"
                                        element={<Investors />}
                                    />
                                    <Route
                                        path="/investors/:id"
                                        element={<Investors />}
                                    />

                                    {/* Create Project (alternative route) */}
                                    <Route
                                        path="/create-project"
                                        element={<CreateProject />}
                                    />

                                    {/* Portfolio & Wallet - Pour les investisseurs */}
                                    <Route
                                        path="/portfolio"
                                        element={<Portfolio />}
                                    />
                                    <Route
                                        path="/wallet"
                                        element={<Wallet />}
                                    />

                                    {/* 404 Page */}
                                    <Route
                                        path="*"
                                        element={
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    padding: "50px",
                                                }}
                                            >
                                                <h1
                                                    style={{
                                                        fontSize: "48px",
                                                        color: "#374151",
                                                    }}
                                                >
                                                    404
                                                </h1>
                                                <p
                                                    style={{
                                                        color: "#6b7280",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    Page not found
                                                </p>
                                            </div>
                                        }
                                    />
                                </Routes>
                            </div>
                        </div>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}

export default App;