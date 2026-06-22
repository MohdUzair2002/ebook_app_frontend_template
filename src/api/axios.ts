import axios from "axios";

const instance = axios.create({
  // baseURL: "https://kitab-ghar-new-backend-production.up.railway.app/api/v1",
  baseURL: "https://api.darulishaatebooks.com/api/v1",
  // baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
