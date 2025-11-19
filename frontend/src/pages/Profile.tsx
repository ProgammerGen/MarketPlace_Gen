import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { User } from '../types';

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: typeof user.address === 'string' ? user.address : '',
      });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load profile. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await apiService.updateProfile(formData);
      if (response.success && response.data) {
        setUser(response.data);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to update profile. Please try again.';
      setError(errorMessage);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error && !user) {
    return <ErrorMessage message={error} onRetry={fetchProfile} />;
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-5 sm:py-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} />
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError('');
                    setFormData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      phone: user.phone || '',
                      address: typeof user.address === 'string' ? user.address : '',
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    First Name
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.firstName || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Last Name
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.lastName || 'Not set'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <p className="text-lg text-gray-900">{user.phone || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Address
                </label>
                <p className="text-lg text-gray-900">
                  {typeof user.address === 'string' && user.address
                    ? user.address
                    : 'Not set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Role
                </label>
                <p className="text-lg text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

