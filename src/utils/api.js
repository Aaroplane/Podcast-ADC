import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Logout callback — set by AuthContext so the interceptor can trigger a
// proper React-based logout (clear state + navigate) without coupling to React.
let logoutHandler = null;
export const setLogoutHandler = (fn) => {
  logoutHandler = fn;
};

// Mutex: prevents multiple concurrent refresh requests when several 401s fire at once.
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

// --- Request Interceptor ---
// Auto-attaches the Bearer token from localStorage to every outgoing request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
// On 401/403 → attempt silent refresh via POST /auth/refresh.
// On success → store new tokens, retry the original request.
// On failure → clear auth state and redirect to login.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh for 401/403, and not for auth endpoints themselves
    // (to avoid infinite loops), and not for requests already retried.
    const status = error.response?.status;
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/") ||
      originalRequest.url?.includes("/login");

    if ((status === 401 || status === 403) && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Another refresh is already in-flight — queue this request.
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call the refresh endpoint directly with a plain axios instance
        // (not `api`) to avoid triggering this interceptor recursively.
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        // Store the rotated tokens
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Retry all queued requests with the new token
        onRefreshed(data.token);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — session is dead. Clear everything and redirect.
        refreshSubscribers = [];
        if (logoutHandler) {
          logoutHandler();
        } else {
          // Fallback: clear manually if AuthContext hasn't registered yet
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
