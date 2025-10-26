import { API, setUserRole } from "./globalState";

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    if (response.ok) {
      const data = await response.json();
      setUserRole(data.userType);
      return "good";
    } else {
      const error = await response.json();
      throw new Error(error.error || "Login failed.");
    }
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};
