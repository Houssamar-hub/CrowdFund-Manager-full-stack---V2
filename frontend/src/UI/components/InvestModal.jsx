import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  X,
  DollarSign,
  Wallet,
  AlertCircle,
  TrendingUp,
  Target,
  Percent,
  ArrowRight,
  Plus,
} from "lucide-react";
import { investInProject } from "../../store/slices/investmentSlice";
import { fetchBalance } from "../../store/slices/walletSlice";
import { fetchProjectById } from "../../store/slices/projectSlice";
import toast from "react-hot-toast";

const InvestModal = ({ project, balance, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!project) return null;

  const totalInvested =
    project.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
  const remaining = project.capital - totalInvested;
  const maxPerInvestor = project.capital * (project.maxInvestmentPercent / 100);
  const progress = (totalInvested / project.capital) * 100;
  const suggestedAmounts = [100, 500, 1000, 5000].filter(
    (amt) => amt <= Math.min(balance, remaining, maxPerInvestor),
  );
  const ownershipPercent = (
    (parseFloat(amount || 0) / project.capital) *
    100
  ).toFixed(2);

  const handleInvest = async () => {
    console.log("CLICK");
    console.log("AMOUNT =", amount);
    console.log("BALANCE =", balance);
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amountNum > balance) {
      alert(`Insufficient balance. Your balance is ${balance} DH`);
      return;
    }
    if (amountNum > remaining) {
      alert(`Investment exceeds remaining target. Remaining: ${remaining} DH`);
      return;
    }
    if (amountNum > maxPerInvestor) {
      alert(`Maximum investment per investor is ${maxPerInvestor} DH`);
      return;
    }
    setIsLoading(true);
    try {
      console.log("Before dispatch");
      await dispatch(
        investInProject({ projectId: project._id, amount: amountNum }),
      ).unwrap();

      console.log("After dispatch");
      // Refresh balance and project data
      await dispatch(fetchBalance());
      await dispatch(fetchProjectById(project._id));

      alert(`Successfully invested ${amountNum} DH in ${project.title}`);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log("ERROR =>", error);
      toast.error(error || "Investment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-wrapper">
        <div className="modal-container">
          {/* Header */}
          <div className="modal-header">
            <div>
              <h2>Invest in {project.title}</h2>
              <p className="modal-subtitle">
                Become a part of this amazing project
              </p>
            </div>
            <button className="modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Stats Grid */}
            <div className="stats-grid-modal">
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <span className="stat-label">Target Capital</span>
                  <strong className="stat-value">
                    {project.capital.toLocaleString()} DH
                  </strong>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <span className="stat-label">Progress</span>
                  <strong className="stat-value">{progress.toFixed(1)}%</strong>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <span className="stat-label">Max/Investor</span>
                  <strong className="stat-value">
                    {maxPerInvestor.toLocaleString()} DH
                  </strong>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-card">
              <div className="progress-header">
                <span>Campaign Progress</span>
                <span className="progress-badge">{progress.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                  }}
                />
              </div>
              <div className="progress-footer">
                <div>
                  <span>Raised</span>
                  <strong>{totalInvested.toLocaleString()} DH</strong>
                </div>
                <div>
                  <span>Remaining</span>
                  <strong className="text-green">
                    {remaining.toLocaleString()} DH
                  </strong>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="balance-card">
              <div className="balance-icon">💰</div>
              <div className="balance-info">
                <span>Your Balance</span>
                <strong>{balance?.toLocaleString() || 0} DH</strong>
              </div>
              <button
                className="btn-add-funds"
                onClick={() => navigate("/wallet")}
              >
                <Plus size={16} /> Add Funds
              </button>
            </div>

            {/* Investment Input */}
            <div className="input-group">
              <label>
                <DollarSign
                  size={18}
                  style={{ marginRight: "8px", color: "#667eea" }}
                />
                Investment Amount <span className="required">*</span>
              </label>
              <div className="amount-wrapper">
                <span className="currency">💰</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="amount-input"
                  autoFocus
                />
              </div>

              {suggestedAmounts.length > 0 && (
                <div className="suggestions">
                  <span>Quick amounts:</span>
                  {suggestedAmounts.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => setAmount(sug.toString())}
                      className="suggest-btn"
                    >
                      {sug.toLocaleString()} DH
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ownership Info */}
            <div className="ownership-card">
              <span>🔔</span>
              <div>
                <strong>
                  You will own {ownershipPercent}% of this project
                </strong>
                <p>
                  Based on your investment amount relative to the target capital
                </p>
              </div>
            </div>

            {/* Summary */}
            {amount && parseFloat(amount) > 0 && (
              <div className="summary-card">
                <h4>Investment Summary</h4>
                <div className="summary-row">
                  <span>Investment Amount</span>
                  <strong>{parseFloat(amount).toLocaleString()} DH</strong>
                </div>
                <div className="summary-row">
                  <span>Ownership Share</span>
                  <strong>{ownershipPercent}%</strong>
                </div>
                <div className="summary-row total">
                  <span>Remaining Balance</span>
                  <strong>
                    {(balance - parseFloat(amount)).toLocaleString()} DH
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-confirm"
              onClick={handleInvest}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
            >
              {isLoading ? <>⏳ Processing...</> : <>💰 Confirm Investment</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestModal;
