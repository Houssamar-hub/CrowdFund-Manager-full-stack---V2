import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyProjects, fetchOpenProjects } from "../../store/slices/projectSlice";
import { fetchMyInvestments } from "../../store/slices/investmentSlice";
import { fetchBalance } from "../../store/slices/walletSlice";
import { Wallet, TrendingUp, Briefcase, FolderOpen, Eye } from "lucide-react";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector((state) => state.auth);
    const { projects, openProjects, isLoading } = useSelector((state) => state.projects);
    const { balance } = useSelector((state) => state.wallet);
    const { investments } = useSelector((state) => state.investments);

    useEffect(() => {
        if (user?.role === "investor") {
            dispatch(fetchBalance());
            dispatch(fetchMyInvestments());
            dispatch(fetchOpenProjects());
        } else {
            dispatch(fetchMyProjects());
        }
    }, [dispatch, token, navigate, user?.role]);

    const totalProjects = projects?.length || 0;
    const ownerOpenProjects =
        projects?.filter((p) => p.status === "open")?.length || 0;
    const closedProjects =
        projects?.filter((p) => p.status === "closed")?.length || 0;

    const ownerTotalInvested =
        projects?.reduce((sum, p) => {
            const invested =
                p.investments?.reduce((s, inv) => s + (inv.amount || 0), 0) ||
                0;
            return sum + invested;
        }, 0) || 0;

    const totalInvested = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
    const uniqueProjects = new Set(investments?.map(inv => inv.projectId?._id)).size || 0;

    const recentInvestments = [...(investments || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (isLoading && user?.role !== "investor") {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <>
            {user?.role === "investor" ? (
                <div>
                    <div style={{ marginBottom: "32px" }}>
                        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>
                            Investor Dashboard
                        </h1>
                        <p style={{ color: "#6b7280" }}>
                            Welcome back, {user?.name || "Investor"}! Track your portfolio and explore new opportunities.
                        </p>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "24px",
                        marginBottom: "32px",
                    }}>
                        <div style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", borderRadius: "16px", padding: "24px", color: "white" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <Wallet size={28} />
                                <p style={{ fontSize: "14px", opacity: 0.9 }}>Available Balance</p>
                            </div>
                            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{balance?.toLocaleString() || 0} DH</p>
                            <button
                                onClick={() => navigate("/wallet")}
                                style={{
                                    marginTop: "12px",
                                    padding: "6px 12px",
                                    background: "rgba(255,255,255,0.2)",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                Add Funds →
                            </button>
                        </div>

                        <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: "16px", padding: "24px", color: "white" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <TrendingUp size={28} />
                                <p style={{ fontSize: "14px", opacity: 0.9 }}>Total Invested</p>
                            </div>
                            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{totalInvested.toLocaleString()} DH</p>
                            <p style={{ fontSize: "12px", opacity: 0.8, marginTop: "8px" }}>
                                Across {uniqueProjects} project{uniqueProjects !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div style={{ background: "linear-gradient(135deg, #8b5cf6, #7c3aed)", borderRadius: "16px", padding: "24px", color: "white" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <Briefcase size={28} />
                                <p style={{ fontSize: "14px", opacity: 0.9 }}>Projects Financed</p>
                            </div>
                            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{uniqueProjects}</p>
                            <button
                                onClick={() => navigate("/portfolio")}
                                style={{
                                    marginTop: "12px",
                                    padding: "6px 12px",
                                    background: "rgba(255,255,255,0.2)",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                View Portfolio →
                            </button>
                        </div>

                        <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "16px", padding: "24px", color: "white" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                                <FolderOpen size={28} />
                                <p style={{ fontSize: "14px", opacity: 0.9 }}>Open Projects</p>
                            </div>
                            <p style={{ fontSize: "32px", fontWeight: "bold" }}>{openProjects?.length || 0}</p>
                            <button
                                onClick={() => navigate("/projects")}
                                style={{
                                    marginTop: "12px",
                                    padding: "6px 12px",
                                    background: "rgba(255,255,255,0.2)",
                                    border: "none",
                                    borderRadius: "8px",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                Explore →
                            </button>
                        </div>
                    </div>

                    {/* Global Portfolio Overview */}
                    <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "20px" }}>
                            Global Portfolio
                        </h2>
                        {investments?.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px" }}>
                                <TrendingUp size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No Investments Yet</h3>
                                <p style={{ color: "#6b7280", marginBottom: "16px" }}>
                                    Start building your portfolio by investing in projects
                                </p>
                                <button
                                    onClick={() => navigate("/projects")}
                                    style={{
                                        padding: "10px 20px",
                                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Explore Projects
                                </button>
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead style={{ background: "#f9fafb" }}>
                                        <tr>
                                            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>Project</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>Amount</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>Percentage</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>Date</th>
                                            <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentInvestments.map((inv) => {
                                            const percentage = inv.projectId?.capital
                                                ? ((inv.amount / inv.projectId.capital) * 100).toFixed(2)
                                                : "0.00";
                                            return (
                                                <tr key={inv._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                                    <td style={{ padding: "12px 16px" }}>
                                                        <p style={{ fontWeight: "600" }}>{inv.projectId?.title || "Unknown Project"}</p>
                                                    </td>
                                                    <td style={{ padding: "12px 16px", color: "#10b981", fontWeight: "600" }}>
                                                        {inv.amount?.toLocaleString()} DH
                                                    </td>
                                                    <td style={{ padding: "12px 16px" }}>
                                                        <span style={{
                                                            padding: "4px 10px",
                                                            background: "#dbeafe",
                                                            color: "#1e40af",
                                                            borderRadius: "20px",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                        }}>
                                                            {percentage}%
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6b7280" }}>
                                                        {new Date(inv.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                                        <button
                                                            onClick={() => navigate(`/projects/${inv.projectId?._id}`)}
                                                            style={{
                                                                background: "none",
                                                                border: "none",
                                                                cursor: "pointer",
                                                                color: "#3b82f6",
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                            }}
                                                        >
                                                            <Eye size={16} /> View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
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
                                {ownerOpenProjects}
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
                                {ownerTotalInvested.toLocaleString()} DH
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
