import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
// import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Products from '../pages/Products';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/" element={<Dashboard />}>
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
