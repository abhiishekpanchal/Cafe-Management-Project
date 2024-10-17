import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

function CartItemCard({ item, onQuantityChange }) {
  const { _id, dishName, dishPrice, quantity } = item;

  // Handle quantity increment
  const handleIncrement = () => {
    onQuantityChange(_id, quantity + 1);
  };

  // Handle quantity decrement
  const handleDecrement = () => {
    onQuantityChange(_id, quantity - 1);
  };

  return (
    <div className="flex flex-col p-4 border-2 border-base3 bg-base4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="font-bold">{dishName}</div>
        <div className="flex items-center">
          <button className="p-1 bg-base3 rounded-md text-base4" onClick={handleDecrement} disabled={quantity === 0}><FaMinus /></button>
          <span className="px-2">{quantity}</span>
          <button className="p-1 bg-base3 rounded-md text-base4" onClick={handleIncrement}><FaPlus /></button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div>Price: ₹{dishPrice}</div>
        <div>Total: ₹{dishPrice * quantity}</div>
      </div>
    </div>
  );
}

export default CartItemCard;
