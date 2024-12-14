import Order from '../models/order.model.js';

export const placeOrder = async (req, res) => {
  try {
    const { cafeId, tableId, customer, orderList } = req.body;

    // Process each item in the order list
    const updatedOrderList = orderList.map(item => {
      const { dishName, dishCategory, quantity, dishPrice, dishVariants, dishAddOns } = item;

      // Ensure dishPrice, variantPrice, and addOnPrice are numbers
      const variantPrice = dishVariants?.variantPrice || 0;
      const addonPrice = dishAddOns
        ? dishAddOns.reduce((sum, addon) => sum + (addon.addOnPrice || 0), 0)
        : 0;

      const itemPrice = (dishPrice || 0 + variantPrice + addonPrice) * quantity;

      return {
        dishName,
        dishCategory,
        quantity,
        dishPrice,
        dishVariants,
        dishAddOns,
        price: itemPrice,
      };
    });

    // Total price of the order
    const totalPrice = updatedOrderList.reduce((acc, item) => acc + item.price, 0);

    // Save the order
    const newOrder = new Order({
      cafeId,
      tableId,
      customer,
      orderList: updatedOrderList,
      totalPrice,
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: "Error placing order. Please try again later.",
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
