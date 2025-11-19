import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../components/NotificationContainer';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === 'password') {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0 && value.length > 0) {
        setErrors((prev) => ({ ...prev, password: passwordErrors[0] }));
      } else if (value.length > 0) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.password;
          return newErrors;
        });
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password && value.length > 0) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else if (value === formData.password && value.length > 0) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.length > 0 && !emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      } else if (value.length > 0) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }

    if (name === 'firstName' || name === 'lastName') {
      if (value.trim().length === 0 && value.length > 0) {
        setErrors((prev) => ({ ...prev, [name]: `${name === 'firstName' ? 'First' : 'Last'} name is required` }));
      } else if (value.trim().length > 0) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone || undefined,
        formData.address || undefined
      );
      showNotification('Account created successfully! Please login to continue.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed. Please try again.');
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(
          axiosError.response?.data?.message ||
            'Registration failed. Please check your information and try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.firstName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.lastName
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="123 Main St, City, State"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="At least 8 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              {formData.password.length > 0 && (
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-medium mb-1">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                      {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      {/[a-z]/.test(formData.password) ? '✓' : '○'} One lowercase letter
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      {/[0-9]/.test(formData.password) ? '✓' : '○'} One number
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '○'} One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
              {formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                <p className="mt-1 text-sm text-green-600">✓ Passwords match</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

