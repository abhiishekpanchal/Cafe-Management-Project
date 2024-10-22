import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { FaArrowLeft } from 'react-icons/fa';

function CartPage() {
  const {cafeId, tableId} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialOrderList = JSON.parse(localStorage.getItem(`orderList_${cafeId}_${tableId}`)) || location.state?.orderList || [];
  
  const [orderList, setOrderList] = useState(initialOrderList);
  const [orderPlaced, setOrderPlaced] = useState(false); 

  useEffect(() => {
    localStorage.setItem(`orderList_${cafeId}_${tableId}`, JSON.stringify(orderList));
  }, [orderList]);

  const totalAmount = orderList.reduce((acc, item) => acc + item.dishPrice * item.quantity, 0);

  // Handle updating the quantity of an item in the cart
  const handleQuantityChange = (dishId, newQuantity) => {
    setOrderList((prevOrderList) => {
      if (newQuantity === 0) {
        return prevOrderList.filter(item => item._id !== dishId);
      } else {
        return prevOrderList.map(item =>
          item._id === dishId ? { ...item, quantity: newQuantity } : item
        );
      }
    });
  };

  // Handle placing the order
  const handlePlaceOrder = async () => {
    try {
      if (orderList.length === 0) {
        setError("Your cart is empty.");
        return;
      }
  
      const orderData = {
        cafeId,
        tableId,  
        orderList: orderList.map(item => ({
          dishName: item.dishName,
          dishCategory: item.dishCategory,
          quantity: item.quantity,
          dishPrice: item.dishPrice,  
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
        localStorage.removeItem('orderList');
        setOrderList([]);
        setOrderPlaced(true);
      } else {
        console.log(result.message || "Error placing order. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  
  // Navigate to OrderUser page
  const handleGoToHomePage = () => {
    navigate(`/order/${cafeId}/${tableId}`);
  };

  return (
    <div>
      {/* MAIN-SECTION */}
      <div>
        {/* Header */}
        <div className='flex gap-3 shadow-xl'>
          <div><FaArrowLeft /></div>
          <div className="bg-base1 text-base3 text-center text-2xl font-bold p-2 mb-2">Cart</div>
        </div>
        
        {/* Conditionally render success message or cart items */}
        {orderPlaced ? (
          <div className="text-center text-green-600 font-semibold">
            <p>Order placed successfully!</p>
            
            {/* Button to navigate to OrderUser page */}
            <button
              onClick={handleGoToHomePage}
              className="bg-base3 text-base4 px-6 py-2 mt-4 rounded-lg font-semibold hover:bg-opacity-90    "
            >
              Order More
            </button>
          </div>
        ) : (
          <>
            {/* Render the orderList items as CartItemCard components */}
            <div className="flex flex-col gap-2 px-2">
              {orderList.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                orderList.map((item) => (
                  <CartItemCard 
                    key={item._id} 
                    item={item} 
                    onQuantityChange={handleQuantityChange} 
                  />
                ))
              )}
            </div>

            {/* Total Amount Section */}
            {orderList.length > 0 && (
              <div className="mt-4 p-4 bg-gray-100 text-right text-lg font-semibold">
                <p>Total Amount: ₹{totalAmount}</p>
              </div>
            )}

            {/* Place Order Button */}
            {orderList.length > 0 && (
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={handlePlaceOrder} 
                  className="bg-base3 text-base4 px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90"
                >
                  Place Order
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
