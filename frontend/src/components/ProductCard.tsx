import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../components/NotificationContainer';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { showNotification } = useNotification();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    showNotification(`Added ${product.name} to cart!`, 'success');
  };

  return (
    <Link to={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {(() => {
            const imageUrl = product.images && product.images.length > 0 
              ? product.images[0] 
              : product.image;
            return imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            ) : null;
          })()}
          {(!product.images || product.images.length === 0) && !product.image && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
              {product.rating > 0 && (
                <p className="text-sm text-gray-500">
                  ⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

