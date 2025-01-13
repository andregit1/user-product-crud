import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '../features/usersSlice';
import UserForm from '../components/UserForm';

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
    setEditUser(null);
    setFormVisible(true);
  };

  if (!loggedInUser) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-gray-500 text-lg">Please log in to view and manage users.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <button 
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Create User
        </button>
      </div>

      {/* Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <UserForm
              user={editUser}
              onClose={() => setFormVisible(false)}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : list.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users available. Start by creating one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;