// src/pages/Wallet.jsx
import "../../style/wallet.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addFunds } from "../../store/slices/walletSlice";

function Wallet() {
  const dispatch = useDispatch();
  const balance = useSelector(
    (state) => state.wallet.balance
  );

  const transactions = useSelector(
    (state) => state.wallet.transactions
  );

  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    if (!amount || amount <= 0) return;

    await dispatch(addFunds(Number(amount))).unwrap();

    setAmount("");
  };
  console.log(transactions);

  return (
  <div className="wallet-page">

    <h1 className="wallet-title">Wallet</h1>

    {/* Balance */}
    <div className="wallet-balance">
      <p>Balance</p>
      <h2>{balance} DH</h2>
    </div>

    {/* Deposit */}
    <div className="wallet-box">
      <input
        className="wallet-input"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant"
      />

      <button
        className="wallet-btn"
        onClick={handleDeposit}
      >
        Alimenter
      </button>
    </div>

    {/* History */}
    <div className="wallet-history">
      <h3>Historique</h3>

      {transactions.map((t) => (
        <div key={t.id} className="wallet-item">
          <span className={t.type === "DEPOSIT" ? "deposit" : "withdraw"}>
            {t.type}
          </span>

          <span>{t.amount} DH</span>
        </div>
      ))}
    </div>

  </div>
);
}

export default Wallet;