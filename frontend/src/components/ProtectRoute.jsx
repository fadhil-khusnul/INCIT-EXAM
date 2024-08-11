// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = !!Cookies.get('accessToken'); // Check if the accessToken exists

  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Element /> : <Navigate to="/login" replace />}
    />
  );
};

export default ProtectRoute;
