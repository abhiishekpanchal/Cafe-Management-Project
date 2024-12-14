import React from 'react';
import { useParams } from 'react-router-dom';
import VegLogo from '../assets/vegLogo.png';
import NonVegLogo from '../assets/nonvegLogo.png';
import RemoveLogo from '../assets/removeLogo.png';
import DropDown from './DropDown';

function ItemCard({ dishname, dishdescription, dishprice, dishType, dishCategory, dishVariants, dishAddOns, onDelete }) {
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
        body: JSON.stringify({ dishname, dishCategory }),
      });
  
      // Call onDelete directly after the request completes
      if (response.ok) {
        console.log("Dish deleted:", dishname);
        onDelete(dishCategory);
      } else {
        console.error("Failed to delete dish, server responded with:", response.status);
      }
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };
  

  return (
    <div className='relative flex flex-col justify-start items-center w-full md:w-[27%] max-h-[55%] py-3 pt-7 bg-[#0158A12A] rounded-3xl'>
      {/* Dish type icon */}
      <div className='absolute top-1 left-1 scale-110'>
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
      <div className='absolute top-1 right-1 scale-110'>
        <button onClick={handleDeleteDish} className='text-base4 scale-75'>
          <img src={RemoveLogo} alt="Remove Logo" className='h-[42px] w-[42px] scale-75' />
        </button>
      </div>

      {/* Dish name */}
      <div className='flex justify-between items-center w-full px-3 mt-4 mb-2'>
        <div className='capitalize text-sm font-montserrat-700 w-full rounded-md'>{dishname}</div>
        <div className='text-xs capitalize font-montserrat-500 font-montsarret whitespace-nowrap'>{`Price - Rs ${dishprice}`}</div>
      </div>

      <div className='w-full h-1 bg-white'></div>

      {/* Dish description and price */}
      <div className='flex flex-col justify-between h-full items-start gap-1 px-3 font-semibold bg-base4 rounded-md w-full'>
        <div className='text-xs font-montsarret font-montserrat-500 capitalize break-words max-h-20 text-ellipsis w-full my-2'
        style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {dishdescription}
        </div>
        <div className='w-full flex flex-col gap-2'>
          <DropDown title='Variants' listItems={dishVariants} />
          <DropDown title='Add-ons' listItems={dishAddOns} />
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
