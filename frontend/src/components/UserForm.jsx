import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../features/usersSlice';

const UserForm = ({ user, onClose }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user) {
      // Update user
      dispatch(updateUser({ id: user.id, name, email }));
    } else {
      // Create new user
      dispatch(createUser({ name, email }));
    }
    onClose(); // Close the form
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="user-form">
        <h2>{user ? 'Edit User' : 'Create User'}</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit">{user ? 'Update' : 'Create'}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
