import axios from "axios";

const instance = axios.create({
  baseURL: "https://kitab-ghar-new-backend-production.up.railway.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
