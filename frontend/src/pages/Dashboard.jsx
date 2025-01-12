import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth); // Check for logged-in user

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <nav>
          <Link to="/users">Users</Link>
          <Link to="/products">Products</Link>
        </nav>
      </header>
      <main>
        {user ? (
          <Outlet /> // Render child routes (Users or Products)
        ) : (
          <p>Please log in to manage Users and Products.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
