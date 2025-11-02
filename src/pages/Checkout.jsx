import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'cash',
    deliveryTime: 'asap'
  });
  const [loading, setLoading] = useState(false);

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!formData.address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter email address');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const orderPayload = {
        items: cart.items.map(({ _id, quantity, price }) => ({ 
          menuItem: _id, 
          quantity,
          price 
        })),
        totalAmount: total,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        deliveryTime: formData.deliveryTime
      };

      const response = await axios.post(`${apiUrl}/api/orders`, orderPayload);

      toast.success(`Order placed successfully! Confirmation sent to ${formData.email} and ${formData.phone}`, {
        autoClose: 5000
      });
      
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-green-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-green-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
          
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Enter your complete delivery address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., +1 234 567 8900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., your-email@example.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">We'll send order confirmation and updates to this email</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI/Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Delivery Time</label>
              <select
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="asap">As Soon As Possible (30-45 min)</option>
                <option value="1hour">In 1 Hour</option>
                <option value="2hours">In 2 Hours</option>
                <option value="evening">This Evening (6-8 PM)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
