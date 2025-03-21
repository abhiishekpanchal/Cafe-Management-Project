import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { FaArrowLeft } from 'react-icons/fa';

function CartPage() {
  const { cafeId, tableId, customer } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialOrderList = JSON.parse(localStorage.getItem(`orderList_${cafeId}_${tableId}`)) || location.state?.orderList || [];
  
  const [orderList, setOrderList] = useState(initialOrderList);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cookingRequest, setCookingRequest] = useState('');

  useEffect(() => {
    localStorage.setItem(`orderList_${cafeId}_${tableId}`, JSON.stringify(orderList));
  }, [orderList]);

  const finalAmount = orderList.reduce((acc, item) => {
      return acc + (item.dishPrice * item.quantity);
  }, 0);

  const handleQuantityChange = (dishId, variant, addons, newQuantity) => {
    setOrderList(prevOrderList => {
      if (newQuantity === 0) {
        // Filter out the specific dish based on all identifying parameters
        return prevOrderList.filter(item => 
          !(item._id === dishId && 
            JSON.stringify(item.variant) === JSON.stringify(variant) && 
            JSON.stringify(item.addons) === JSON.stringify(addons))
        );
      } else {
        // Update the specific dish (variant and addons included) by matching all parameters
        return prevOrderList.map(item =>
          item._id === dishId &&
          JSON.stringify(item.variant) === JSON.stringify(variant) &&
          JSON.stringify(item.addons) === JSON.stringify(addons) 
            ? { ...item, quantity: newQuantity } 
            : item
        );
      }
    });
  };
  

  const handlePlaceOrder = async () => {
    try {
      if (orderList.length === 0) {
        setError("Your cart is empty.");
        return;
      }
  
      const orderData = {
        cafeId,
        tableId,
        customer,
        cookingRequest,
        orderList: orderList.map(item => ({
          dishName: item.dishName,
          dishCategory: item.dishCategory,
          quantity: item.quantity,
          dishPrice: item.dishPrice || 0, 
          dishVariants: item.variant
            ? { variantName: item.variant.variantName, variantPrice: item.variant.variantPrice || 0 }
            : { variantName: "Default", variantPrice: 0 }, 
          dishAddOns: item.addons
            ? item.addons.map(addon => ({
                addOnName: addon.addOnName,
                addOnPrice: addon.addOnPrice || 0, 
              }))
            : [],
        })),
      };
  
      const response = await fetch(`/server/orderDetails/placeOrder/${cafeId}/${tableId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        localStorage.removeItem(`orderList_${cafeId}_${tableId}`);
        setOrderList([]);
        setOrderPlaced(true);
      } else {
        console.log(result.message || "Error placing order. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  
  
  const handleGoToHomePage = () => {
    navigate(`/order/${cafeId}/${tableId}/${customer}`);
  };

  return (
    <div>
      <div className='relative bg-user_bg'>
        <div className='flex gap-5 shadow-xl items-center p-2 px-3 mb-5'>
          <div onClick={() => navigate(`/order/${cafeId}/${tableId}/${customer}`)} className='opacity-60 scale-90'><FaArrowLeft /></div>
          <div className="text-lg font-montserrat-600">Cart</div>
        </div>

        {!orderPlaced && <div className='font-montserrat-600 px-3 mb-2.5'>Your Order</div>}
        
        {orderPlaced ? (
          <div className="text-center text-green-600 font-semibold">
            <p>Order placed successfully!</p>
            <button
              onClick={handleGoToHomePage}
              className="bg-user_blue text-black px-6 py-2 mt-3 rounded-2xl font-montserrat-600 hover:bg-opacity-90"
            >
              Order More
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col font-montserrat-500 gap-2 px-3 pb-28 h-[70vh] overflow-y-auto">
              {orderList.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <div className='flex flex-col'>
                  <div className='flex flex-col gap-1.5 mb-1 pt-1.5'>
                    {orderList.map((item,index) => (
                      <div key={index}>
                        <CartItemCard item={item} variant={item.variant} 
                          addons={item.addons} onQuantityChange={handleQuantityChange} />
                      </div>
                    ))}
                  </div>
                  <div className='mt-2'>
                    <div className='font-montserrat-600 mb-1 text-sm'>Additional Details</div>
                    <div className='rounded-xl text-sm shadow-[0_0_18px_rgba(0,0,0,0.15)] bg-user_comp'>
                      <input type="text" 
                        placeholder='Add cooking requests...' 
                        className='py-2 px-1.5 outline-none w-full rounded-2xl bg-user_comp' 
                        value={cookingRequest} 
                        onChange={(e) => setCookingRequest(e.target.value)}/>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {orderList.length > 0 && (
              <div className="absolute flex justify-between items-center bottom-0 z-50 pt-3 pb-6 w-full px-3 font-montserrat-500 shadow-[0_0_18px_rgba(0,0,0,0.3)] bg-user_comp">
                <p>Total : ₹{finalAmount}</p>
                <button 
                  onClick={handlePlaceOrder} 
                  className="uppercase bg-user_blue text-black rounded-xl py-1 px-3 hover:bg-opacity-90"
                >
                  Confirm Order
                </button>
              </div>
            )}
          </>
        )}
        
      </div>
    </div>
  );
}

export default CartPage;
