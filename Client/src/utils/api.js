import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

// Axios interceptor: auto-refresh expired access token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.get(`${apiUrl}/api/user/refresh-token`, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        if (data?.data?.accessToken) {
          localStorage.setItem("accessToken", data.data.accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${data.data.accessToken}`;
          return axios(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const postData = async (url, formData, options = {}) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (response.ok) {
      return isJson ? await response.json() : { error: false, success: true };
    }

    if (isJson) {
      return await response.json();
    }

    return {
      error: true,
      success: false,
      message: `Request failed with status ${response.status}`,
    };
  } catch (err) {
    console.error("Error in postData:", err);
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const params = {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.get(apiUrl + url, params);
    return data;
  } catch (err) {
    return err;
  }
};

export const uploadImage = async (url, updatedData) => {
  const params = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "multipart/form-data",
    },
  };
  var response;
  await axios.put(apiUrl + url, updatedData, params).then((res) => {
    response = res;
  });
  return response;
};

export const editData = async (url, updatedData) => {
  const params = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  };
  var response;
  await axios.put(apiUrl + url, updatedData, params).then((res) => {
    response = res;
  });
  return response;
};

export const deleteData = async (url) => {
  const params = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  }
  const { data } = await axios.delete(apiUrl + url, params);
  return data;
};


