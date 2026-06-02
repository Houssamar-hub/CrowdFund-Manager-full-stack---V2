import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProject, updateProject } from '../store/slices/projectSlice';
import toast from 'react-hot-toast';

const ProjectForm = ({ initialData, isEditing = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    capital: '',
    minimumInvestment: '',
    maxPercentagePerInvestor: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        capital: initialData.capital || initialData.targetCapital || '',
        minimumInvestment: initialData.minimumInvestment || '',
        maxPercentagePerInvestor: initialData.maxPercentagePerInvestor || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const projectData = {
        ...formData,
        capital: parseFloat(formData.capital),
        minimumInvestment: parseFloat(formData.minimumInvestment),
        maxPercentagePerInvestor: parseFloat(formData.maxPercentagePerInvestor)
      };
      
      if (isEditing && initialData?.id) {
        await dispatch(updateProject({ id: initialData.id, data: projectData })).unwrap();
        toast.success('Project updated successfully');
      } else {
        await dispatch(createProject(projectData)).unwrap();
        toast.success('Project created successfully');
      }
      navigate('/projects');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update project' : 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Title *
        </label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter project title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          required
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Describe your project..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Capital ($) *
          </label>
          <input
            type="number"
            name="capital"
            required
            min="0"
            step="1000"
            value={formData.capital}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., 100000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Investment ($) *
          </label>
          <input
            type="number"
            name="minimumInvestment"
            required
            min="0"
            value={formData.minimumInvestment}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., 1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Percentage per Investor (%) *
          </label>
          <input
            type="number"
            name="maxPercentagePerInvestor"
            required
            min="1"
            max="100"
            value={formData.maxPercentagePerInvestor}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., 30"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isEditing ? 'Update Project' : 'Create Project')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;