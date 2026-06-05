import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Target,
    TrendingUp,
    Users,
    DollarSign,
    Edit2,
    Trash2,
    Lock,
} from "lucide-react";
import InvestModal from "./InvestModal";

const ProjectDetails = ({
    project,
    userRole,
    balance,
    onEdit,
    onClose,
    onDelete,
    onInvestSuccess,
}) => {
    const navigate = useNavigate();
    const [showInvestModal, setShowInvestModal] = useState(false);

    const totalInvested =
        project?.investments?.reduce(
            (sum, inv) => sum + (inv.amount || 0),
            0,
        ) || 0;
    const progress = (totalInvested / project?.capital) * 100;
    const isOpen = project?.status === "open";

    return (
        <div className="project-details-page">
            {/* Back Button */}
            <button
                onClick={() => navigate("/projects")}
                className="back-button"
            >
                <ArrowLeft size={18} /> Back to Projects
            </button>

            {/* Main Content */}
            <div className="details-container">
                <div className="details-header">
                    <div>
                        <h1 className="details-title">{project?.title}</h1>
                        <span
                            className={`status-badge ${isOpen ? "status-open" : "status-closed"}`}
                        >
                            {project?.status}
                        </span>
                    </div>
                    {userRole === "owner" && isOpen && (
                        <div className="action-buttons">
                            <button onClick={onEdit} className="edit-btn">
                                <Edit2 size={16} /> Edit
                            </button>
                            <button onClick={onClose} className="close-btn">
                                <Lock size={16} /> Close
                            </button>
                            <button onClick={onDelete} className="delete-btn">
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    )}
                </div>

                <p className="details-description">{project?.description}</p>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card blue">
                        <Target size={28} />
                        <p>Target Capital</p>
                        <strong>{project?.capital?.toLocaleString()} DH</strong>
                    </div>
                    <div className="stat-card green">
                        <DollarSign size={28} />
                        <p>Raised Capital</p>
                        <strong>{totalInvested.toLocaleString()} DH</strong>
                    </div>
                    <div className="stat-card purple">
                        <TrendingUp size={28} />
                        <p>Progress</p>
                        <strong>{progress.toFixed(1)}%</strong>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-section details-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Investors Section */}
                <div className="investors-section">
                    <div className="section-header">
                        <Users size={20} />
                        <h2>Investors</h2>
                    </div>
                    {project?.investments?.length === 0 ? (
                        <p className="no-investors">No investors yet</p>
                    ) : (
                        <table className="investors-table">
                            <thead>
                                <tr>
                                    <th>Investor Name</th>
                                    <th>Amount Invested</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project?.investments?.map((inv, idx) => {
                                    const percent =
                                        (inv.amount / project?.capital) * 100;
                                    return (
                                        <tr key={inv._id || idx}>
                                            <td>
                                                {inv.investorId?.name ||
                                                    `Investor ${idx + 1}`}
                                            </td>
                                            <td className="amount">
                                                {inv.amount?.toLocaleString()}{" "}
                                                DH
                                            </td>
                                            <td>
                                                <span className="percent-badge">
                                                    {percent.toFixed(2)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Invest Button for Investors */}
                {userRole === "investor" && isOpen && (
                    <div className="invest-section">
                        <button
                            onClick={() => setShowInvestModal(true)}
                            className="invest-now-btn"
                        >
                            <DollarSign size={18} /> Invest in this Project
                        </button>
                    </div>
                )}
            </div>

            {/* Invest Modal */}
            {showInvestModal && (
                <InvestModal
                    project={project}
                    balance={balance}
                    onClose={() => setShowInvestModal(false)}
                    onSuccess={onInvestSuccess}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
