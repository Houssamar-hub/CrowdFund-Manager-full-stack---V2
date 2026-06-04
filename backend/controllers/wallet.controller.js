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
    await user.save();

    const transaction = {
      amount,
      type: "deposit",
      createdAt: new Date(),
      balance: user.balance
    };

    res.json({ 
      message: "Funds added successfully", 
      balance: user.balance,
      transaction 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer l'historique
export const getTransactions = async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};