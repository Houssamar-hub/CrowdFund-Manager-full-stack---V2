import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, updateProject, closeProject, deleteProject, fetchMyProjects } from '../../store/slices/projectSlice';
import { ArrowLeft, Edit2, Save, X, Trash2, Lock, Users, TrendingUp as TrendingUpIcon, Target, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, isLoading } = useSelector((state) => state.projects);
  const userRole = useSelector((state) => state.auth.user?.role);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  const calculateProgress = () => {
    if (!currentProject) return 0;
    const totalInvested = currentProject.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
    return (totalInvested / currentProject.capital) * 100;
  };

  const getTotalInvested = () => {
    if (!currentProject) return 0;
    return currentProject.investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;
  };

  const handleEdit = () => {
    setEditData({
      title: currentProject.title,
      description: currentProject.description,
      capital: currentProject.capital,
      maxInvestmentPercent: currentProject.maxInvestmentPercent
    });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateProject({ id, data: editData })).unwrap();
      setIsEditing(false);
      toast.success('Project updated successfully');
      dispatch(fetchProjectById(id));
    } catch (error) {
      toast.error('Failed to update project');
    }
  };

  const handleClose = async () => {
    if (window.confirm('Are you sure you want to close this project?')) {
      try {
        await dispatch(closeProject(id)).unwrap();
        toast.success('Project closed successfully');
        dispatch(fetchProjectById(id));
      } catch (error) {
        toast.error('Failed to close project');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await dispatch(deleteProject(id)).unwrap();
        toast.success('Project deleted successfully');
        await dispatch(fetchMyProjects());
        navigate('/projects');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <p>Project not found</p>
      </div>
    );
  }

  const progress = calculateProgress();
  const totalInvested = getTotalInvested();
  const isOpen = currentProject.status === 'open';

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={20} /> Back to Projects
      </button>

      {/* Main Content */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        {isEditing ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Edit Project</h2>
              <button onClick={() => setIsEditing(false)} style={{ color: '#6b7280', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows="5"
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Target Capital ($)</label>
              <input
                type="number"
                value={editData.capital}
                onChange={(e) => setEditData({ ...editData, capital: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Max % per Investor</label>
              <input
                type="number"
                value={editData.maxInvestmentPercent}
                onChange={(e) => setEditData({ ...editData, maxInvestmentPercent: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleUpdate}
                style={{
                  padding: '10px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} style={{ display: 'inline', marginRight: '6px' }} /> Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{ padding: '10px 24px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{currentProject.title}</h1>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: isOpen ? '#d1fae5' : '#fee2e2',
                    color: isOpen ? '#065f46' : '#991b1b'
                  }}>
                    {currentProject.status}
                  </span>
                </div>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{currentProject.description}</p>
              </div>
              
              {userRole === 'owner' && isOpen && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleEdit}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={handleClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Lock size={16} /> Close
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
              
              {userRole === 'owner' && !isOpen && (
                <button
                  onClick={handleDelete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '32px' }}>
              <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '12px', padding: '20px', color: 'white' }}>
                <Target size={28} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '13px', opacity: 0.9 }}>Target Capital</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${currentProject.capital.toLocaleString()}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '12px', padding: '20px', color: 'white' }}>
                <DollarSign size={28} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '13px', opacity: 0.9 }}>Raised Capital</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalInvested.toLocaleString()}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius: '12px', padding: '20px', color: 'white' }}>
                <TrendingUpIcon size={28} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '13px', opacity: 0.9 }}>Progress</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{progress.toFixed(1)}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ background: '#e5e7eb', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  height: '100%',
                  borderRadius: '10px',
                  transition: 'width 0.5s'
                }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Investors Section */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Users size={24} style={{ color: '#3b82f6' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Investors</h2>
        </div>

        {currentProject.investments?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            <Users size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>No investors yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Investor Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Amount Invested</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {currentProject.investments?.map((investment, index) => {
                  const percent = (investment.amount / currentProject.capital) * 100;
                  return (
                    <tr key={investment._id || index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>
                        {investment.investorId?.name || `Investor ${index + 1}`}
                       </td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: '500' }}>
                        ${investment.amount?.toLocaleString()}
                       </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '2px 8px',
                          background: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          {percent.toFixed(2)}%
                        </span>
                       </td>
                    </tr>
                  );
                })}
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

export default ProjectDetails;