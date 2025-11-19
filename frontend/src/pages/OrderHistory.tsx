import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Order } from '../types';

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.getOrders();
      if (response.success && response.data) {
        const sortedOrders = [...response.data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to load orders. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={fetchOrders} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order History</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          {orders.length === 0
            ? 'You have no orders yet'
            : `You have ${orders.length} order${orders.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No orders found</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.split('-')[1] || order.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-lg font-bold text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-gray-900 font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        Subtotal: <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                      </p>
                      <p>
                        Tax: <span className="font-medium">${order.tax.toFixed(2)}</span>
                      </p>
                      <p>
                        Shipping: <span className="font-medium">${order.shipping.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

