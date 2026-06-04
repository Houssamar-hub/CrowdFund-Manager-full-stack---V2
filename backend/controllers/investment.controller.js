import { Investment } from "../models/investment.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";

// Investir dans un projet
export const invest = async (req, res) => {
  try {
    const { amount, projectId } = req.body;
    const investorId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status === "closed") {
      return res.status(400).json({ message: "Project is closed for investments" });
    }

    if (amount < 100) {
      return res.status(400).json({ message: "Minimum investment amount is 100 DH" });
    }

    const investor = await User.findById(investorId);
    if (investor.balance < amount) {
      return res.status(400).json({ 
        message: `Insufficient balance. Your balance is ${investor.balance} DH` 
      });
    }

    const existingInvestments = await Investment.find({ 
      projectId: project._id, 
      investorId: investorId 
    });
    const totalInvestedByUser = existingInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    const maxPerInvestor = project.capital * (project.maxInvestmentPercent / 100);
    
    if (totalInvestedByUser + amount > maxPerInvestor) {
      return res.status(400).json({ 
        message: `Maximum investment per investor is ${maxPerInvestor} DH. You already invested ${totalInvestedByUser} DH` 
      });
    }

    const allInvestments = await Investment.find({ projectId: project._id });
    const totalInvested = allInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    if (totalInvested + amount > project.capital) {
      const remaining = project.capital - totalInvested;
      return res.status(400).json({ 
        message: `Investment exceeds remaining target. Remaining: ${remaining} DH` 
      });
    }

    investor.balance -= amount;
    await investor.save();

    const investment = await Investment.create({
      amount: Number(amount),
      projectId: project._id,
      investorId: investorId,
      percentage: (amount / project.capital) * 100
    });

    project.investments.push(investment._id);

    const newTotalInvested = totalInvested + amount;
    if (newTotalInvested >= project.capital) {
      project.status = "closed";
    }

    await project.save();

    const populatedInvestment = await Investment.findById(investment._id)
      .populate("projectId", "title capital")
      .populate("investorId", "name email");

    res.status(201).json({
      message: "Investment successful",
      investment: populatedInvestment,
      newBalance: investor.balance,
      project: {
        id: project._id,
        title: project.title,
        totalInvested: newTotalInvested,
        remaining: project.capital - newTotalInvested,
        status: project.status
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les investissements de l'utilisateur connecté
export const getMyInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ investorId: req.user._id })
      .populate("projectId", "title description capital status maxInvestmentPercent")
      .sort({ createdAt: -1 });

    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les investissements d'un projet spécifique
export const getProjectInvestments = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const investments = await Investment.find({ projectId })
      .populate("investorId", "name email")
      .sort({ amount: -1 });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

    res.json({
      investments,
      totalInvested,
      count: investments.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le portefeuille de l'utilisateur
export const getPortfolio = async (req, res) => {
  try {
    const investments = await Investment.find({ investorId: req.user._id })
      .populate("projectId", "title description capital status")
      .sort({ createdAt: -1 });

    const portfolio = [];
    const projectMap = new Map();

    investments.forEach(inv => {
      const projectId = inv.projectId._id.toString();
      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          project: inv.projectId,
          totalInvested: 0,
          investments: [],
          percentage: 0
        });
      }
      const entry = projectMap.get(projectId);
      entry.totalInvested += inv.amount;
      entry.investments.push(inv);
      entry.percentage = (entry.totalInvested / inv.projectId.capital) * 100;
    });

    for (const [_, value] of projectMap) {
      portfolio.push(value);
    }

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const projectsCount = portfolio.length;

    res.json({
      portfolio,
      totalInvested,
      projectsCount,
      investments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};