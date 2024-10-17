import React, { useState, useEffect } from 'react';
import { FaSquare, FaTrash } from 'react-icons/fa';
import NonVegLogo from '../assets/nonvegLogo.png';
import VegLogo from '../assets/vegLogo.png';
import { useParams } from 'react-router-dom';

function AdminItemCard({ dishName, dishDescription, dishPrice, dishType, dishCategory }) {
  const { cafeId } = useParams();
  
  const [isChecked, setIsChecked] = useState(true);  

  // Fetch the stored value of dishStatus on component mount
  useEffect(() => {
    const fetchDishStatus = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error('No token found');
        return;
      }
  
      try {
        // Encode dishName and dishCategory to handle spaces and special characters
        const encodedDishName = encodeURIComponent(dishName);
        const encodedDishCategory = encodeURIComponent(dishCategory);
  
        const res = await fetch(`/server/menuDetails/getDishStatus/${cafeId}/${encodedDishName}/${encodedDishCategory}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        console.log(res.ok);
        if (res.ok) {
          const { dishStatus } = await res.json(); 
          setIsChecked(dishStatus); 
        } else {
          console.error('Failed to fetch dish status, status code:', res.status);
        }
  
      } catch (error) {
        console.error('Error fetching dish status:', error);
      }
    };
  
    fetchDishStatus();
  }, [cafeId, dishName, dishCategory]);
  

  // Function to handle updating dish availability status
  const onToggleStatus = async (dishName, newStatus) => {
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await fetch(`/server/menuDetails/updateDishStatus/${cafeId}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ dishName, dishCategory, dishStatus: newStatus })
      });
  
      if (response.ok) {
        console.log('Dish status updated successfully');
      } else {
        console.error('Failed to update dish status');
      }
    } catch (error) {
      console.error('Error updating dish status:', error);
    }
  };
  


  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    const newStatus = !isChecked; 
    setIsChecked(newStatus); 
    onToggleStatus(dishName, newStatus); 
  };

  return (
    <div className='relative flex flex-col justify-start items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3 pt-7 border-blue rounded-3xl border-2'>
      {/* Dish type icon */}
      <div className='absolute top-1 left-1'>
        {dishType === 'VEG' ? (
          <img src={VegLogo} alt="Veg Logo" className='h-[30px] w-[30px] m-1' />
        ) : (
          <img src={NonVegLogo} alt="Non Veg Logo" className='h-[42px] w-[42px]' />
        )}
      </div>

      {/* Dish name */}
      <div className='text-lg font-montsarret font-montserrat-700 w-full p-1 pt-3'>
        {dishName}
      </div>

      <div className='flex w-full justify-start pl-1 gap-2 text-sm font-montsarret font-montserrat-400'>
        <input
          type="checkbox"
          name="status"
          id="status"
          checked={isChecked}
          onChange={handleCheckboxChange} 
        />
        <label htmlFor="status">Available</label>
      </div>
    </div>
  );
}

export default AdminItemCard;
