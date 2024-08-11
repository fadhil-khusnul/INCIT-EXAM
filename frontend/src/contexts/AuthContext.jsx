import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'; // Import js-cookie
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      const accessToken = Cookies.get('accessToken');
      try {
        if (accessToken) {
          setToken(accessToken);

          const userProfile = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/user-profile`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setUserData(userProfile.data);

          setIsAuthenticated(true);
        }

      } catch (error) {
        console.log(error);
      }

    };

    fetchData();
  }, []);


  const logout = () => {

    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
    });
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    const userData = { email, password };
    
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, userData, {
            withCredentials: true, // If your backend uses cookies for auth
        });

        console.log(response);

        // Redirect the user to the dashboard
        if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl;
        }

        return response.data; // Return the response data
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        throw error; // Throw the error so that it can be caught in handleSubmit
    }
};









  return (
    <AuthContext.Provider value={{ token, isAuthenticated, logout, user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
