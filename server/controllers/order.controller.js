import Order from '../models/order.model.js'
import PrintJob from '../models/printjob.model.js'
import Cafe from '../models/cafe.model.js'
import moment from 'moment'

export const placeOrder = async (req, res) => {
  try {
    const { cafeId, tableId, customer, orderList, cookingRequest } = req.body
    const updatedOrderList = orderList.map((item) => {
      const {
        dishName,
        dishCategory,
        quantity,
        dishPrice,
        dishVariants,
        dishAddOns,
      } = item

      const variantPrice = dishVariants?.variantPrice || 0
      const addonPrice = dishAddOns
        ? dishAddOns.reduce((sum, addon) => sum + (addon.addOnPrice || 0), 0)
        : 0

      const itemPrice = (dishPrice || 0 + variantPrice + addonPrice) * quantity

      return {
        dishName,
        dishCategory,
        quantity,
        dishPrice,
        dishVariants,
        dishAddOns,
        price: itemPrice,
        status: 'pending',
      }
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const existingOrder = await Order.findOne({
      cafeId,
      tableId,
      customer,
      'orderList.status': { $in: ['pending', 'preparing'] },
      createdAt: { $gte: today },
    })

    let savedOrder

    if (existingOrder) {
      const newItemsTotal = updatedOrderList.reduce(
        (acc, item) => acc + item.price,
        0
      )

      existingOrder.orderList = [
        ...existingOrder.orderList,
        ...updatedOrderList,
      ]
      existingOrder.totalPrice += newItemsTotal

      if (cookingRequest) {
        existingOrder.cookingRequest = existingOrder.cookingRequest
          ? `${existingOrder.cookingRequest}. NEW REQUEST: ${cookingRequest}`
          : cookingRequest
      }

      savedOrder = await existingOrder.save()

      const io = req.app.get('socketio')
      if (io) {
        io.to(`cafe_${cafeId}`).emit('orderUpdated', {
          type: 'UPDATED',
          order: savedOrder,
          tableId: tableId,
          cafeId: cafeId,
        })
      }

      return res.status(200).json({
        success: true,
        message: 'Added to existing order',
        order: savedOrder,
      })
    } else {
      const totalPrice = updatedOrderList.reduce(
        (acc, item) => acc + item.price,
        0
      )

      const newOrder = new Order({
        cafeId,
        tableId,
        customer,
        orderList: updatedOrderList,
        totalPrice,
        cookingRequest,
      })

      savedOrder = await newOrder.save()

      const cafe = await Cafe.findById(cafeId)
      const cafeEmail = cafe?.email || 'unknown@cafe.com'

      const generateBillText = (order) => {
        const lines = []
        lines.push('        RECEIPT')
        lines.push('**************************')

        for (const item of order.orderList) {
          const name = item.dishName
          const price = item.price.toFixed(2)
          lines.push(`${name.padEnd(18)} ${price.padStart(6)}`)
        }

        lines.push('--------------------------')
        lines.push('Total'.padEnd(18) + order.totalPrice.toFixed(2).padStart(6))
        lines.push('')
        lines.push('')
        lines.push(
          'Date/Time     ' + moment(order.createdAt).format('DD.MM.YYYY HH:mm')
        )
        lines.push('')
        lines.push('**************************')
        lines.push(' Thank you !')

        return lines.join('\n')
      }

      const billText = generateBillText(savedOrder)

      await PrintJob.create({
        orderId: savedOrder._id,
        email: cafeEmail,
        content: billText,
        status: 'pending',
      })

      const io = req.app.get('socketio')
      if (io) {
        io.to(`cafe_${cafeId}`).emit('newOrder', {
          order: savedOrder,
          tableId: tableId,
          cafeId: cafeId,
        })
      }

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: savedOrder,
      })
    }
  } catch (error) {
    console.error('Error placing order:', error)
    return res.status(500).json({
      success: false,
      message: 'Error placing order. Please try again later.',
    })
  }
}

