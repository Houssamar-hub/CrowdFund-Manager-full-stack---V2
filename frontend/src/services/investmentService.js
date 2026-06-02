import api from './api';

const investmentService = {
  // Faire un investissement
  invest: async (investmentData) => {
    const response = await api.post('/investment', investmentData);
    return response.data;
  },

  // Récupérer tous les investissements (admin)
  getAllInvestments: async () => {
    const response = await api.get('/admin/investments');
    return response.data;
  },
};

export default investmentService;