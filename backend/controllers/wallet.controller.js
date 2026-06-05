import { User } from "../models/user.model.js";

// Récupérer le solde
export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ balance: user.balance || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ajouter des fonds
export const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);
    user.balance = (user.balance || 0) + amount;

    // Add transaction to history
    if (!user.transactions) {
      user.transactions = [];
    }
    user.transactions.push({
      type: "deposit",
      amount: Number(amount),
      description: "Wallet deposit",
      createdAt: new Date(),
    });

    await user.save();

    const transaction = {
      type: "deposit",
      amount: Number(amount),
      createdAt: new Date(),
      balance: user.balance,
    };

    res.json({
      message: "Funds added successfully",
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer l'historique
export const getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const transactions = user.transactions || [];

    // Sort by most recent first
    const sortedTransactions = transactions.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.json(sortedTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: error.message });
  }
};
