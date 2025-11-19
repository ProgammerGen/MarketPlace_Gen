import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Product, ProductsQueryParams } from '../types';
import { useDebounce } from '../hooks/useDebounce';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, minPrice, maxPrice]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params: ProductsQueryParams = {
        search: debouncedSearch || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      };
      const response = await apiService.getProducts(params);
      if (response.success && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load products. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters =
    searchTerm || minPrice || maxPrice;

  if (error && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={fetchProducts} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          {isLoading
            ? 'Loading products...'
            : `Found ${products.length} product${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors sm:hidden"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div
          className={`${
            showFilters ? 'block' : 'hidden'
          } sm:block bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4 relative z-10`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="pt-2">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg mb-2">No products found</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters to see all products
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
