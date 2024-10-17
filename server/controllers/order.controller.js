import Order from '../models/order.model.js';

export const placeOrder = async (req, res) => {
  try {
    const { cafeId, tableId, orderList } = req.body;

    const updatedOrderList = orderList.map(item => ({
      dishName: item.dishName,
      dishCategory: item.dishCategory,
      quantity: item.quantity,
      dishPrice: item.dishPrice,
      price: item.quantity * item.dishPrice,  
    }));

    const totalPrice = updatedOrderList.reduce((acc, item) => acc + item.price, 0);

    const newOrder = new Order({
      cafeId,
      tableId,
      orderList: updatedOrderList,
      totalPrice,
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder,
    });

  } catch (error) {

    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: 'Error placing order. Please try again later.',
    });

  }
};


export const getOrders = async (req, res) => {
  const {cafeId} = req.params;

  try {
    const orders = await Order.find({ cafeId });

    if(orders.length === 0) {
      return res.status(404).json({message: 'No Orders as of now'});
    }

    res.status(200).json(orders);
  } catch(error) {
    console.error("Error fetching orders:", error);
  }
}


export const deleteOrder = async (req, res) => {
    const {cafeId, tableId} = req.body;

    try {
      const orderToDelete = await Order.findOneAndDelete({
        cafeId, 
        tableId,
      });

      if(!orderToDelete) {
        return res.status(404).json({message: 'table not found'});
      }

      res.status(200).json({ message: 'Order deleted successfully'});
    } catch(error) {
      console.error("Error deleting order:", error);
    }   
};
