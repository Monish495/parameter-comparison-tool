import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      userName: username,
      password: password
    });

    if (response.data) {

      // 🔥 Normalize data
      const user = {
        name: response.data.userName,   // 👈 FIX HERE
        role: response.data.role
      };

      localStorage.setItem("user", JSON.stringify(user));
      return user;

    } else {
      throw new Error("Invalid username or password");
    }

  } catch (error) {
    throw new Error("Login failed");
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};