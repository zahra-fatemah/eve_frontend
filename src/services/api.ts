import axios from "axios";

/**
 * Axios instance for Eve Beauty Care API.
 * - baseURL points to the backend (proxied in dev via Vite, or direct URL)
 * - Request interceptor automatically attaches JWT from localStorage
 * - Response interceptor catches 401 and redirects to admin login
 */

// Use direct backend URL — works with any frontend server setup
const API_BASE = typeof window !== "undefined"
  ? "http://localhost:5000/api"   // Client-side: call backend directly
  : "http://localhost:5000/api";  // Server-side (SSR): also direct

const API = axios.create({
  baseURL: API_BASE,
});

// ──── Request Interceptor: Attach JWT ────
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("eve-admin-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ──── Response Interceptor: Handle 401 ────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Clear stored token and redirect to login
      localStorage.removeItem("eve-admin-token");
      localStorage.removeItem("eve-admin-email");

      // Only redirect if currently on an admin page (not on public shop pages)
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// =============================================
// Admin APIs
// =============================================

export const adminLogin = (email: string, password: string) =>
  API.post("/admin/login", { email, password });

export const getAdminProfile = () => API.get("/admin/profile");

// =============================================
// Product APIs
// =============================================

export const getProducts = () => API.get("/products");

export const getProduct = (id: string) => API.get(`/products/${id}`);

export const createProduct = (formData: FormData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id: string, formData: FormData) =>
  API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id: string) => API.delete(`/products/${id}`);

// =============================================
// Order APIs
// =============================================

export const placeOrder = (orderData: {
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    notes?: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  deliveryCharge: number;
}) => API.post("/orders", orderData);

export const getOrders = () => API.get("/orders");

export const getOrder = (id: string) => API.get(`/orders/${id}`);

export const updatePaymentStatus = (id: string, paymentStatus: string) =>
  API.patch(`/orders/${id}/payment`, { paymentStatus });

export const updateOrderStatus = (id: string, orderStatus: string) =>
  API.patch(`/orders/${id}/status`, { orderStatus });

export const deleteOrder = (id: string) => API.delete(`/orders/${id}`);

export const getDashboardStats = () => API.get("/orders/stats");

export default API;
