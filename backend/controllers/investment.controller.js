import { Investment } from "../models/investment.model.js";
import { Project } from "../models/project.model.js";

export const invest = async (req, res) => {
    const { amount, projectId } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.status === "closed")
        return res.status(400).json({ message: "Project closed" });

    const maxPerInvestor =
        project.capital * (project.maxInvestmentPercent / 100);
    if (amount > maxPerInvestor)
        return res.status(400).json({ message: "Exceeds max per investor" });

    // 
    const investorTotal = await Investment.aggregate([
  {
    $match: {
      projectId: project._id,
      investorId: req.user._id,
    },
  },
  {
    $group: {
      _id: "$investorId",
      total: { $sum: "$amount" },
    },
  },
]);

const totalByInvestor = investorTotal[0]?.total || 0;

if (totalByInvestor + amount > maxPerInvestor) {
  return res.status(400).json({
    message: "Investor exceeds allowed percentage",
  });
}
const currentTotal = await Investment.aggregate([
  {
    $match: {
      projectId: project._id,
    },
  },
  {
    $group: {
      _id: "$projectId",
      total: { $sum: "$amount" },
    },
  },
]);

const investedAmount = currentTotal[0]?.total || 0;

if (investedAmount + amount > project.capital) {
  return res.status(400).json({
    message: "Investment exceeds project capital",
  });
}
// 
    const investment = await Investment.create({
        amount,
        projectId,
        investorId: req.user._id,
    });
    project.investments.push(investment._id);

    const totalInvested = await Investment.aggregate([
        { $match: { projectId: project._id } },
        { $group: { _id: "$projectId", total: { $sum: "$amount" } } },
    ]);
    if (totalInvested[0]?.total >= project.capital) project.status = "closed";
    await project.save();

    res.status(201).json(investment);
};
