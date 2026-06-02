import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Users, DollarSign, TrendingUp as TrendingUpIcon } from 'lucide-react';
import investmentService from '../../services/investmentService';
import toast from 'react-hot-toast';

const Investors = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [investments, setInvestments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchAllInvestments();
    }
  }, [token, navigate]);

  const fetchAllInvestments = async () => {
    try {
      setLoading(true);
      const data = await investmentService.getAllInvestments();
      setInvestments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
      toast.error('Failed to load investors data');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  // Group investments by investor
  const investorMap = new Map();
  investments.forEach(inv => {
    const investorId = inv.investorId?._id || inv.investorId;
    const investorName = inv.investorId?.name || 'Unknown Investor';
    const investorEmail = inv.investorId?.email || '';
    
    if (!investorMap.has(investorId)) {
      investorMap.set(investorId, {
        id: investorId,
        name: investorName,
        email: investorEmail,
        totalInvested: 0,
        projectCount: 0
      });
    }
    const investor = investorMap.get(investorId);
    investor.totalInvested += inv.amount || 0;
    investor.projectCount += 1;
  });

  const allInvestors = Array.from(investorMap.values());

  const filteredInvestors = allInvestors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInvested = allInvestors.reduce((sum, inv) => sum + inv.totalInvested, 0);
  const totalInvestors = allInvestors.length;
  const averageInvestment = totalInvestors > 0 ? totalInvested / totalInvestors : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #e5e7eb', 
          borderTopColor: '#3b82f6', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Investors</h1>
        <p style={{ color: '#6b7280' }}>Manage and track all your investors</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Investors</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalInvestors}</p>
            </div>
            <Users size={40} style={{ color: '#3b82f6' }} />
          </div>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Total Invested</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                ${totalInvested.toLocaleString()}
              </p>
            </div>
            <DollarSign size={40} style={{ color: '#10b981' }} />
          </div>
        </div>
        
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Average Investment</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}>
                ${averageInvestment.toLocaleString()}
              </p>
            </div>
            <TrendingUpIcon size={40} style={{ color: '#8b5cf6' }} />
          </div>
        </div>
      </div>

      {/* Investors Table */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Search investors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Table */}
        {filteredInvestors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
            {searchTerm ? 'No investors match your search' : 'No investors found'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Total Invested</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Projects</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.map((investor) => (
                  <tr key={investor.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' }}>
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {investor.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '500' }}>{investor.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>{investor.email || '-'}</td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#10b981' }}>
                      ${investor.totalInvested.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>{investor.projectCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Investors;