export const getPendingPrintJob = async (req, res) => {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const job = await PrintJob.findOne({ email, status: 'pending' }).sort({
      createdAt: 1,
    })

    if (!job) {
      return res.json({ job: null })
    }

    return res.json({
      job: {
        job_id: job._id,
        content: job.content,
        printerIp: job.printerIp || null,
      },
    })
  } catch (error) {
    console.error('Error fetching print job:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const markPrintJobStatus = async (req, res) => {
  const { job_id, email, status } = req.body

  if (!job_id || !email || !status) {
    return res
      .status(400)
      .json({ error: 'job_id, email, and status are required' })
  }

  if (!['printed', 'failed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  try {
    const result = await PrintJob.findOneAndUpdate(
      { _id: job_id, email },
      { $set: { status } }
    )

    if (!result) {
      return res.status(404).json({ error: 'Print job not found' })
    }

    return res.json({ message: 'Print job status updated successfully' })
  } catch (error) {
    console.error('Error updating print job:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getOrders = async (req, res) => {
  const { cafeId } = req.params

  try {
    const orders = await Order.find({ cafeId })
    res.status(200).json(orders.length > 0 ? orders : [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const deleteOrder = async (req, res) => {
  const { cafeId, tableId } = req.body

  try {
    const orderToDelete = await Order.findOneAndDelete({ cafeId, tableId })
    if (!orderToDelete) {
      return res.status(404).json({ message: 'table not found' })
    }

    const io = req.app.get('socketio')
    if (io) {
      io.to(`cafe_${cafeId}`).emit('orderDeleted', {
        tableId: tableId,
        cafeId: cafeId,
        orderId: orderToDelete._id,
      })
    }

    res.status(200).json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
  }
}

export const updateItemQuantity = async (req, res) => {
  const { orderId, itemIndex, newQuantity, newPrice } = req.body

  if (!orderId || itemIndex === undefined || !newQuantity) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' })
  }

  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (itemIndex < 0 || itemIndex >= order.orderList.length) {
      return res.status(400).json({ success: false, message: 'Invalid item index' })
    }

    const oldPrice = order.orderList[itemIndex].price

    order.orderList[itemIndex].quantity = newQuantity
    order.orderList[itemIndex].price =
      newPrice || (oldPrice / order.orderList[itemIndex].quantity) * newQuantity

    order.totalPrice = order.totalPrice - oldPrice + order.orderList[itemIndex].price

    await order.save()

    const io = req.app.get('socketio')
    if (io) {
      io.to(`cafe_${order.cafeId}`).emit('orderUpdated', {
        type: 'ITEM_QUANTITY',
        order: order,
        tableId: order.tableId,
        cafeId: order.cafeId,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Item quantity updated',
      order,
    })
  } catch (error) {
    console.error('Error updating item quantity:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateItemStatus = async (req, res) => {
  const { orderId, itemIndex, newStatus } = req.body

  if (!orderId || itemIndex === undefined || !newStatus) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' })
  }

  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (itemIndex < 0 || itemIndex >= order.orderList.length) {
      return res.status(400).json({ success: false, message: 'Invalid item index' })
    }

    order.orderList[itemIndex].status = newStatus
    await order.save()

    const io = req.app.get('socketio')
    if (io) {
      io.to(`cafe_${order.cafeId}`).emit('orderUpdated', {
        type: 'ITEM_STATUS',
        order: order,
        tableId: order.tableId,
        cafeId: order.cafeId,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Item status updated',
      order,
    })
  } catch (error) {
    console.error('Error updating item status:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const removeItem = async (req, res) => {
  const { orderId, itemIndex } = req.body

  if (!orderId || itemIndex === undefined) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing required fields' })
  }

  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (itemIndex < 0 || itemIndex >= order.orderList.length) {
      return res.status(400).json({ success: false, message: 'Invalid item index' })
    }

    const removedItemPrice = order.orderList[itemIndex].price
    order.orderList.splice(itemIndex, 1)
    order.totalPrice -= removedItemPrice

    const io = req.app.get('socketio')
    if (order.orderList.length === 0) {
      await Order.findByIdAndDelete(orderId)
      if (io) {
        io.to(`cafe_${order.cafeId}`).emit('orderDeleted', {
          tableId: order.tableId,
          cafeId: order.cafeId,
          orderId: orderId,
        })
      }
      return res.status(200).json({
        success: true,
        message: 'Order removed as it had no items left',
      })
    }

    await order.save()
    if (io) {
      io.to(`cafe_${order.cafeId}`).emit('orderUpdated', {
        type: 'ITEM_REMOVED',
        order: order,
        tableId: order.tableId,
        cafeId: order.cafeId,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Item removed',
      order,
    })
  } catch (error) {
    console.error('Error removing item:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const removeAddon = async (req, res) => {
  try {
    const { orderId, itemIndex, addonIndex } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (itemIndex < 0 || itemIndex >= order.orderList.length) {
      return res.status(400).json({ success: false, message: 'Invalid item index' })
    }

    const item = order.orderList[itemIndex]

    if (addonIndex < 0 || addonIndex >= item.dishAddOns.length) {
      return res.status(400).json({ success: false, message: 'Invalid addon index' })
    }

    const addonPrice = item.dishAddOns[addonIndex].addOnPrice
    const addon = item.dishAddOns.splice(addonIndex, 1)[0]
    item.price -= addonPrice * item.quantity
    order.totalPrice -= addonPrice * item.quantity

    await order.save()

    const io = req.app.get('socketio')
    if (io) {
      io.to(`cafe_${order.cafeId}`).emit('orderUpdated', {
        type: 'ADDON_REMOVED',
        order: order,
        tableId: order.tableId,
        cafeId: order.cafeId,
      })
    }

    return res.status(200).json({
      success: true,
      message: `Addon ${addon.addOnName} removed from ${item.dishName}`,
      order,
    })
  } catch (error) {
    console.error('Error removing addon:', error)
    return res.status(500).json({ success: false, message: 'Error removing addon' })
  }
}
