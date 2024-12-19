import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import OrderItemCard from '../components/OrderItemCard';
import DishPopup from '../components/DishPopUp'; 

function CategoryWiseDishes() {
    const { cafeId, tableId, category, customer } = useParams();
    const [dishes, setDishes] = useState([]);
    const [addons, setAddons] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dishType, setDishType] = useState('BOTH');
    const [selectedDish, setSelectedDish] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAddons, setSelectedAddons] = useState([]);

    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();

    const [orderList, setOrderList] = useState(() => {
        const savedOrderList = localStorage.getItem(`orderList_${cafeId}_${tableId}`);
        return savedOrderList ? JSON.parse(savedOrderList) : [];
    });

    useEffect(() => {
            const fetchCafeAddOns = async () => {
                try {
                    const res = await fetch(`/server/cafeDetails/getCafeDetails/${cafeId}`, {
                        headers: {
                            'Authorization': `Bearer ${getToken()}`,
                        },
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setAddons(data.addons);
                    } else {
                        setError(`Error: ${data.message}`);
                    }
                } catch (err) {
                    setError('Failed to fetch categories');
                } finally {
                    setLoading(false);
                }
            };
    
            fetchCafeAddOns();
        }, [cafeId]);

    // Fetch dishes when component mounts
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
                    console.log("Fetched Dishes:", data.dishes); // Debugging
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
            filtered = filtered.filter(dish =>
                dish.dishName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredDishes(filtered);
    }, [dishes, category, dishType, searchTerm]);

    // Save orderList to localStorage whenever it updates
    useEffect(() => {
        localStorage.setItem(`orderList_${cafeId}_${tableId}`, JSON.stringify(orderList));
    }, [orderList, cafeId, tableId]);

    // Function to handle adding or updating a dish in the orderList
    const handleAddToOrder = (dish, variant = {}, addons = [], quantity = 1) => {
        const updatedOrderList = [...orderList];
    
        // Ensure variant is always an object
        const validVariant = variant || {};
    
        // Replace dish price with variant price if a variant exists, else use the dish price
        const basePrice = validVariant.variantPrice || dish.dishPrice || 0;
    
        // Calculate total price for addons
        const addonPrice = addons.reduce((total, addon) => total + (addon.addOnPrice || 0), 0);
    
        // Total price = base price (variant or dish) + addons
        const totalDishPrice = basePrice + addonPrice;
    
        // Find the existing item with the same dish, variant, and addons
        const existingIndex = updatedOrderList.findIndex(item => 
            item._id === dish._id &&
            item.dishName === dish.dishName &&
            JSON.stringify(item.variant) === JSON.stringify(validVariant) && // Compare variants as strings
            JSON.stringify(item.addons) === JSON.stringify(addons) // Compare addons as strings
        );
        
        if (existingIndex > -1) {
            // If dish exists, update its quantity and price
            const updatedItem = { ...updatedOrderList[existingIndex] };
            updatedItem.quantity += quantity;
            updatedItem.dishPrice = totalDishPrice * updatedItem.quantity; // Recalculate price
            updatedOrderList[existingIndex] = updatedItem; // Replace the old item
        } else {
            // Add a new item
            const updatedDish = {
                ...dish,
                dishPrice: totalDishPrice,
                variant: validVariant, 
                addons, 
                quantity: quantity
            };
            updatedOrderList.push(updatedDish);
        }
    
        // Update the state
        setOrderList(updatedOrderList);
        setShowPopup(false);
    };

    // Function to open the dish popup
    const handleDishClick = (dish) => {
        console.log("Selected Dish:", dish); // Debugging
        setSelectedDish(dish);
        const existingDish = orderList.find(item => item._id === dish._id);
        if (existingDish) {
            setSelectedVariant(existingDish.variant);
            setSelectedAddons(existingDish.addons);
        } else {
            setSelectedVariant(null);
            setSelectedAddons([]);
        }
        setShowPopup(true);
    };

    // Function to handle changes in the select dropdown
    const handleDishTypeChange = (e) => {
        setDishType(e.target.value);
    };

    return (
        <div className='flex flex-col'>
            {/* Header */}
            <div className='flex gap-4 items-center px-2 py-2'>
                <FaArrowLeft
                    onClick={() => navigate(`/order/${cafeId}/${tableId}/${customer}`)}
                    className='h-5 w-5 opacity-60 scale-[80%]'
                />
                <div className='uppercase font-montserrat-600'>{category}</div>
            </div>

            {/* Filters */}
            <div className='flex justify-between px-2 pb-4 shadow-xl'>
                <select
                    name='DishType'
                    id='dish-type'
                    className='outline-none font-montserrat-400 text-sm border rounded-full p-1'
                    value={dishType}
                    onChange={handleDishTypeChange}
                >
                    <option value='VEG'>Pure-Veg</option>
                    <option value='NON-VEG'>Non-Veg</option>
                    <option value='BOTH'>Both</option>
                </select>
                <div className='flex border rounded-full px-2'>
                    <input
                        type='search'
                        placeholder='Search in Menu'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='outline-none font-montserrat-400'
                    />
                    <FaSearch className='h-4 w-4 opacity-60' />
                </div>
            </div>

            {/* Dish List */}
            <div className='p-3'>
                {filteredDishes.map((dish) => (
                    <OrderItemCard
                        key={dish._id}
                        dish={dish}
                        onAddToOrder={() => handleDishClick(dish)}
                    />
                ))}
            </div>

            {/* DishPopUp */}
            {showPopup && (
                <>
                {console.log("Addons passed to DishPopup:", selectedDish.dishAddOns)}
                {console.log("Addons passed to DishPopup:", selectedDish)}
                <DishPopup 
                    dish={selectedDish}
                    onClose={() => setShowPopup(false)}
                    onAddToOrder={handleAddToOrder}
                    addons={addons}
                    selectedVariant={selectedVariant}
                    selectedAddons={selectedAddons} 
                />
                </>
            )}

            {/* STICKY CART BLOCK */}
            {orderList.length > 0 && (
                <div
                    className="fixed bottom-2 w-11/12 left-3 rounded-2xl bg-blue text-white z-20 transition-all duration-300"
                    style={{ transform: `translateY(${orderList.length > 0 ? '0' : '100%'})` }}
                >
                    <div className="flex justify-between items-center px-4 py-2">
                        <div className="font-montserrat-400 text-md">
                            {`${orderList.length} item(s) in cart`}
                        </div>
                        <button
                            className="bg-white text-blue p-1 px-4 py-1 rounded-xl font-montserrat-600"
                            onClick={() => navigate(`/order/${cafeId}/${tableId}/${customer}/cart`)}
                        >
                            View Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryWiseDishes;
