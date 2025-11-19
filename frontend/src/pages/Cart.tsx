import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../components/NotificationContainer';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-800 font-medium text-sm"
        >
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.product.id} className="p-6 flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                {(() => {
                  const imageUrl = item.product.images && item.product.images.length > 0 
                    ? item.product.images[0] 
                    : item.product.image;
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  );
                })()}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.product.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  ${item.product.price.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="w-32 text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-600 hover:text-red-800 font-medium text-sm ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">
                Total: ${getTotalPrice().toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

