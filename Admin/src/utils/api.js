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

export const postData = async (url, formData) => {
  try {
    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.json();
      return error;
    }
  } catch (err) {
    console.error("Error in postData:", err);
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const params = {
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

export const uploadImages = async (url, formData) => {
  const params = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "multipart/form-data",
    },
  };
  var response;
  await axios.post(apiUrl + url, formData, params).then((res) => {
    response = res;
  });
  return response;
};

export const deleteImages = async (url) => {
  const params = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  }
  const { data } = await axios.delete(apiUrl + url, params);
  return data;
};


export const deleteData = async (url) => {
  const params = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  }
  const { res } = await axios.delete(apiUrl + url, params);
  return res;
};

export const deleteMultipleData = async (url, ids) => {
  const params = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    data: { ids }
  };
  const { data } = await axios.delete(apiUrl + url, params);
  return data;
};
