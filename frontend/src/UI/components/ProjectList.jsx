import { useState } from "react";
import { Search } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects, userRole, onInvest, onDelete, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProjects = projects?.filter(
        (project) =>
            project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()),
    );

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="projects-list">
            {/* SEARCH */}
            <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search projects by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* EMPTY STATE */}
            {!projects || projects.length === 0 ? (
                <div className="empty-state">
                    <p>No projects found</p>
                    {userRole === "owner" && (
                        <button
                            onClick={() =>
                                (window.location.href = "/projects/create")
                            }
                            style={{
                                background:
                                    "linear-gradient(135deg, #3b82f6, #2563eb)",
                                color: "white",
                                padding: "12px 18px",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",

                                margin: "20px auto",
                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                            }}
                        >
                            + Create Your First Project
                        </button>
                    )}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="empty-state">
                    <p>No projects match your search</p>
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            userRole={userRole}
                            onInvest={onInvest}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectList;
