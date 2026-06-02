import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, TrendingUp, Target, DollarSign } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { deleteProject } from '../store/slices/projectSlice';
import toast from 'react-hot-toast';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const percentage = ((project.currentCapital || project.investedCapital || 0) / (project.capital || project.targetCapital || 1)) * 100;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await dispatch(deleteProject(project.id)).unwrap();
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'open' || status === 'Open') return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
         onClick={() => navigate(`/projects/${project.id}`)}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{Math.min(percentage, 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Target Capital</p>
              <p className="text-sm font-semibold text-gray-700">
                ${(project.capital || project.targetCapital || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Raised Capital</p>
              <p className="text-sm font-semibold text-green-600">
                ${(project.currentCapital || project.investedCapital || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${project.id}`);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye size={16} /> View
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;