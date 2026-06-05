// src/pages/Wallet.jsx
import "../../style/wallet.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  addFunds,
  fetchBalance,
  fetchTransactions,
  clearError,
} from "../../store/slices/walletSlice";
import toast from "react-hot-toast";

function Wallet() {
  const dispatch = useDispatch();

  const balance = useSelector((state) => state.wallet.balance);
  const transactions = useSelector((state) => state.wallet.transactions);
  const isLoading = useSelector((state) => state.wallet.isLoading);
  const error = useSelector((state) => state.wallet.error);

  const [amount, setAmount] = useState("");

  useEffect(() => {
    dispatch(fetchBalance());
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await dispatch(addFunds(Number(amount))).unwrap();
      toast.success(`Successfully added ${amount} DH to your wallet`);
      setAmount("");
      // Refresh balance and transactions
      await dispatch(fetchBalance());
      await dispatch(fetchTransactions());
    } catch (err) {
      toast.error(err || "Failed to add funds");
    }
  };

  return (
    <div className="wallet-page">
      <h1 className="wallet-title">Wallet</h1>

      {/* Balance */}
      <div className="wallet-balance">
        <p>Balance</p>
        <h2>{balance?.toLocaleString() || 0} DH</h2>
      </div>

      {/* Deposit */}
      <div className="wallet-box">
        <input
          className="wallet-input"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          disabled={isLoading}
        />

        <button
          className="wallet-btn"
          onClick={handleDeposit}
          disabled={isLoading || !amount}
        >
          {isLoading ? "Processing..." : "Add Funds"}
        </button>
      </div>

      {/* History */}
      <div className="wallet-history">
        <h3>Transaction History</h3>

        {transactions && transactions.length > 0 ? (
          transactions.map((t, index) => (
            <div key={t._id || index} className="wallet-item">
              <div className="transaction-info">
                <span className={`transaction-type ${t.type?.toLowerCase()}`}>
                  {t.type === "DEPOSIT" || t.type === "deposit"
                    ? "💰 Deposit"
                    : "💸 Withdrawal"}
                </span>
                <span className="transaction-date">
                  {t.createdAt
                    ? new Date(t.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <span className="transaction-amount">+{t.amount} DH</span>
            </div>
          ))
        ) : (
          <div className="empty-history">
            <p>No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;
