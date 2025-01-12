import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '../features/usersSlice';
import UserForm from '../components/UserForm';
import '../styles/users.css';

const Users = () => {
  const { list, loading, error } = useSelector((state) => state.users);
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isFormVisible, setFormVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchUsers());
    }
  }, [dispatch, loggedInUser]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormVisible(true);
  };

  const handleCreate = () => {
    setEditUser(null); // Reset form for creating a new user
    setFormVisible(true);
  };

  if (!loggedInUser) {
    return <p>Please log in to view and manage users.</p>;
  }

  return (
    <div className="users-page">
      <div className="header">
        <h2>Users</h2>
        <button className="create-button" onClick={handleCreate}>Create User</button>
      </div>

      {isFormVisible && (
        <UserForm
          user={editUser}
          onClose={() => setFormVisible(false)}
        />
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : list.length === 0 ? (
        <p>No users available. Start by creating one.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
