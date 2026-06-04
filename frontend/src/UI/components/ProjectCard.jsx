import { useNavigate } from "react-router-dom";
import { Eye, DollarSign, Trash2 } from "lucide-react";
import { useState } from "react";
import projectService from "../../services/projectService";

const ProjectCard = ({ project, userRole, onInvest, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const calculateProgress = () => {
    const totalInvested =
      project.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) ||
      0;
    return (totalInvested / project.capital) * 100;
  };

  const getTotalInvested = () => {
    return (
      project.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0
    );
  };

  const progress = calculateProgress();
  const totalInvested = getTotalInvested();

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      )
    ) {
      try {
        setIsDeleting(true);
        await projectService.deleteProject(project._id);
        if (onDelete) onDelete(project._id);
      } catch (error) {
        console.error("Error deleting project:", error);
        alert(
          "Failed to delete project: " +
            (error.response?.data?.message || error.message),
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className="project-card"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      {/* TOP */}
      <div className="project-top">
        <h3 className="project-name">{project.title}</h3>
        <span
          className={`project-status ${project.status === "open" ? "status-open" : "status-closed"}`}
        >
          {project.status}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="project-description">
        {project.description?.substring(0, 100)}...
      </p>

      {/* PROGRESS */}
      <div className="progress-section">
        <div className="progress-top">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="project-stats">
        <div>
          <p className="stat-label">Target</p>
          <p className="stat-value">{project.capital.toLocaleString()} DH</p>
        </div>
        <div>
          <p className="stat-label">Raised</p>
          <p className="stat-value raised">
            {totalInvested.toLocaleString()} DH
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="project-actions">
        <button
          className="action-btn view-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/projects/${project._id}`);
          }}
        >
          <Eye size={16} />
          View Details
        </button>

        {userRole === "investor" && project.status === "open" && (
          <button
            className="action-btn invest-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onInvest) onInvest(project);
            }}
          >
            <DollarSign size={16} />
            Invest Now
          </button>
        )}

        {userRole === "owner" && (
          <button
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            title="Delete this project"
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
