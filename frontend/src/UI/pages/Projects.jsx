import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    fetchMyProjects,
    fetchOpenProjects,
} from "../../store/slices/projectSlice";

import { Search, Plus, Eye, DollarSign, Loader } from "lucide-react";

import "../../style/project.css";

const Projects = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token, user } = useSelector((state) => state.auth);

    const { projects, openProjects, isLoading } = useSelector(
        (state) => state.projects,
    );

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (user?.role === "owner") {
            dispatch(fetchMyProjects());
        } else {
            dispatch(fetchOpenProjects());
        }
    }, [dispatch, token, navigate, user]);

    const displayProjects = user?.role === "owner" ? projects : openProjects;

    const title = user?.role === "owner" ? "My Projects" : "Open Projects";

    const description =
        user?.role === "owner"
            ? "Manage and monitor all your fundraising campaigns"
            : "Discover and invest in promising projects";

    const filteredProjects = displayProjects?.filter(
        (project) =>
            project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    const calculateProgress = (project) => {
        const totalInvested =
            project.investments?.reduce(
                (sum, inv) => sum + (inv.amount || 0),
                0,
            ) || 0;

        return (totalInvested / project.capital) * 100;
    };

    const getTotalInvested = (project) => {
        return (
            project.investments?.reduce(
                (sum, inv) => sum + (inv.amount || 0),
                0,
            ) || 0
        );
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }
    if (isLoading) {
        return <Loader />;
    }
    return (
        <div className="projects-page">
            {/* HEADER */}
            <div className="projects-header">
                <div>
                    <h1 className="projects-title">{title}</h1>

                    <p className="projects-subtitle">{description}</p>
                </div>

                {user?.role === "owner" && (
                    <button
                        onClick={() => navigate("/projects/create")}
                        className="create-btn"
                    >
                        <Plus size={18} />
                        Create Project
                    </button>
                )}
            </div>

            {/* SEARCH */}
            <div className="search-wrapper">
                <Search size={18} className="search-icon" />

                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* EMPTY */}
            {!displayProjects || displayProjects.length === 0 ? (
                <div className="empty-state">
                    <p>No projects found</p>
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project) => {
                        const progress = calculateProgress(project);

                        const totalInvested = getTotalInvested(project);

                        return (
                            <div
                                key={project._id}
                                className="project-card"
                                onClick={() =>
                                    navigate(`/projects/${project._id}`)
                                }
                            >
                                {/* TOP */}
                                <div className="project-top">
                                    <h3 className="project-name">
                                        {project.title}
                                    </h3>

                                    <span
                                        className={`project-status ${
                                            project.status === "open"
                                                ? "status-open"
                                                : "status-closed"
                                        }`}
                                    >
                                        {project.status}
                                    </span>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="project-description">
                                    {project.description?.substring(0, 100)}
                                    ...
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
                                            style={{
                                                width: `${Math.min(
                                                    progress,
                                                    100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* STATS */}
                                <div className="project-stats">
                                    <div>
                                        <p className="stat-label">Target</p>

                                        <p className="stat-value">
                                            {project.capital.toLocaleString()}{" "}
                                            DH
                                        </p>
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

                                            navigate(
                                                `/projects/${project._id}`,
                                            );
                                        }}
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>

                                    {user?.role === "investor" &&
                                        project.status === "open" && (
                                            <button
                                                className="action-btn invest-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    navigate(
                                                        `/projects/${project._id}/invest`,
                                                    );
                                                }}
                                            >
                                                <DollarSign size={16} />
                                                Invest
                                            </button>
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Projects;
