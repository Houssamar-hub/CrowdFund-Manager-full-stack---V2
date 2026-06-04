import api from "./api";

const projectService = {
  // Récupérer mes projets (pour owner)
  getMyProjects: async () => {
    const response = await api.get("/projects/mine");
    return response.data;
  },

  // Récupérer les projets ouverts (pour investor)
  getOpenProjects: async () => {
    const response = await api.get("/projects/open");
    return response.data;
  },

  // Créer un projet
  createProject: async (projectData) => {
    const response = await api.post("/projects", projectData);
    return response.data;
  },

  // Récupérer un projet par ID (avec investissements)
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Mettre à jour un projet
  updateProject: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Supprimer un projet (owner seulement)
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Fermer un projet
  closeProject: async (id) => {
    const response = await api.patch(`/projects/${id}/close`);
    return response.data;
  },

  // Récupérer les investissements d'un projet
  getProjectInvestments: async (id) => {
    const response = await api.get(`/projects/${id}/investments`);
    return response.data;
  },
};

export default projectService;
