import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../components/NotificationContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Product } from '../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getProduct(productId);
      if (response.success && response.data) {
        const productData = response.data as any;
        const { reviews, ...product } = productData;
        setProduct(product as Product);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load product. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      showNotification(
        `Added ${quantity} ${product.name} to cart!`,
        'success'
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => id && fetchProduct(id)} />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/products')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="h-96 bg-gray-200 flex items-center justify-center mb-4">
              {(() => {
                const images = product.images && product.images.length > 0 
                  ? product.images 
                  : product.image 
                    ? [product.image] 
                    : [];
                const currentImage = images[selectedImageIndex];
                
                return currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-lg">No Image Available</div>
                );
              })()}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 px-4 pb-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden ${
                      selectedImageIndex === index
                        ? 'border-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="mb-4">
              <span className="text-4xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            </div>
            {product.rating > 0 && (
              <div className="mb-4">
                <span className="text-lg text-gray-700">
                  ⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            <div className="mb-6">
              {product.category && (
                <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>
              )}
              <p className="text-sm text-gray-500">
                Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </p>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <div className="mt-2">
                  <span className="text-lg text-gray-400 line-through mr-2">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    Save ${(product.compareAtPrice - product.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>{' '}
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4 mb-6">
              <label htmlFor="quantity" className="text-gray-700 font-medium">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

