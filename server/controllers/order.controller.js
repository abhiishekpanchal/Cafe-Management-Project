import Order from '../models/order.model.js';

export const placeOrder = async (req, res) => {
  try {
    const { cafeId, tableId, customer, orderList } = req.body;

    // Process each item in the order list
    const updatedOrderList = orderList.map(item => {
      const { dishName, dishCategory, quantity, dishPrice, dishVariant, dishAddon } = item;

      // Calculate variant and addon price based on their quantity
      const variantPrice = dishVariant ? dishVariant.variantPrice : 0;
      const addonPrice = dishAddon ? dishAddon.addOnPrice : 0;

      // Calculate total price per item including variant and addon price
      const itemPrice = (dishPrice + variantPrice + addonPrice) * quantity;

      return {
        dishName,
        dishCategory,
        quantity,
        dishPrice,
        variant: dishVariant ? { variantName: dishVariant.variantName, variantPrice } : null,
        addon: dishAddon ? { addOnName: dishAddon.addOnName, addOnPrice } : null,
        price: itemPrice,
      };
    });

    // Calculate total order price by summing the individual item prices
    const totalPrice = updatedOrderList.reduce((acc, item) => acc + item.price, 0);

    // Create a new order with all required details
    const newOrder = new Order({
      cafeId,
      tableId,
      customer,
      orderList: updatedOrderList,
      totalPrice,
    });

    // Save the order to the database
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
