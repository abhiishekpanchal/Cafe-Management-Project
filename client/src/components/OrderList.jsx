import React, { useState } from 'react'

function OrderList({order}) {
  const [orders, setOrders] = useState([...order.orderList]);

  const handleStatusUpdate = async (status) => {
    try {
        const response = await fetch(`/server/cafeDetails/updateEarnings/${order.cafeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ orderId: order._id, status }),
        });

        if (!response.ok) throw new Error('Failed to update earnings');

    } catch (error) {
        console.error("Error updating order status:", error);
    }
  };

  return (
    <div className='flex flex-col gap-1 bg-[#0158A11A] rounded-xl py-3.5 min-w-[27vw]'>
      <div className='font-montserrat-600 px-3.5 text-lg capitalize'>{order.customer}'s Order</div>
      <div className='flex justify-between px-3.5 font-montserrat-400 text-sm'>
        <div>Table No. : {order.tableId}</div>
        <div>Total : Rs {order.totalPrice}</div>
      </div>
      <hr className='h-1.5 bg-white'/>
      <div className='flex flex-col gap-3 py-2 px-3.5'>
        <div className='flex flex-col bg-[#3295E866] h-[25vh] overflow-y-auto rounded-xl py-2'>
          
          <div className='px-'>
          
          <div className='flex justify-between w-full -my-1.5 mb-1 text-sm'>
            <div className='mt-0.5 w-1/3 text-center'>Item Name</div>
            <div className='mt-0.5 w-1/3 text-center'>QTY</div>
            <div className='mt-0.5 w-1/3 text-center'>Price</div>
          </div>
          
          <hr className='h-0.5 bg-white mb-1' />
          <div>
            {orders.map((order, index) => {
            return (
            <div key={index} className='flex justify-evenly w-full -my-0 text-sm'>
              <div className='mt-0.5 w-1/3 text-center capitalize'>{order.dishName}</div>
              <div className='mt-0.5 w-1/3 text-center'>{order.quantity}</div>
              <div className='mt-0.5 w-1/3 text-center'>{order.price}</div>
            </div>
            )
            })}
          </div>
          </div>
        </div>
        <div className='flex gap-1 bg-white rounded-lg w-full py-1 pl-2 text-xs'>
            <div>Note :</div>
            <div>{order.note ? order.note : 'No note'}</div>
        </div>
        <div className='flex justify-between'>
          <div onClick={() => handleStatusUpdate("cancelled")} 
           className='font-montserrat-500 px-4 py-1 uppercase  bg-[#FF000099] rounded-xl cursor-pointer'>Cancel</div>
          <div onClick={() => handleStatusUpdate("paid")} 
           className='font-montserrat-500 px-4 py-1 uppercase bg-[#008D3899] rounded-xl cursor-pointer'>Paid</div>
        </div>
      </div>
    </div>
  )
}

export default OrderList