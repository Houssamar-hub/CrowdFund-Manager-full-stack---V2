import Projects from "../UI/pages/Projects";
import api from "./api";

const authService = {
    register: async (userData) => {
        const response = await api.post("/auth/signup", userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },

    logout : async()=>{
        const  response = await api.post('/auth/logout')
    }

};

export default authService