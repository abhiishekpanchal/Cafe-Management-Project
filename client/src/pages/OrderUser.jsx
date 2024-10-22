import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import SearchLogo from '../assets/searchLogo.png';
import { useNavigate, useParams } from 'react-router-dom';
import OrderItemCard from '../components/OrderItemCard';
import CategoryCard from '../components/CategoryCard';

function OrderUser() {
    const { cafeId, tableId } = useParams();
    const navigate = useNavigate();
    const [cafeName, setCafeName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize orderList from localStorage if available
    const [orderList, setOrderList] = useState(() => {
        const savedOrderList = localStorage.getItem(`orderList_${cafeId}_${tableId}`);
        return savedOrderList ? JSON.parse(savedOrderList) : [];
    });

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
                setError(`Error: ${data.message}`);
            }
        } catch (err) {
            setError('Failed to fetch dishes');
        }
    };

    // Fetch dishes once when component mounts
    useEffect(() => {
        fetchCategoryDishes();
    }, [cafeId]);

    // Filter dishes based on selected category
    useEffect(() => {
        if (selectedCategory) {
            const filtered = dishes.filter(dish => dish.dishCategory === selectedCategory && dish.dishStatus === true);
            setFilteredDishes(filtered);
        } else {
            setFilteredDishes([]);
        }
    }, [selectedCategory, dishes]);

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

    return (
        <div className='flex flex-col w-full h-full mb-3'>
            {/* HEADER */}
            <div className='flex justify-between items-center py-3 pl-3 capitalize'>
                <div className='flex flex-col'>
                    <div className='font-montsarret font-montserrat-700 text-xl'>{`${cafeName}`}</div>
                    <div className='font-montsarret font-montserrat-400 text-xs'>Table : {`${tableId}`}</div>
                </div>
                <button className='rounded-full scale-50 border-2 border-gray'>
                    <img src={SearchLogo} alt="Search Logo" className='scale-75' />
                </button>
            </div>

            {/* MAIN SECTION */}
            <div className='flex flex-col items-center'>
                
                <div className='flex justify-center items-center p-2 mb-6 rounded-xl border-2 border-gray w-[90%] h-[140px]'>
                    IMAGE
                </div>
                
                <div className='flex flex-col justify-evenly py-2 w-full border-y-2 border-gray'>
                    <div className='font-montsarret font-montserrat-700 uppercase pl-3 pb-2 mb-[-2px]'>Explore Now</div>
                    <div className='h-[160px] flex justify-start items-center gap-2 px-3 overflow-x-scroll scrollbar-hide'>
                        {categories.length === 0 ? (
                            <div>No categories</div>
                        ) : (
                            categories.map((category, index) => (
                                <CategoryCard 
                                    key={index}
                                    dishCategory={category}
                                />
                            ))
                        )}
                    </div>    
                </div>


                <div className='flex flex-col justify-evenly py-2 w-full'>
                    <div className='font-montsarret font-montserrat-700 uppercase pl-3 mb-[-2px]'>For You</div>
                    <div className='h-[160px] w-full flex flex-col justify-start items-start gap-2 pl-3 pt-3'>
                    {dishes.length > 0 ? (
                        dishes.map(dish => (
                            <div key={dish._id}>
                                <OrderItemCard 
                                    dish={dish}
                                    onAddToOrder={handleAddToOrder}
                                />
                            </div>
                        ))
                    ) : (
                        <div>No dishes available</div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderUser;
