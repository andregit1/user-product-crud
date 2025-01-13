import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../features/usersSlice';

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUser: user, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUser(id));
  }, [dispatch, id]);

  if (loading) return <div className="text-center p-6 text-gray-500">Loading user details...</div>;
  if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-center p-6 text-gray-500">User not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <div className="mb-4">
        <strong>ID:</strong> {user.id}
      </div>
      <div className="mb-4">
        <strong>Name:</strong> {user.name}
      </div>
      <div className="mb-4">
        <strong>Email:</strong> {user.email}
      </div>
      <div className="mt-6">
        <Link
          to="/users"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Back to Users
        </Link>
      </div>
    </div>
  );
};

export default UserDetails;
