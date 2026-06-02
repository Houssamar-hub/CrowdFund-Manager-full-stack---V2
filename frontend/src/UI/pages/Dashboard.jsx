import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyProjects } from "../../store/slices/projectSlice";
import { Loader } from "lucide-react";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);
    const { projects, isLoading } = useSelector((state) => state.projects);

    useEffect(() => {
        dispatch(fetchMyProjects());
    }, [dispatch, token, navigate]);

    const totalProjects = projects?.length || 0;
    const openProjects =
        projects?.filter((p) => p.status === "open")?.length || 0;
    const closedProjects =
        projects?.filter((p) => p.status === "closed")?.length || 0;

    const totalInvested =
        projects?.reduce((sum, p) => {
            const invested =
                p.investments?.reduce((s, inv) => s + (inv.amount || 0), 0) ||
                0;
            return sum + invested;
        }, 0) || 0;
    if (isLoading) return <Loader />;
    return (
        <>
            {user?.role === "investor" ? (
                <div>
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                        }}
                    >
                        Investor Dashboard
                    </h1>

                    <p style={{ color: "#6b7280", marginBottom: "32px" }}>
                        Welcome back! Explore projects and manage your
                        investments.
                    </p>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "24px",
                        }}
                    >
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "20px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                Available Projects
                            </p>

                            <p style={{ fontSize: "32px", fontWeight: "bold" }}>
                                {projects?.length || 0}
                            </p>
                        </div>

                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "20px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                Total Investments
                            </p>

                            <p
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#10b981",
                                }}
                            >
                                {totalInvested.toLocaleString()} DH
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                        }}
                    >
                        Dashboard
                    </h1>
                    <p style={{ color: "#6b7280", marginBottom: "32px" }}>
                        Welcome back! Here's an overview of your projects.
                    </p>

                    {/* Stats Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "24px",
                            marginBottom: "32px",
                        }}
                    >
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "20px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                Total Projects
                            </p>
                            <p style={{ fontSize: "32px", fontWeight: "bold" }}>
                                {totalProjects}
                            </p>
                        </div>
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "20px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                Open Projects
                            </p>
                            <p
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#10b981",
                                }}
                            >
                                {openProjects}
                            </p>
                        </div>
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "20px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                Closed Projects
                            </p>
                            <p
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#ef4444",
                                }}
                            >
                                {closedProjects}
                            </p>
                        </div>
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding: "20px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <p style={{ color: "#6b7280", fontSize: "14px" }}>
                                Total Raised
                            </p>
                            <p
                                style={{
                                    fontSize: "32px",
                                    fontWeight: "bold",
                                    color: "#8b5cf6",
                                }}
                            >
                                {totalInvested.toLocaleString()} DH
                            </p>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div
                        style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "24px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: "600",
                                marginBottom: "16px",
                            }}
                        >
                            Recent Projects
                        </h2>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : projects?.length === 0 ? (
                            <div
                                style={{ textAlign: "center", padding: "40px" }}
                            >
                                <p
                                    style={{
                                        color: "#9ca3af",
                                        marginBottom: "16px",
                                    }}
                                >
                                    No projects yet
                                </p>
                                <button
                                    onClick={() => navigate("/projects/create")}
                                    style={{
                                        padding: "10px 20px",
                                        background:
                                            "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Create Your First Project
                                </button>
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                }}
                            >
                                {projects.slice(0, 5).map((project) => {
                                    const totalInvested =
                                        project.investments?.reduce(
                                            (sum, inv) =>
                                                sum + (inv.amount || 0),
                                            0,
                                        ) || 0;
                                    const percentage =
                                        (totalInvested / project.capital) * 100;
                                    return (
                                        <div
                                            key={project._id}
                                            style={{
                                                borderBottom:
                                                    "1px solid #f3f4f6",
                                                paddingBottom: "12px",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                navigate(
                                                    `/projects/${project._id}`,
                                                )
                                            }
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {project.title}
                                                </h3>
                                                <span
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    {percentage.toFixed(0)}%
                                                    completed
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    background: "#e5e7eb",
                                                    borderRadius: "8px",
                                                    height: "8px",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${Math.min(percentage, 100)}%`,
                                                        background:
                                                            "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                                                        height: "100%",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;
