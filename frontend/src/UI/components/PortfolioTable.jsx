import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Calendar, Eye } from 'lucide-react';

const PortfolioTable = ({ investments }) => {
  const navigate = useNavigate();

  const calculatePercentage = (investment) => {
    const projectCapital = investment.projectId?.capital || 1;
    return ((investment.amount / projectCapital) * 100).toFixed(2);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const uniqueProjects = new Set(investments.map(inv => inv.projectId?._id)).size;

  if (investments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
        <TrendingUp size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
        <p style={{ color: '#9ca3af' }}>You haven't made any investments yet</p>
        <button
          onClick={() => navigate('/projects')}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Explore Projects
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Portfolio Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '16px', padding: '20px', color: 'white' }}>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Invested</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalInvested.toLocaleString()} DH</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '16px', padding: '20px', color: 'white' }}>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Projects Funded</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{uniqueProjects}</p>
        </div>
      </div>

      {/* Investments Table */}
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb' }}>
            <tr>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Project</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Amount Invested</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Percentage</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Date</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment, index) => {
              const project = investment.projectId;
              return (
                <tr key={investment._id || index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <p style={{ fontWeight: '600' }}>{project?.title || 'Unknown Project'}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af' }}>{project?.description?.substring(0, 50)}...</p>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#10b981' }}>
                    {investment.amount.toLocaleString()} DH
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {calculatePercentage(investment)}%
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                    {new Date(investment.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: project?.status === 'open' ? '#d1fae5' : '#fee2e2',
                      color: project?.status === 'open' ? '#065f46' : '#991b1b'
                    }}>
                      {project?.status || 'unknown'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => navigate(`/projects/${project?._id}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#3b82f6'
                      }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;