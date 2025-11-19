import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing products at great prices
          </p>
          {isAuthenticated ? (
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              Browse Products
            </Link>
          ) : (
            <div className="flex items-center justify-center space-x-4">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-block bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg border-2 border-blue-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

