import React, { useState, useEffect } from 'react';
import { FaSquare, FaMinus, FaPlus } from 'react-icons/fa';

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
    <div className='relative flex flex-col justify-start items-center w-[160px] h-[200px] p-2 pt-5 rounded-md shadow-md bg-base2'>
      {/* Dish type icon */}
      <div className='absolute top-1 left-1 scale-95'>
        {dish.dishType === 'VEG' ? (
          <div className='text-green'>
            <FaSquare className='rounded-md'/>
          </div>
        ) : (
          <div className='text-red'>
            <FaSquare className='rounded-md'/>
          </div>
        )}
      </div>

      {/* Dish name */}
      <div className='uppercase text-sm mb-1 font-bold w-full bg-base4 p-1 rounded-md text-center'>
        {dish.dishName}
      </div>

      {/* Dish description and price */}
      <div className='flex flex-col justify-center items-start p-1 font-semibold bg-base4 rounded-md w-full h-full overflow-hidden'>
        <div
          className='text-xs uppercase break-words max-h-16 overflow-hidden text-ellipsis text-center w-full'
          style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
        >
          {dish.dishDescription}
        </div>
        <div className='text-sm uppercase mt-auto border-t-2 w-full text-center'>{`Rs.${dish.dishPrice}`}</div>
      </div>

      {/* Conditional rendering for Add button or Quantity input */}
      {showAddButton ? (
        <div className='flex justify-center items-center w-full bg-base3 hover:opacity-90 mt-1 rounded-md'>
          <button 
            className='text-base4 text-sm uppercase font-bold w-full p-1'
            onClick={handleAddClick}
          >
            Add
          </button>
        </div>
      ) : (
        <div className='flex justify-between w-full px-1 bg-base3 mt-1 rounded-md'>
          <button onClick={decrementQuantity}>
            <FaMinus />
          </button>
          <span className='bg-base4 w-1/2 text-center'>{quantity}</span>
          <button onClick={incrementQuantity}>
            <FaPlus />
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderItemCard;
