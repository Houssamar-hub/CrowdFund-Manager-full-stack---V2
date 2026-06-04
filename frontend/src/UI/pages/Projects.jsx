import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchMyProjects,
  fetchOpenProjects,
} from "../../store/slices/projectSlice";
import { fetchBalance } from "../../store/slices/walletSlice";
import ProjectList from "../components/ProjectList";
import InvestModal from "../components/InvestModal";
import { Plus } from "lucide-react";
import "../../style/project.css";

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { projects, openProjects, isLoading } = useSelector(
    (state) => state.projects,
  );
  const { balance } = useSelector((state) => state.wallet);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showInvestModal, setShowInvestModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role === "owner") {
      dispatch(fetchMyProjects());
    } else {
      dispatch(fetchOpenProjects());
      dispatch(fetchBalance());
    }
  }, [dispatch, token, navigate, user]);

  const displayProjects = user?.role === "owner" ? projects : openProjects;
  const title = user?.role === "owner" ? "My Projects" : "Open Projects";
  const description =
    user?.role === "owner"
      ? "Manage and monitor all your fundraising campaigns"
      : "Discover and invest in promising projects";

  const handleInvest = (project) => {
    setSelectedProject(project);
    setShowInvestModal(true);
  };

  const handleInvestSuccess = () => {
    // Refresh projects to show updated investment data
    if (user?.role === "investor") {
      dispatch(fetchOpenProjects());
    } else if (user?.role === "owner") {
      dispatch(fetchMyProjects());
    }
    setShowInvestModal(false);
    setSelectedProject(null);
  };

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

      {/* PROJECT LIST */}
      <ProjectList
        projects={displayProjects}
        userRole={user?.role}
        onInvest={handleInvest}
        isLoading={isLoading}
      />

      {/* INVEST MODAL */}
      {showInvestModal && selectedProject && (
        <InvestModal
          project={selectedProject}
          balance={balance}
          onClose={() => {
            setShowInvestModal(false);
            setSelectedProject(null);
          }}
          onSuccess={handleInvestSuccess}
        />
      )}
    </div>
  );
};

export default Projects;
