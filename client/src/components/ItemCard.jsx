import React from 'react';
import { useParams } from 'react-router-dom';
import VegLogo from '../assets/vegLogo.png';
import NonVegLogo from '../assets/nonvegLogo.png';
import RemoveLogo from '../assets/removeLogo.png';

function ItemCard({ dishname, dishdescription, dishprice, dishType, dishCategory, onDelete }) {
  const { cafeId } = useParams();

  const handleDeleteDish = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`/server/menuDetails/deleteDish/${cafeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ dishname, dishCategory })
      });
      const data = await response.json();

      if (data.success) {
        onDelete(dishname, dishCategory);
      }

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='relative flex flex-col justify-start items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 pt-7 border-blue rounded-3xl border-2'>
      {/* Dish type icon */}
      <div className='absolute top-1 left-1 scale-150'>
        {dishType === 'VEG' ? (
          <div className='text-green'>
            <img src={VegLogo} alt="Veg Logo" className='h-[42px] w-[42px] scale-50' />
          </div>
        ) : (
          <div className='text-red'>
             <img src={NonVegLogo} alt="NonVeg Logo" className='h-[42px] w-[42px] scale-50' />
          </div>
        )}
      </div>

      {/* Delete icon */}
      <div className='absolute top-1 right-1 scale-125'>
        <button onClick={handleDeleteDish} className='text-base4 scale-75'>
          <img src={RemoveLogo} alt="Remove Logo" className='h-[42px] w-[42px] scale-75' />
        </button>
      </div>

      {/* Dish name */}
      <div className='capitalize text-lg font-montsarret font-montserrat-700 mt-4 w-full p-1 rounded-md'>
        {dishname}
      </div>

      {/* Dish description and price */}
      <div className='flex flex-col justify-center items-start p-1 font-semibold bg-base4 rounded-md w-full overflow-hidden'>
        <div className='text-sm capitalize font-montserrat-500 font-montsarret'>{`Price - Rs ${dishprice}`}</div>
        <div
          className='text-xs font-montsarret font-montserrat-400 capitalize break-words max-h-20 overflow-hidden text-ellipsis w-full my-2'
          style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
        >
          {dishdescription}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
