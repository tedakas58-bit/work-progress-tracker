import React from 'react';
import Navbar from '../components/Navbar';

const TestAdmin = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar user={user} onLogout={onLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 Admin Dashboard Test</h1>
          <p className="text-lg text-gray-600 mb-4">
            Congratulations! You've successfully accessed the admin area.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-800 mb-2">User Information:</h2>
            <ul className="text-green-700">
              <li><strong>Username:</strong> {user?.username}</li>
              <li><strong>Role:</strong> {user?.role}</li>
              <li><strong>Branch:</strong> {user?.branchName}</li>
              <li><strong>Email:</strong> {user?.email}</li>
            </ul>
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Admin Features Available:</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Create new users (any role)</li>
              <li>Reset user passwords</li>
              <li>Delete users from system</li>
              <li>Monitor system statistics</li>
              <li>View all user activity</li>
            </ul>
          </div>
          <div className="mt-6">
            <button 
              onClick={() => window.location.href = '/admin'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Go to Full Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdmin;