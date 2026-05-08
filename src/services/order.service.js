import { orderModel } from '@/models/order.model.js'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../utils/constant.utils.js'
import { BadRequestException } from '../common/helpers/error.helper.js'
import { getIO } from '../socket.js'

const createNew = async (reqBody) => {
  try {
    if (!reqBody.items || reqBody.items.length === 0) {
      throw new BadRequestException('Order must have at least 1 item')
    }
    const total_items = reqBody.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    const total_price = reqBody.items.reduce(
      (sum, item) => sum + item.final_price * item.quantity,
      0
    )
    const final_total = total_price - (reqBody.discount || 0)
    const orderData = {
      ...reqBody,
      total_items,
      total_price,
      final_total,
      order_status: 'New',
      createdAt: Date.now(),
      updatedAt: null
    }

    const result = await orderModel.createNew(orderData)

    // emit noti new order realtime
    getIO().to('admin_room').emit('new_order', {
      message: 'New order',
      result
    })


    return result

  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (orderId) => {
  try {
    const result = await orderModel.remove(orderId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (orderId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedorder = await orderModel.update(orderId, updateData)
    return updatedorder
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (page, limit, queryFilters) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!limit) limit = DEFAULT_ITEMS_PER_PAGE
    const data = await orderModel.getList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      queryFilters
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}

export const orderService = {
  createNew,
  remove,
  update,
  getList
}
