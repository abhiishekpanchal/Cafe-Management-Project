import { useAuth } from '@/auth/AuthContext';
import React, { useState, useEffect } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { FaTimes } from 'react-icons/fa';

function OrderList({ order, refetchOrders }) {
  const [orders, setOrders] = useState([...order.orderList]);
  const { token, load } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [totalPrice, setTotalPrice] = useState(order.totalPrice);
  const [showRemoveAddon, setShowRemoveAddon] = useState(null);
  useEffect(() => {
    setOrders([...order.orderList]);
    setTotalPrice(order.totalPrice);
  }, [order]);

  useEffect(() => {
    const newTotal = orders.reduce((sum, item) => sum + item.price, 0);
    setTotalPrice(newTotal);
  }, [orders]);

  const handleStatusUpdate = async (status) => {
    try {
      const response = await fetch(
        `/server/cafeDetails/updateEarnings/${order.cafeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId: order._id, status }),
        }
      );

      if (!response.ok) throw new Error('Failed to update earnings');

      if (status === 'paid') {
        const updatedOrders = orders.map((item) => ({
          ...item,
          status: 'paid',
        }));
        setOrders(updatedOrders);
        setActiveDropdown(null);
      }

      refetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateItemStatus = async (itemIndex, newStatus) => {
    try {
      const response = await fetch(`/server/orderDetails/updateItemStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
          newStatus,
        }),
      });

      if (response.ok) {
        const updatedOrders = [...orders];
        updatedOrders[itemIndex].status = newStatus;
        setOrders(updatedOrders);
        setActiveDropdown(null);
        refetchOrders();
      } else {
        console.error('Failed to update item status');
      }
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const updateItemQuantity = async (e, itemIndex, newQuantity) => {
    e.stopPropagation();

    if (newQuantity < 1) return;

    try {
      const item = orders[itemIndex];
      const unitPrice = item.price / item.quantity;
      const newTotalItemPrice = unitPrice * newQuantity;

      const updatedOrders = [...orders];
      updatedOrders[itemIndex].quantity = newQuantity;
      updatedOrders[itemIndex].price = newTotalItemPrice;
      setOrders(updatedOrders);

      const response = await fetch(`/server/orderDetails/updateItemQuantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
          newQuantity,
          newPrice: newTotalItemPrice,
        }),
      });

      if (response.ok) {
        refetchOrders();
      } else {
        console.error('Failed to update item quantity');
        setOrders([...order.orderList]);
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setOrders([...order.orderList]);
    }
  };

  const removeItem = async (e, itemIndex) => {
    e.stopPropagation();

    try {
      const updatedOrders = orders.filter((_, idx) => idx !== itemIndex);
      setOrders(updatedOrders);
      setActiveDropdown(null);

      const response = await fetch(`/server/orderDetails/removeItem`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
        }),
      });

      if (response.ok) {
        refetchOrders();
      } else {
        console.error('Failed to remove item');
        setOrders([...order.orderList]);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setOrders([...order.orderList]);
    }
  };

  const removeAddon = async (e, itemIndex, addonIndex) => {
    e.stopPropagation();

    try {
      const updatedOrders = [...orders];
      const item = updatedOrders[itemIndex];
      const addonPrice = item.dishAddOns[addonIndex].addOnPrice;
      item.dishAddOns.splice(addonIndex, 1);
      item.price -= addonPrice * item.quantity;

      setOrders(updatedOrders);
      const response = await fetch(`/server/orderDetails/removeAddon`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          itemIndex,
          addonIndex,
        }),
      });

      if (response.ok) {
        refetchOrders();
      } else {
        console.error('Failed to remove addon');
        setOrders([...order.orderList]);
      }
    } catch (error) {
      console.error('Error removing addon:', error);
      setOrders([...order.orderList]);
    }
  };

  const toggleDropdown = (index) => {
    if (orders[index].status === 'paid') {
      return;
    }

    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const toggleShowRemoveAddon = (itemIndex) => {
    if (showRemoveAddon === itemIndex) {
      setShowRemoveAddon(null);
    } else {
      setShowRemoveAddon(itemIndex);
    }
  };

  return (
    <div className="flex flex-col gap-1 bg-[#0158A11A] rounded-xl py-3.5 min-w-[40vw] max-w-[50vw] flex-1">
      <div className="font-montserrat-600 px-3.5 text-lg capitalize">
        {order.customer}'s Order
      </div>
      <div className="flex justify-between px-3.5 font-montserrat-400 text-sm">
        <div>Table No. : {order.tableId}</div>
        <div>Total : Rs {totalPrice}</div>
      </div>
      <hr className="h-1.5 bg-white" />
      <div className="flex flex-col gap-3 py-2 px-3.5">
        <div className="bg-[#3295E866] rounded-xl py-2 h-[30vh] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white">
                <th className="text-left px-3 py-2 font-semibold">Item Name</th>
                <th className="text-center py-2 font-semibold">Status</th>
                <th className="text-center py-2 font-semibold">QTY</th>
                <th className="text-right px-3 py-2 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-white border-opacity-20"
                >
                  <td className="px-3 py-3">
                    <div className="font-semibold flex items-center">
                      {item.dishName}
                      {item.dishType === 'NON-VEG' && (
                        <span className="ml-2 w-4 h-4 bg-red-600 rounded-full"></span>
                      )}
                    </div>
                    {item.dishAddOns && item.dishAddOns.length > 0 && (
                      <div
                        className="flex flex-wrap gap-1 mt-1 relative"
                        onClick={() =>
                          item.status !== 'paid' && toggleShowRemoveAddon(index)
                        }
                      >
                        {item.dishAddOns.map((addon, idx) => (
                          <span
                            key={idx}
                            className="text-xs border-2 border-blue bg-white rounded-full px-2 py-0.5 flex items-center"
                          >
                            {addon.addOnName}
                            {showRemoveAddon === index &&
                              item.status !== 'paid' && (
                                <button
                                  onClick={(e) => removeAddon(e, index, idx)}
                                  className="ml-1 text-red-500"
                                >
                                  <FaTimes size={10} />
                                </button>
                              )}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="text-center relative">
                    <div
                      className={`inline-flex items-center justify-center ${
                        item.status !== 'paid' ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => toggleDropdown(index)}
                    >
                      <span
                        className={`px-1 py-1 rounded-md text-sm font-medium ${
                          item.status === 'pending'
                            ? 'text-yellow-400'
                            : item.status === 'preparing'
                            ? 'text-green'
                            : 'text-white'
                        }`}
                      >
                        {item.status === 'pending'
                          ? 'New'
                          : item.status === 'preparing'
                          ? 'Preparing'
                          : 'Paid'}
                      </span>
                      {item.status !== 'paid' && (
                        <span>
                          <RiArrowDropDownLine size={28} />
                        </span>
                      )}
                    </div>
                    {/* Dropdown menu */}
                    {activeDropdown === index && item.status !== 'paid' && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-white rounded-3xl shadow-lg z-10 w-52">
                        {item.status === 'pending' && (
                          <>
                            <div
                              className="px-4 py-3 font-medium text-green-600 border-b cursor-pointer hover:bg-gray-50 w-full text-green text-left"
                              onClick={() =>
                                updateItemStatus(index, 'preparing')
                              }
                            >
                              Preparing
                            </div>

                            <hr className="h-0.5 bg-user_blue" />
                          </>
                        )}
                        <div className="border-b w-full">
                          <div className="px-4 py-3 flex items-center justify-between">
                            <span>Qty :</span>
                            <div className="flex items-center border rounded-full bg-blue text-white">
                              <button
                                onClick={(e) =>
                                  updateItemQuantity(
                                    e,
                                    index,
                                    item.quantity - 1
                                  )
                                }
                                className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-l-md"
                              >
                                -
                              </button>
                              <span className="px-3">{item.quantity}</span>
                              <button
                                onClick={(e) =>
                                  updateItemQuantity(
                                    e,
                                    index,
                                    item.quantity + 1
                                  )
                                }
                                className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-r-md"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <hr className="h-0.5 bg-user_blue" />
                        <div
                          className="px-4 py-3 text-red text-left font-medium text-red-600 cursor-pointer hover:bg-gray-50 w-full"
                          onClick={(e) => removeItem(e, index)}
                        >
                          Remove
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right px-3">Rs. {item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-1 bg-white rounded-lg w-full py-2 pl-2 text-xs">
          <div>Note :</div>
          <div>{order.cookingRequest ? order.cookingRequest : 'No note'}</div>
        </div>
        <div className="flex justify-between">
          <div
            onClick={() => handleStatusUpdate('cancelled')}
            className="font-montserrat-500 px-4 py-2 uppercase bg-[#FF000099] rounded-xl cursor-pointer"
          >
            Cancel
          </div>
          <div
            onClick={() => handleStatusUpdate('paid')}
            className="font-montserrat-500 px-4 py-2 uppercase bg-[#008D3899] rounded-xl cursor-pointer"
          >
            Paid
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderList;
