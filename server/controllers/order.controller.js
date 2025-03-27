import Order from '../models/order.model.js';

export const placeOrder = async (req, res) => {
  try {
    const { cafeId, tableId, customer, orderList, cookingRequest } = req.body;

    // Process each item in the order list
    const updatedOrderList = orderList.map((item) => {
      const {
        dishName,
        dishCategory,
        quantity,
        dishPrice,
        dishVariants,
        dishAddOns,
      } = item;

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
        status: 'pending', // Each new item starts with 'pending' status
      };
    });

    // Check if there's an existing active order for this table and customer
    // We're looking for orders where ANY item has status 'pending' or 'preparing'
    const existingOrder = await Order.findOne({
      cafeId,
      tableId,
      customer,
      'orderList.status': { $in: ['pending', 'preparing'] },
    });

    if (existingOrder) {
      // If order exists, append new items

      // Calculate the price of new items
      const newItemsTotal = updatedOrderList.reduce(
        (acc, item) => acc + item.price,
        0
      );

      // Update the existing order
      existingOrder.orderList = [
        ...existingOrder.orderList,
        ...updatedOrderList,
      ];
      existingOrder.totalPrice += newItemsTotal;

      // If there's a new cooking request, append it to existing one
      if (cookingRequest) {
        existingOrder.cookingRequest = existingOrder.cookingRequest
          ? `${existingOrder.cookingRequest}. NEW REQUEST: ${cookingRequest}`
          : cookingRequest;
      }

      await existingOrder.save();

      return res.status(200).json({
        success: true,
        message: 'Added to existing order',
        order: existingOrder,
      });
    } else {
      // Total price of the order
      const totalPrice = updatedOrderList.reduce(
        (acc, item) => acc + item.price,
        0
      );

      // Save the order as a new order
      const newOrder = new Order({
        cafeId,
        tableId,
        customer,
        orderList: updatedOrderList,
        totalPrice,
        cookingRequest,
      });

      await newOrder.save();

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: newOrder,
      });
    }
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({
      success: false,
      message: 'Error placing order. Please try again later.',
    });
  }
};

export const getOrders = async (req, res) => {
  const { cafeId } = req.params;

  try {
    const orders = await Order.find({ cafeId });

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No Orders as of now' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

export const deleteOrder = async (req, res) => {
  const { cafeId, tableId } = req.body;

  try {
    const orderToDelete = await Order.findOneAndDelete({
      cafeId,
      tableId,
    });

    if (!orderToDelete) {
      return res.status(404).json({ message: 'table not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
  }
};

// Update order item status
export const updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemIndex, newStatus } = req.body;

    if (!['pending', 'preparing', 'cancelled', 'paid'].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be 'pending', 'preparing', 'cancelled', or 'paid'",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (itemIndex < 0 || itemIndex >= order.orderList.length) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid item index' });
    }

    // Update item status
    order.orderList[itemIndex].status = newStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Item status updated',
      order,
    });
  } catch (error) {
    console.error('Error updating item status:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error updating item status' });
  }
};

// Remove an item from order
export const removeItem = async (req, res) => {
  try {
    const { orderId, itemIndex } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (itemIndex < 0 || itemIndex >= order.orderList.length) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid item index' });
    }

    // Get the item price to subtract from total
    const itemPrice = order.orderList[itemIndex].price;

    // Remove the item
    order.orderList.splice(itemIndex, 1);

    // Recalculate total price
    order.totalPrice -= itemPrice;

    // If no items left, delete the order
    if (order.orderList.length === 0) {
      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({
        success: true,
        message: 'Order removed as it had no items left',
      });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from order',
      order,
    });
  } catch (error) {
    console.error('Error removing item:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error removing item' });
  }
};

// Remove addon from an item
export const removeAddon = async (req, res) => {
  try {
    const { orderId, itemIndex, addonIndex } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    if (itemIndex < 0 || itemIndex >= order.orderList.length) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid item index' });
    }

    const item = order.orderList[itemIndex];

    if (addonIndex < 0 || addonIndex >= item.dishAddOns.length) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid addon index' });
    }

    // Get addon price
    const addonPrice = item.dishAddOns[addonIndex].addOnPrice;

    // Remove addon from item
    const addon = item.dishAddOns.splice(addonIndex, 1)[0];

    // Update item price (subtract addon price)
    item.price -= addonPrice * item.quantity;

    // Update total price
    order.totalPrice -= addonPrice * item.quantity;

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Addon ${addon.addOnName} removed from ${item.dishName}`,
      order,
    });
  } catch (error) {
    console.error('Error removing addon:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Error removing addon' });
  }
};
