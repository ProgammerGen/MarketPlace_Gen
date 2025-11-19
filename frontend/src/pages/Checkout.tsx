import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../components/NotificationContainer';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const shipping = 15.99;
  const total = subtotal + tax + shipping;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const response = await apiService.createOrder(
        orderItems,
        formData.shippingAddress || undefined,
        formData.paymentMethod
      );

      if (response.success) {
        clearCart();
        showNotification('Order placed successfully!', 'success');
        
        setTimeout(() => {
          navigate('/orders');
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to process payment. Please try again.';
      showNotification(errorMessage, 'error');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your shipping address"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>

                  {formData.paymentMethod !== 'paypal' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16),
                            })
                          }
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={16}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={formData.cardName}
                          onChange={(e) =>
                            setFormData({ ...formData, cardName: e.target.value })
                          }
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={formData.expiryDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                expiryDate: e.target.value
                                  .replace(/\D/g, '')
                                  .slice(0, 4)
                                  .replace(/(\d{2})(\d{0,2})/, '$1/$2'),
                              })
                            }
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={formData.cvv}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cvv: e.target.value.replace(/\D/g, '').slice(0, 3),
                              })
                            }
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Pay & Confirm'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Payment"
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Confirm Payment
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to proceed with this payment?
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This is a demo payment. No actual charges will be made.
            </p>
          </div>
        </div>
        </Modal>

      {isProcessing && (
        <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-700 font-medium">Processing your payment...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;

