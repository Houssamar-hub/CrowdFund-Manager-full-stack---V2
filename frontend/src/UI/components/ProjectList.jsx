import { useState } from "react";
import { Search } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects, userRole, onInvest, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects?.filter(
    (project) =>
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()),
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
              className="create-first-btn"
              onClick={() => (window.location.href = "/projects/create")}
            >
              Create Your First Project
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
