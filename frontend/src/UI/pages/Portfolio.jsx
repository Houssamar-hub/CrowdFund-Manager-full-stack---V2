import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyInvestments } from '../../store/slices/investmentSlice';
import { TrendingUp, DollarSign, Calendar, Eye, Search } from 'lucide-react';

const Portfolio = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { investments, isLoading } = useSelector((state) => state.investments);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchMyInvestments());
    }
  }, [dispatch, token, navigate]);

  // Calculer les statistiques
  const totalInvested = investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
  const uniqueProjects = new Set(investments?.map(inv => inv.projectId?._id)).size || 0;

  // Grouper les investissements par projet
  const portfolioProjects = [];
  const projectsMap = new Map();

  investments?.forEach(inv => {
    const projectId = inv.projectId?._id;
    if (!projectsMap.has(projectId)) {
      projectsMap.set(projectId, {
        id: projectId,
        title: inv.projectId?.title || 'Unknown Project',
        description: inv.projectId?.description,
        status: inv.projectId?.status,
        capital: inv.projectId?.capital,
        totalInvested: 0,
        investments: [],
        lastInvestment: inv.createdAt
      });
    }
    const project = projectsMap.get(projectId);
    project.totalInvested += inv.amount;
    project.investments.push(inv);
    if (new Date(inv.createdAt) > new Date(project.lastInvestment)) {
      project.lastInvestment = inv.createdAt;
    }
  });

  portfolioProjects.push(...projectsMap.values());

  // Filtrer par recherche
  const filteredProjects = portfolioProjects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculatePercentage = (project) => {
    return ((project.totalInvested / project.capital) * 100).toFixed(2);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>My Portfolio</h1>
        <p style={{ color: '#6b7280' }}>Track your investments and monitor your returns</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '16px', padding: '24px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <DollarSign size={28} />
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Total Invested</p>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalInvested.toLocaleString()} DH</p>
          <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
            Across {uniqueProjects} project{uniqueProjects !== 1 ? 's' : ''}
          </p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '16px', padding: '24px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <TrendingUp size={28} />
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Projects Funded</p>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{uniqueProjects}</p>
          <button
            onClick={() => navigate('/projects')}
            style={{
              marginTop: '12px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Explore More →
          </button>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '16px', padding: '24px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Calendar size={28} />
            <p style={{ fontSize: '14px', opacity: 0.9 }}>Active Investments</p>
          </div>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {portfolioProjects.filter(p => p.status === 'open').length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search by project name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '10px 10px 10px 38px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Portfolio Table */}
      {filteredProjects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <TrendingUp size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>No Investments Yet</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            {searchTerm ? 'No projects match your search' : 'You haven\'t invested in any projects yet'}
          </p>
          <button
            onClick={() => navigate('/projects')}
            style={{
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
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Project</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Amount Invested</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Ownership %</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Investment Date</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{project.title}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {project.description?.substring(0, 60)}...
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontWeight: '600', color: '#10b981', fontSize: '16px' }}>
                        {project.totalInvested.toLocaleString()} DH
                      </p>
                     </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {calculatePercentage(project)}%
                      </span>
                     </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        background: project.status === 'open' ? '#d1fae5' : '#fee2e2',
                        color: project.status === 'open' ? '#065f46' : '#991b1b'
                      }}>
                        {project.status === 'open' ? 'Active' : 'Completed'}
                      </span>
                     </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280' }}>
                      {new Date(project.lastInvestment).toLocaleDateString()}
                     </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#3b82f6',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={16} /> View
                      </button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;