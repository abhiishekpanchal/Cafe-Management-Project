import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminItemCard from '../components/AdminItemCard';
import OrderList from '../components/OrderList';

function OrderPanelAdmin() {
    const { cafeId } = useParams(); 
    const [cafeName, setCafeName] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPanel, setSelectedPanel] = useState('orders');

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

    useEffect(() => {
        const fetchOrders = async() => {
            try {
                const res = await fetch(`/server/orderDetails/getOrders/${cafeId}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    },
                });
                const data = await res.json();
                console.log(data);
                if(res.ok) {
                    setOrdersList(data);
                    console.log(ordersList);
                }
                else {
                    setError(`Error: ${data.message}`);
                }
            } catch(error) {
                setError('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [cafeId]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

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
    
    useEffect(() => {
        fetchCategoryDishes();
    }, [cafeId]);
    
    useEffect(() => {
        if (selectedCategory) {
            const filtered = dishes.filter((dish) => dish.dishCategory === selectedCategory);
            setFilteredDishes(filtered);
        } else {
            setFilteredDishes([]);
        }
    }, [selectedCategory, dishes]);

    return (
        <div className='h-screen flex flex-col overflow-y-hidden'>
            {/* HEADER */}
            <div className='pt-8 px-4 text-2xl flex justify-between items-center'>
                <div className='text-4xl font-montsarret font-montserrat-700 uppercase'>{cafeName} - Admin Panel</div>
                <div className='bg-blue text-white font-montsarret font-montserrat-300 text-lg rounded-full px-6 py-1'>Add Images</div>
            </div>

            <div className='flex h-full overflow-hidden'>
                {/* LEFT COLUMN */}
                <div className='flex flex-col justify-start items-center scale-95 gap-3 pt-6 pb-2 h-[580px] w-1/3 border-r-2 border-gray'>
                    {/* Orders Radio */}
                    <div className={`flex gap-3 rounded-full py-2 pl-6 font-montsarret font-montserrat-500 text-lg w-[70%] items-center ${selectedPanel === 'orders' ? 'shadow-[0_0_5.4px_2px_#3295E8]' : 'border-2 border-[#C6C6C6]'} overflow-hidden`}>
                        <input
                            type='radio'
                            name='admin'
                            id='orders'
                            checked={selectedPanel === 'orders'}
                            onChange={() => setSelectedPanel('orders')}
                            hidden
                        />
                        <label htmlFor='orders'>ORDERS</label>
                    </div>

                    {/* Availability Radio */}
                    <div className={`flex gap-3 rounded-full py-2 pl-6 font-montsarret font-montserrat-500 text-lg w-[70%] items-center ${selectedPanel === 'availability' ? 'shadow-[0_0_5.4px_2px_#3295E8]' : 'border-2 border-[#C6C6C6]'} overflow-hidden`}>
                        <input
                            type='radio'
                            name='admin'
                            id='availability'
                            checked={selectedPanel === 'availability'}
                            onChange={() => setSelectedPanel('availability')}
                            hidden
                        />
                        <label htmlFor='availability'>AVAILABILITY</label>
                    </div>

                    {/* Conditional rendering for categories */}
                    {selectedPanel === 'availability' && (
                        <div className='h-[400px] flex flex-col items-start gap-2 border-2 border-blue rounded-3xl w-[60%] overflow-y-auto'>
                            {loading && <div>Loading categories...</div>}
                            {error && <div>{error}</div>}
                            {!loading && !error && categories.length > 0 && (
                                <div className='flex flex-col w-full p-2 pt-4 gap-2'>
                                    {categories.map((category) => (
                                        <div key={category} className='flex gap-2 p-1 pl-3 rounded-3xl bg-blue text-white uppercase text-md'>
                                            <input
                                                type='radio'
                                                name='category'
                                                id={category}
                                                value={category}
                                                checked={selectedCategory === category}
                                                onChange={() => handleCategoryChange(category)}
                                            />
                                            <label htmlFor={category}>{category}</label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className='flex flex-wrap w-full sm:w-2/3 p-4 pt-9 pb-2 gap-3'>
                    <div className="flex flex-wrap w-full gap-4 justify-center sm:justify-start items-start max-h-[620px] overflow-y-auto pb-5">
                        {selectedPanel==='availability' ? (
                        <>
                            {filteredDishes.length > 0 ? (
                            filteredDishes.map((dish, index) => (
                                <AdminItemCard
                                key={index} 
                                dishName={dish.dishName}
                                dishDescription={dish.dishDescription}
                                dishPrice={dish.dishPrice}
                                dishCategory={dish.dishCategory} 
                                dishType={dish.dishType}
                                dishStatus={dish.dishStatus}
                                />
                            ))
                            ) : (
                            <div>No dishes available in this category.</div>
                            )}
                        </>
                        ) : (
                        <>
                            {ordersList.length > 0 ? (
                                ordersList.map((order, index) => (
                                    <OrderList 
                                    key={index}
                                    tableId = {order.tableId}
                                     />
                                ))
                            ) : (
                                <div>No orders available.</div>
                            )}
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPanelAdmin;
