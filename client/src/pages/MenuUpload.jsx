import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import SignOutLogo from '../assets/signOutLogo.png';
import RemoveLogo from '../assets/removeLogo.png';
import AddRingLogo from '../assets/addRingLogo.png';
import PizzaLogo from '../assets/pizzaLogo.png';
import CurrencyLogo from '../assets/currencyLogo.png';
import DescriptionLogo from '../assets/descriptionLogo.png';
import CrossLogo from '../assets/crossLogo.png';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';

function MenuUpload() {
  const { cafeId } = useParams();
  const navigate = useNavigate();
  
  const [cafeName, setCafeName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showDishForm, setShowDishForm] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishType, setDishType] = useState('VEG');

  // Function to get the token from localStorage
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/server/cafeDetails/getCafeDetails/${cafeId}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`, 
          },
        });
        const data = await res.json();
        if (res.ok) {
          setCafeName(data.name);
          setCategories(data.categories);
        } else {
          setError(`Error: ${data.message}`);
        }
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [cafeId]);

  const fetchCategoryDishes = async (category) => {
    try {
      const res = await fetch(`/server/menuDetails/getMenu/${cafeId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      
      if (res.status === 404) {
        // If no dishes are found, clear dishes and show message
        setFilteredDishes([]);
        setError(`No dishes found in this category`);
      } else if (res.ok) {
        // If dishes are found, filter them based on category
        const filtered = data.dishes.filter((dish) => dish.dishCategory === category);
        setDishes(data.dishes); 
        setFilteredDishes(filtered); 
        setError(null); 
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (err) {
      setError('Failed to fetch dishes');
    }
  };
  

  // Handle category selection and trigger fetch for dishes
  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    fetchCategoryDishes(category); 
  };
  
  // Handle addition of category
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const res = await fetch(`/server/cafeDetails/postCategory/${cafeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`, 
          },
          body: JSON.stringify({ category: newCategory }),
        });
        const data = await res.json();
        if (res.ok) {
          setCategories((prevCategories) => [...prevCategories, newCategory]);
          setNewCategory('');
          setShowInput(false);
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Handle deletion of the category
  const handleDeleteCategory = async (category) => {
    try {
      const res = await fetch(`/server/cafeDetails/deleteCategory/${cafeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`, 
        },
        body: JSON.stringify({ category }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat !== category)
        );
        if (category === selectedCategory) {
          setSelectedCategory(null);
          setFilteredDishes([]);
        }
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  // Handle addition of the dish
  const handleAddDish = async (e) => {
    e.preventDefault();
    if (selectedCategory) {
      try {
        const res = await fetch(`/server/menuDetails/addDish/${cafeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ dishName, dishDescription, dishPrice, dishCategory: selectedCategory, dishType }),
        });
        const data = await res.json();
        if (res.ok) {
          setFilteredDishes((prevDishes) => [...prevDishes, { dishName, dishDescription, dishPrice, dishCategory: selectedCategory, dishType }]);
          setShowDishForm(false);
          setDishName('');
          setDishDescription('');
          setDishPrice('');
          setDishType('VEG'); 
        } else {
          setError(`Error: ${data.message}`);
        }
      } catch (err) {
        setError('Failed to add dish');
      }
    }
  };

  // Handle deletion of a dish
  const handleDeleteDish = async (dishName, dishCategory) => {
    try {
      const res = await fetch(`/server/menuDetails/deleteDish/${cafeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ dishName, dishCategory }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // Update filteredDishes state
        setFilteredDishes((prevDishes) => 
           prevDishes.filter((dish) => dish.dishName !== dishName && dish.dishCategory !== dishCategory)
        );
        console.log("Dish deleted:", dishName, dishCategory);
      } else {
        setError(`Error: ${data.message}`);
      }
    } catch (err) {
      setError('Failed to delete dish');
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cafeId');
    navigate('/'); 
  };

  return (
    <div className="w-full flex flex-col">

      <div className="flex justify-between items-cente bg-base1 pt-8 px-4">
        <div className='uppercase font-montsarret font-montserrat-700 text-4xl text-black'>{cafeName}</div>
        <div className='flex items-center gap-4'>
          <button onClick={() => navigate(`/admin/${cafeId}`)} className='border-blue border-2 shadow-[0_0_8.7px_5px_#0158A124] rounded-full py-1 px-6 font-montsarret font-montserrat-700'>Order Panel</button>
          <button onClick={() => navigate(`/menu/${cafeId}/getQR`)} className='bg-blue rounded-full py-1 px-12 font-montsarret font-montserrat-700 text-white shadow-[0_0_8.7px_5px_#0158A124]'>Get QR</button>
          <div onClick={handleLogOut} className='text-2xl rounded-full border-2 border-[#C6C6C6] scale-90'>
            <img src={SignOutLogo} alt="Sign Out Logo" className='h-[42px] w-[42px] scale-75' />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-start">
        {/* CATEGORY SECTION */}
        <div className="flex flex-col pt-6 scale-95 pb-2 w-full sm:w-1/3 sm:h-[580px] overflow-y-auto border-[#C6C6C6] border-b-4 sm:border-r-2 sm:border-b-0 border-base1">
          <div className="w-[70%] flex flex-col justify-start gap-4 mx-auto">
            
            {/* Add Category Button */}
            <button 
              className="p-2 text-lg rounded-full border-2 text-white bg-blue shadow-[0_0_4px_2px_#0158A124] hover:opacity-95" 
              onClick={() => setShowInput(true)}
            >
              Add a category
            </button>

            {/* New Category Input Area */}
            {showInput && (
              <div className="flex items-center justify-between rounded-full border-2 border-[#C6C6C6]">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New Category"
                  className="ml-6 w-[75%] outline-none"
                />
                <button 
                  className="py-3 px-0 w-[20%] flex justify-center items-center bg-blue rounded-full text-white hover:opacity-90"
                  onClick={handleAddCategory}
                >
                  <FaCheck />
                </button>
              </div>
            )}

            {loading ? (
              <div>Loading categories...</div>
            ) : error ? (
              <div>{error}</div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <div key={category} className={`flex relative gap-3 rounded-full py-2 pl-6 items-center ${selectedCategory === `${category}` ? 'shadow-[0_0_5.4px_2px_#3295E8]' : 'border-2 border-[#C6C6C6]'} overflow-hidden`}>
                  <input 
                    type="radio" 
                    name="categories" 
                    id={category} 
                    onChange={() => handleCategorySelection(category)} 
                    checked={selectedCategory === category} 
                    hidden
                  />
                  <label htmlFor={category} className="text-lg font-montsarret font-montserrat-500 uppercase">
                    {category}
                  </label>
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 hover:bg-base3 text-white scale-90"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <img src={RemoveLogo} alt="Remove Logo" className='w-[42px] h-[42px]'/>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-lg text-center text-base1">Please add your first category</div>
            )}
          </div>
        </div> 

        {/* ITEMS SECTION */}
        <div className="flex flex-wrap pt-10 w-full sm:w-2/3 p-4 pb-0 gap-3">
          <div className="flex flex-wrap w-full gap-4 justify-center sm:justify-start max-h-[580px] overflow-y-auto pb-5">
            {/* Add New Dish Section */}
            {selectedCategory && (
              <button 
                className="absolute right-8 bottom-8 flex items-center justify-center gap-4 text-xl border-2 py-2 px-5 bg-blue z-50 text-white rounded-full hover:opacity-90"
                onClick={() => setShowDishForm((prev) => !prev)}
              >
                <img src={AddRingLogo} alt="Add Ring Logo" className='h-[42px] w-[42px]' />
                <div>Add Dish</div>
              </button>
            )}

            {selectedCategory ? (
              <>
                {filteredDishes.length > 0 ? (
                  filteredDishes.map((dish, index) => (
                    <ItemCard
                      key={index}
                      dishname={dish.dishName}
                      dishdescription={dish.dishDescription}
                      dishprice={dish.dishPrice}
                      dishCategory={selectedCategory}
                      dishType={dish.dishType}
                      dishStatus={dish.dishStatus}
                      onDelete={handleDeleteDish}
                    />
                  ))
                ) : (
                  <div>No dishes available in this category.</div>
                )}
              </>
            ) : (
              <div className="text-lg text-center">Please select a category to view dishes</div>
            )}
          </div>

          {/* Dish Form Popup */}
          {showDishForm && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
              <div className="bg-white rounded-3xl px-8 pt-12 pb-5 w-[470px] scale-90 relative">
                <h2 className="text-2xl font-montsarret font-montserrat-700 mb-4 py-2 text-center uppercase">Add Dish to {selectedCategory}</h2>
                <form onSubmit={handleAddDish} className="flex flex-col gap-4">
                  <div className='border-2 border-gray rounded-2xl flex items-center gap-1 py-1'>
                    <img src={PizzaLogo} alt="Pizza Logo" className='h-[42px] w-[42px] ml-1 scale-75' />
                    <input
                      type="text"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="dish name"
                      className="outline-none p-1 border-l-2"
                      required
                    />
                  </div>
                  <div className='border-2 border-gray rounded-2xl flex items-center gap-1 py-1'>
                    <img src={DescriptionLogo} alt="Description Logo" className='h-[42px] w-[42px] ml-1 pl-2 py-2 scale-75' />
                    <input
                      type="text"
                      value={dishDescription}
                      onChange={(e) => setDishDescription(e.target.value)}
                      placeholder="dish description"
                      className="outline-none p-1 border-l-2"
                      maxLength={150}
                      required
                    />
                  </div>
                  <div className='border-2 border-gray rounded-2xl flex items-center gap-1 py-1'>
                    <img src={CurrencyLogo} alt="Currency Logo" className='h-[42px] w-[42px] ml-1 scale-75' />
                    <input
                    type="number"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    placeholder="dish price"
                    className="outline-none p-1 border-l-2 w-[83%]"
                    min={0}
                    required
                  />
                  </div>

                  
                  <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 
                    ${dishType === 'VEG' ? 'bg-[#008D38]' : 'bg-[#D80303]'}`} onClick={() => setDishType(dishType === 'VEG' ? 'NON-VEG' : 'VEG')}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 
                      ${dishType === 'VEG' ? 'translate-x-0' : 'translate-x-7'}`}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="bg-blue text-lg text-white py-2 px-6 mb-3 rounded-2xl uppercase hover:opacity-90"
                  >
                    Add Dish
                  </button>
                </form>
                <button 
                  className="absolute right-2 top-2 scale-75"
                  onClick={() => setShowDishForm(false)} 
                >
                  <img src={CrossLogo} alt="Cross Logo" className='h-[42px] w-[42px]' />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuUpload;
