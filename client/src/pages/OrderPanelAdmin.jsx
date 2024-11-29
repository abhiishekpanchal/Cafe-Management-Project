import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminItemCard from '../components/AdminItemCard';
import OrderList from '../components/OrderList';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar2 } from '@/components/app-sidebar2';
import AddImages from '@/components/AddImages';

function OrderPanelAdmin() {
    const { cafeId } = useParams(); 
    const [cafeName, setCafeName] = useState('');
    const [categories, setCategories] = useState([]);
    const [addons, setAddons] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPanel, setSelectedPanel] = useState('orders');
    const [showImagePopup, setShowImagePopup] = useState(false);

    const navigate = useNavigate();

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
                if(res.ok) {
                    setOrdersList(data);
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


    const updateAddonStatus = async (addonName, addonPrice, newStatus) => {
        const token = getToken();
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`/server/cafeDetails/updateAddonStatus/${cafeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ addon_name: addonName, addon_price: addonPrice, addon_status: newStatus })
            });

            if (response.ok) {
                console.log('Addon status updated successfully');
                setAddons((prevAddons) =>
                    prevAddons.map((addon) =>
                        addon.addon_name === addonName && addon.addon_price === addonPrice
                            ? { ...addon, addon_status: newStatus }
                            : addon
                    )
                );
            } else {
                console.error('Failed to update addon status');
            }
        } catch (error) {
            console.error('Error updating addon status:', error);
        }
    };

    const handleAddonStatusToggle = (addonName, addonPrice, currentStatus) => {
        const newStatus = !currentStatus;
        updateAddonStatus(addonName, addonPrice, newStatus);
    };

    const openImagePopup = () => setShowImagePopup(true);
    const closeImagePopup = () => setShowImagePopup(false);

    const handleContentView = (content) => {
        setSelectedPanel(content);
      };

    return (
        <div className='w-full flex overflow-hidden'>
            
            {/* SIDEBAR */}
            <SidebarProvider>
              <AppSidebar2 Categories={categories} Addons={addons} 
                onCategoryChange={handleCategoryChange} CafeName={cafeName}
                handleContentView={handleContentView} />
              <SidebarTrigger />
            </SidebarProvider>

            {/* CONTENT SECTION */}
            <div className="flex flex-col justify-start items-start w-[2000vw] p-4 gap-3 overflow-hidden">
            
                <div className='pt-6 pb-3 px-4 self-end flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <div onClick={openImagePopup} className='bg-blue text-white font-montsarret font-montserrat-400 text-lg rounded-full px-6 py-1 cursor-pointer'>Add Images</div>
                        <div className='rounded-full border-2 p-1.5'><FaArrowLeft /></div>
                    </div>
                </div>

                {/* Pop-up overlay and content */}
                {showImagePopup && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <AddImages categories={categories} handleAddImagesPopup={closeImagePopup} cafeId={cafeId} />
                    </div>
                )}

                <div className='flex overflow-hidden w-full'>
                    <div className='flex justify-start self-start w-full px-4 gap-3'>
                        <div className="flex flex-wrap justify-center gap-4 sm:justify-start w-full items-start max-h-[78vh] overflow-y-auto pb-5">
                            {selectedPanel === 'orders' ? (
                                <>
                                    {ordersList.length > 0 ? (
                                        ordersList.map((order, index) => (
                                            <OrderList 
                                                key={index}
                                                order={order}
                                            />
                                        ))
                                    ) : (
                                        <div>No orders available.</div>
                                    )}
                                </>
                            ) : selectedPanel === 'category' ? (
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
                                    {addons.length > 0 ? (
                                        addons.map((addon, index) => (
                                            <div key={index} className="flex justify-between items-center py-3 px-5 bg-[#0158A11A] rounded-2xl w-full">
                                                <div className="text-lg font-montserrat-600 uppercase">{addon.addon_name}</div>
                                                <div className='flex gap-5 items-center'>
                                                    <div className="text-sm">Price: Rs {addon.addon_price}</div>
                                                    <div className='w-5 h-5 flex justify-center items-center rounded-full cursor-pointer border-2 border-black overflow-hidden'
                                                    onClick={() => handleAddonStatusToggle(addon.addon_name, addon.addon_price, addon.addon_status)}>
                                                        {addon.addon_status ? (
                                                        <div className='text-black scale-75'>
                                                            <FaCheck />
                                                        </div>
                                                        ) : (
                                                        <></>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No addons available.</div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPanelAdmin;
