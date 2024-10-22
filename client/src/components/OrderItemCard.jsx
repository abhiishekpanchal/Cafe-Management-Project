import React, { useState, useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import VegLogo from '../assets/vegLogo.png';
import NonVegLogo from '../assets/nonvegLogo.png';

function OrderItemCard({ dish, onAddToOrder }) {
  const [showAddButton, setShowAddButton] = useState(true);
  const [quantity, setQuantity] = useState(0); 

  useEffect(() => {
    if (quantity > 0) {
      onAddToOrder(dish, quantity);
    }
  }, [quantity]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);

  const decrementQuantity = () => {
    if (quantity === 1) {
      setShowAddButton(true); 
      setQuantity(0);
    } else {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddClick = () => {
    setShowAddButton(false);
    setQuantity(1);
  };

  return (
    <div className='flex justify-between items-center w-[93vw] h-[120px] px-2 pb-3 rounded-2xl border-2 border-gray'>

      {/* Dish name, price and description */}
      <div className='flex flex-col justify-between gap-1'>
        <div className='flex flex-col justify-start items-start mb-2'>
          <div className='capitalize text-md font-montsarret font-montserrat-600 w-full rounded-xl'>
            {dish.dishName}
          </div>
          <div className='font-montsarret font-montserrat-500 text-sm mt-auto w-full'>{`Rs.${dish.dishPrice}`}</div>
        </div>
    
        <div
          className='text-xs font-montsarret font-montserrat-400 break-words max-h-16 overflow-hidden text-ellipsis w-full'
          style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
        >
          {dish.dishDescription}
        </div>
      </div>

      {/* Add button and type */}
      <div className='flex flex-col justify-between h-full items-end pb-1'>
          {dish.dishType === 'VEG' ? (
            <div className='scale-[65%]'>
              <img src={VegLogo} alt="Veg Logo" className='h-[42px] w-[42px]' />
            </div>
          ) : (
            <div className='scale-[65%]'>
              <img src={NonVegLogo} alt="Non Veg Logo" className='h-[42px] w-[42px]' />
            </div>
          )}

        {/* Conditional rendering for Add button or Quantity input */}
        <div>
          {showAddButton ? (
            <div className='flex justify-center items-center bg-blue hover:opacity-90 px-2 rounded-full'>
              <button 
                className='text-white uppercase font-montsarret font-montserrat-700 text-xs px-2 py-1'
                onClick={handleAddClick}
              >
                Add
              </button>
            </div>
          ) : (
            <div className='flex justify-between px-2 bg-blue mt-1 rounded-xl'>
              <button onClick={decrementQuantity}>
                <FaMinus className='text-white scale-75 pr-1' />
              </button>
              <span className='text-center bg-white px-2'>{quantity}</span>
              <button onClick={incrementQuantity}>
                <FaPlus className='text-white scale-75 pl-1' />
              </button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default OrderItemCard;
