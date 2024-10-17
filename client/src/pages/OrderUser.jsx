import React, { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import OrderItemCard from '../components/OrderItemCard';

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

    // Go to Cart Page with the orderList
    const goToCart = () => {
        navigate(`/order/cart/${cafeId}/${tableId}`, { state: { orderList } });
    };

    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex justify-between p-3 uppercase text-2xl font-bold text-base3 bg-base1'>
                <div>{`${cafeName}`}</div>
                <button className='hover:text-base4' onClick={goToCart}><FaShoppingBag /></button>
            </div>
            <div className='flex flex-col'>
                <div className='flex flex-col gap-3 flex-wrap p-2 mt-2'>
                    <div className='font-semibold uppercase text-xl text-base3'>Welcome to {cafeName}!</div>
                    <div className='text-md'>We’re delighted to serve you! Explore our wide variety of delicious dishes.</div>
                    <div className='text-lg'>What would you like to order today?</div>
                </div>
                <div className='bg-base3 flex flex-col justify-center items-center p-3 gap-3'>
                    <h1 className='text-base4'>We have a variety of categories. What would you like to try?</h1>
                    <label className='uppercase font-semibold' htmlFor="category">Select a category</label>
                    <select 
                        className='w-full rounded-full p-1 px-2 uppercase' 
                        name="category" 
                        id="category" 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">-- Select a category --</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}      
                    </select>
                </div>
                <div className='flex flex-wrap justify-center py-3 px-4 gap-3'>
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
                        <div>No dishes available for this category</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderUser;
