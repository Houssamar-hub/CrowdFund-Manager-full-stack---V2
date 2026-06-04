// src/pages/Wallet.jsx

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

function Wallet() {
  const dispatch = useDispatch();

  const balance = useSelector(
    (state) => state.wallet.balance
  );

  const transactions = useSelector(
    (state) => state.wallet.transactions
  );

  const [amount, setAmount] = useState("");

  const handleDeposit = () => {
    if (!amount || amount <= 0) return;

    dispatch(deposit(Number(amount)));

    setAmount("");
  };

  return (
    <div>
      <h1>Wallet</h1>

      <h2>Balance : {balance} DH</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Montant"
      />

      <button onClick={handleDeposit}>
        Alimenter
      </button>

      <h3>Historique</h3>

      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            {transaction.type} - {transaction.amount} DH
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wallet;