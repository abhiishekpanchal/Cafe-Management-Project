import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import OrderItemCard from '../components/OrderItemCard';

function CategoryWiseDishes() {
    const { cafeId, tableId, category, customer } = useParams();
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dishType, setDishType] = useState('BOTH'); 
    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();

    const [orderList, setOrderList] = useState(() => {
        const savedOrderList = localStorage.getItem(`orderList_${cafeId}_${tableId}`);
        return savedOrderList ? JSON.parse(savedOrderList) : [];
    });

    // Fetch dishes once when component mounts
    useEffect(() => {
        const fetchCategoryDishes = async () => {
            try {
                const res = await fetch(`/server/menuDetails/getMenu/${cafeId}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                    },
                });
                const data = await res.json();
                if (res.ok) {
                    setDishes(data.dishes);
                } else {
                    console.log(`Error: ${data.message}`);
                }
            } catch (err) {
                console.log('Failed to fetch dishes');
            }
        };
        fetchCategoryDishes();
    }, [cafeId]);

    // Filter dishes based on category, status, and dish type
    useEffect(() => {
        let filtered = dishes.filter(dish => 
            dish.dishCategory === category &&
            dish.dishStatus === true &&
            (dishType === 'BOTH' || dish.dishType === dishType)
        );

        if (searchTerm) {
            filtered = filtered.filter(dish => dish.dishName.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setFilteredDishes(filtered);
    }, [dishes, category, dishType, searchTerm]);

    // Save orderList to localStorage whenever it updates
    useEffect(() => {
        localStorage.setItem(`orderList_${cafeId}_${tableId}`, JSON.stringify(orderList));
    }, [orderList, cafeId, tableId]);

    // Function to handle adding or updating a dish in the orderList
    const handleAddToOrder = (dish, quantity) => {
        const existingDishIndex = orderList.findIndex(item => item._id === dish._id);
        if (existingDishIndex !== -1) {
            const updatedOrderList = [...orderList];
            updatedOrderList[existingDishIndex].quantity = quantity;
            setOrderList(updatedOrderList);
        } else {
            setOrderList([...orderList, { ...dish, quantity }]);
        }
    };

    // Function to handle changes in the select dropdown
    const handleDishTypeChange = (e) => {
        setDishType(e.target.value);
    };

    return (
        <div className='flex flex-col'>
            {/* Header */}
            <div className='flex flex-col gap-2 py-2'>
                <div className='flex gap-4 items-center px-2'>
                    <FaArrowLeft onClick={() => navigate(`/order/${cafeId}/${tableId}/${customer}`)} className='h-5 w-5 opacity-60 scale-[80%]' />
                    <div className='uppercase font-montserrat-600'>{category}</div>
                </div>
                <div className='flex justify-between text-xs shadow-xl pb-4 px-2'>
                    <div className='flex items-center py-1 px-1 pr-1.5 rounded-full border-2 border-gray'>
                        <select 
                            name="DishType" 
                            id="dish-type" 
                            className='outline-none font-montserrat-400 text-sm'
                            value={dishType}
                            onChange={handleDishTypeChange} // Add onChange to update dishType state
                        >
                            <option value="VEG">Pure-Veg</option>
                            <option value="NON-VEG">Non-Veg</option>
                            <option value="BOTH">Both</option>
                        </select>
                    </div>
                    <div className='flex items-center justify-between px-2 rounded-full border-2 border-gray'>
                        <input type="search" placeholder='Search in Menu' value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)}
                         className='mx-1 font-montserrat-400 outline-none'/>
                        <FaSearch className='h-4 w-4 opacity-60 cursor-pointer' />
                    </div>
                </div>

                {/* Main Section */}
                <div>
                    <div className='font-montserrat-700 text-xl p-3 uppercase'>{category}</div>
                    <div className='flex flex-col gap-2 px-3'>
                        {filteredDishes.length > 0 ? (
                            filteredDishes.map(dish => (
                                <div key={dish._id}>
                                    <OrderItemCard 
                                        dish={dish}
                                        onAddToOrder={handleAddToOrder}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className='text-sm font-montserrat-400'>No dishes available at the moment. Try another category!</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryWiseDishes;
