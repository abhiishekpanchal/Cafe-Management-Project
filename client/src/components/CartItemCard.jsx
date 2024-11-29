import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import VegLogo from '../assets/vegLogo.png';
import NonVegLogo from '../assets/nonvegLogo.png'

function CartItemCard({ item, variant, addons, onQuantityChange }) {
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
    <div className="flex justify-between items-center px-3 py-4 rounded-2xl shadow-[0_0_18px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col items-start justify-start">
        <div className="flex items-center gap-1.5 font-montserrat-500 capitalize">
          <div>
            {item.dishType === 'VEG' ? (
              <img src={VegLogo} alt="" className='h-3 w-3' />
            ) : (
              <img src={NonVegLogo} alt="" className='h-3 w-3' />
            )}
          </div>
          <div>
            {`${dishName.toLowerCase()} ${variant ? `- ${variant.variantName.toLowerCase()}` : ''}`}
          </div>
        </div>     
        {addons && (
          <div className='mt-0.5 font-montserrat-500 flex flex-col gap-1.5 text-gray text-xs'>
            {addons.map((addon, index) => (
              <div key={index} className='flex'>
                <span className='capitalize'>{addon.addOnName.toLowerCase()}</span>
                <span>(+{addon.addOnPrice})</span>
              </div>
            ))}
          </div>
        )} 
      </div>
      <div className="flex text-sm items-center gap-4">
          <div className='flex items-center rounded-full text-white py-1 bg-blue'>
            <button className="p-1 scale-[80%]" onClick={handleDecrement} disabled={quantity === 0}><FaMinus /></button>
            <span className="px-1">{quantity}</span>
             <button className="p-1 scale-[80%]" onClick={handleIncrement}><FaPlus /></button>
          </div>
          <div className='text-sm font-montserrat-600'>₹{dishPrice*quantity}</div>
      </div>
    </div>
  );
}

export default CartItemCard;
