import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const cartItemCount = getTotalItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              Marketplace
            </Link>
            {isAuthenticated && (
              <Link
                to="/products"
                className="hidden sm:block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Products
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-blue-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  title="Cart"
                >
                  <span className="hidden sm:inline">Cart</span>
                  <span className="sm:hidden">🛒</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="hidden sm:block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Orders
                </Link>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-blue-600 px-2 sm:px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    <span className="hidden sm:inline">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.name || user?.email}
                    </span>
                    <span className="sm:hidden">
                      {user?.firstName?.[0] || user?.name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                    <svg
                      className="ml-1 h-4 w-4 hidden sm:block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                    <Link
                      to="/products"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 sm:hidden"
                    >
                      Products
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 sm:hidden"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

