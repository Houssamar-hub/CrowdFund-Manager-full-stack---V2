import { Project } from "../models/project.model.js";
import { Investment } from "../models/investment.model.js";

// Créer un projet
export const createProject = async (req, res) => {
  try {
    const { title, description, capital, maxInvestmentPercent } = req.body;
    
    console.log("📝 Creating project for user:", req.user._id);
    console.log("Project data:", { title, description, capital, maxInvestmentPercent });
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    
    if (!capital || capital < 1000) {
      return res.status(400).json({ message: "Capital must be at least 1000 DH" });
    }
    
    const project = await Project.create({
      title,
      description,
      capital: Number(capital),
      owner: req.user._id,
      maxInvestmentPercent: maxInvestmentPercent ? Number(maxInvestmentPercent) : 30,
      status: "open",
      investments: []
    });
    
    console.log("✅ Project created successfully:", project._id);
    res.status(201).json(project);
    
  } catch (error) {
    console.error("❌ Error creating project:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer mes projets (pour owner)
export const getMyProjects = async (req, res) => {
  try {
    console.log("Fetching projects for user:", req.user._id);
    
    const projects = await Project.find({ owner: req.user._id })
      .populate({
        path: "investments",
        populate: { path: "investorId", select: "name email" },
      })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${projects.length} projects`);
    res.json(projects);
    
  } catch (error) {
    console.error("Error fetching my projects:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les projets ouverts (pour investor)
export const getOpenProjects = async (req, res) => {
  try {
    console.log("Fetching all open projects...");
    
    const projects = await Project.find({ status: "open" })
      .populate("owner", "name email")
      .populate({
        path: "investments",
        populate: { path: "investorId", select: "name email" }
      })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${projects.length} open projects`);
    res.json(projects);
    
  } catch (error) {
    console.error("Error fetching open projects:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un projet par son ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching project:", id);
    
    const project = await Project.findById(id)
      .populate({
        path: "investments",
        populate: { path: "investorId", select: "name email" }
      })
      .populate("owner", "name email");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    console.log("Project found:", project.title);
    res.json(project);
    
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un projet
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, capital, maxInvestmentPercent } = req.body;
    
    console.log("Updating project:", id);
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Vérifier que l'utilisateur est le propriétaire
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }
    
    if (project.status === "closed") {
      return res.status(400).json({ message: "Cannot update a closed project" });
    }
    
    // Mise à jour des champs
    if (title) project.title = title;
    if (description) project.description = description;
    if (capital) project.capital = Number(capital);
    if (maxInvestmentPercent) {
      project.maxInvestmentPercent = Math.min(100, Math.max(1, Number(maxInvestmentPercent)));
    }
    
    await project.save();
    
    console.log("Project updated successfully");
    res.json(project);
    
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: error.message });
  }
};

// Fermer un projet
export const closeProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Closing project:", id);
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Vérifier que l'utilisateur est le propriétaire
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to close this project" });
    }
    
    if (project.status === "closed") {
      return res.status(400).json({ message: "Project is already closed" });
    }
    
    project.status = "closed";
    await project.save();
    
    console.log("Project closed successfully");
    res.json({ message: "Project closed successfully", project });
    
  } catch (error) {
    console.error("Error closing project:", error);
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un projet
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting project:", id);
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Vérifier que l'utilisateur est le propriétaire
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }
    
    // Supprimer tous les investissements liés au projet
    await Investment.deleteMany({ projectId: project._id });
    
    // Supprimer le projet
    await project.deleteOne();
    
    console.log("Project and related investments deleted successfully");
    res.json({ message: "Project deleted successfully" });
    
  } catch (error) {
    console.error(" Error deleting project:", error);
    res.status(500).json({ message: error.message });
  }
};

// Investir dans un projet (déplacé ici depuis investment.controller.js)
export const investInProject = async (req, res) => {
  try {
    const { amount, projectId } = req.body;
    const investorId = req.user._id;
    
    console.log("💰 Investing in project:", projectId);
    console.log("Amount:", amount, "Investor:", investorId);
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    if (project.status === "closed") {
      return res.status(400).json({ message: "Project is closed for investments" });
    }
    
    // Calculer le montant maximum par investisseur
    const maxPerInvestor = project.capital * (project.maxInvestmentPercent / 100);
    
    // Calculer le total déjà investi par cet investisseur dans ce projet
    const existingInvestments = await Investment.find({ 
      projectId: project._id, 
      investorId: investorId 
    });
    
    const totalInvestedByUser = existingInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    if (totalInvestedByUser + amount > maxPerInvestor) {
      return res.status(400).json({ 
        message: `Investment exceeds maximum allowed per investor. Maximum: ${maxPerInvestor} DH, You already invested: ${totalInvestedByUser} DH` 
      });
    }
    
    // Créer l'investissement
    const investment = await Investment.create({
      amount: Number(amount),
      projectId: project._id,
      investorId: investorId,
      percentage: (amount / project.capital) * 100
    });
    
    // Ajouter l'investissement au projet
    project.investments.push(investment._id);
    
    // Vérifier si le projet a atteint son objectif
    const allInvestments = await Investment.find({ projectId: project._id });
    const totalInvested = allInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    if (totalInvested >= project.capital) {
      project.status = "closed";
      console.log("🎉 Project target reached! Project closed.");
    }
    
    await project.save();
    
    console.log("Investment successful");
    res.status(201).json({ 
      message: "Investment successful", 
      investment,
      project: {
        id: project._id,
        title: project.title,
        totalInvested: totalInvested,
        remaining: project.capital - totalInvested,
        status: project.status
      }
    });
    
  } catch (error) {
    console.error("Error investing in project:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les investissements d'un projet
export const getProjectInvestments = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching investments for project:", id);
    
    const investments = await Investment.find({ projectId: id })
      .populate("investorId", "name email")
      .sort({ createdAt: -1 });
    
    console.log(`Found ${investments.length} investments`);
    res.json(investments);
    
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ message: error.message });
  }
};