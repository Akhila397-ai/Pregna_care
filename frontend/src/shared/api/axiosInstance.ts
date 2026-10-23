
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  requestId?: string;
}

export interface AppAxiosError extends AxiosError<ApiErrorResponse> {
  userFriendlyMessage?: string;
  fieldErrors?: Record<string, string>;
}

interface RetriableAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiBaseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authPathsWithoutRefresh = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/resend-otp",
  "/auth/refresh-token",
  "/auth/logout",
];

let refreshPromise: Promise<string> | null = null;
let sessionExpiredEventDispatched = false;

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const appError = error as AppAxiosError;
    const responseData = error.response?.data;
    const status = error.response?.status;

    const originalRequest = error.config as
      | RetriableAxiosRequestConfig
      | undefined;

    const requestUrl = originalRequest?.url ?? "";

    const skipRefresh = authPathsWithoutRefresh.some((path) =>
      requestUrl.includes(path)
    );

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !skipRefresh
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          const refreshUrl =
            `${apiBaseURL.replace(/\/$/, "")}/auth/refresh-token`;

          refreshPromise = axios
            .post<{ token: string }>(
              refreshUrl,
              {},
              { withCredentials: true }
            )
            .then((response) => {
              const newToken = response.data?.token;

              if (typeof newToken !== "string" || !newToken) {
                throw new Error(
                  "Refresh response did not include an access token."
                );
              }

              sessionStorage.setItem("accessToken", newToken);
              sessionExpiredEventDispatched = false;

              return newToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch {
        sessionStorage.removeItem("accessToken");

        if (
          !sessionExpiredEventDispatched &&
          typeof window !== "undefined"
        ) {
          sessionExpiredEventDispatched = true;
          window.dispatchEvent(new Event("auth:session-expired"));
        }
      }
    }

    let userMessage = responseData?.message || responseData?.error;

    if (!error.response) {
      userMessage =
        "We're having trouble connecting. Please check your internet connection and try again.";
    } else if (status === 401) {
      sessionStorage.removeItem("accessToken");

      if (!userMessage) {
        userMessage = "Your session has expired. Please log in again.";
      }
    } else if (status === 403) {
      if (!userMessage) {
        userMessage = "You don't have permission to access this resource.";
      }
    } else if (status === 404) {
      if (!userMessage) {
        userMessage = "The requested information could not be found.";
      }
    } else if (status === 409) {
      if (!userMessage) {
        userMessage =
          "An account or entry with this information already exists.";
      }
    } else if (status === 429) {
      userMessage = "Too many requests. Please wait a moment and try again.";
    } else if (status && status >= 500) {
      userMessage =
        responseData?.message ||
        "Something went wrong on our side. Please try again later.";
    } else if (!userMessage) {
      userMessage = "Please check the entered information.";
    }

    appError.userFriendlyMessage = userMessage;
    appError.fieldErrors = responseData?.errors || {};

    return Promise.reject(appError);
  }
);

export default axiosInstance;
