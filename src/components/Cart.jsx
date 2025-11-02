import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.items.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart ({cart.items.length} items)</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item._id} className="flex gap-4 border-b pb-4">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100 text-lg font-semibold"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 border-x min-w-[3rem] text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 text-lg font-semibold"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
