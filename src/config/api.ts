/**
 * Centralized API Configuration
 * Reads the backend URL from environment variables.
 *
 * - In development:  http://localhost:5000       (from .env.development)
 * - In production:   https://eve-backend-xt14.onrender.com  (from .env.production)
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://eve-backend-xt14.onrender.com";

export default API_BASE_URL;
