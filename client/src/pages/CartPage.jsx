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

  useEffect(() => {
    localStorage.setItem(`orderList_${cafeId}_${tableId}`, JSON.stringify(orderList));
  }, [orderList]);

  // const totalAmount = orderList.reduce((acc, item) => {
  //   const variantPrice = item.variant ? item.variant.variantPrice : 0;
  //   const addonPrice = item.addons ? item.addons.reduce((sum, addon) => sum + addon.addOnPrice, 0) : 0;
  //   const itemTotal = (item.dishPrice + variantPrice + addonPrice) * item.quantity;
  //   return acc + itemTotal;
  // }, 0);

  const totalAmount = orderList.reduce((acc, item) => {
      return acc + (item.dishPrice * item.quantity);
  }, 0);


  const finalAmount = (totalAmount * 1.075).toFixed(2);
  const tax = (totalAmount * 0.075).toFixed(2);

  const handleQuantityChange = (dishId, newQuantity) => {
    setOrderList(prevOrderList => {
      if (newQuantity === 0) {
        return prevOrderList.filter(item => item._id !== dishId);
      } else {
        return prevOrderList.map(item =>
          item._id === dishId ? { ...item, quantity: newQuantity } : item
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
        orderList: orderList.map(item => ({
          dishName: item.dishName,
          dishCategory: item.dishCategory,
          quantity: item.quantity,
          dishPrice: item.dishPrice,
          variant: item.variant ? { variantName: item.variant.variantName, variantPrice: item.variant.variantPrice } : null,
          addons: item.addons ? item.addons.map(addon => ({ addOnName: addon.addOnName, addOnPrice: addon.addOnPrice })) : [],
        })),
      };

      const response = await fetch(`/server/orderDetails/placeOrder/${cafeId}/${tableId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      <div className='relative h-[100vh]'>
        <div className='flex gap-5 shadow-2xl items-center p-2 px-3 mb-6'>
          <div onClick={() => navigate(`/order/${cafeId}/${tableId}/${customer}`)} className='opacity-60 scale-90'><FaArrowLeft /></div>
          <div className="text-lg font-montserrat-600">Cart</div>
        </div>

        <div className='font-montserrat-600 px-3 mb-4'>Your Order</div>
        
        {orderPlaced ? (
          <div className="text-center text-green-600 font-semibold">
            <p>Order placed successfully!</p>
            <button
              onClick={handleGoToHomePage}
              className="bg-blue text-white px-6 py-2 mt-3 rounded-2xl font-montserrat-600 hover:bg-opacity-90"
            >
              Order More
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col font-montserrat-500 gap-2 px-3">
              {orderList.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <div className='flex flex-col'>
                  <div className='flex flex-col gap-2'>
                    {orderList.map(item => (
                      <div key={item._id}>
                        <CartItemCard item={item} variant={item.variant} 
                          addons={item.addons} onQuantityChange={handleQuantityChange} />
                      </div>
                    ))}
                  </div>
                  <div className='mt-2 px-3 rounded-2xl text-sm shadow-[0_0_18px_rgba(0,0,0,0.15)]'>
                    <input type="text" placeholder='Add cooking requests...' className='py-2 outline-none w-full' />
                  </div>
                  <div className='font-montserrat-600 my-4'>Additional Details</div>
                  <div className='mt-2 px-3 py-1 flex justify-between items-center rounded-2xl text-sm shadow-[0_0_18px_rgba(0,0,0,0.15)]'>
                    <div>Tax</div>
                    <div>₹{tax}</div>
                  </div>
                </div>
              )}
            </div>

            {orderList.length > 0 && (
              <div className="absolute flex justify-between items-center bottom-0 z-50 pt-3 pb-8 w-full px-3 font-montserrat-500 shadow-[0_0_18px_rgba(0,0,0,0.3)]">
                <p>Total : ₹{finalAmount}</p>
                <button 
                  onClick={handlePlaceOrder} 
                  className="uppercase bg-blue text-white rounded-xl py-1 px-3 hover:bg-opacity-90"
                >
                  Proceed to Pay
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
