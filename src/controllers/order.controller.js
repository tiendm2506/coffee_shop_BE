import { StatusCodes } from 'http-status-codes'
import { responseSuccess } from '@/common/helpers/response.helper.js'
import { ObjectId } from 'mongodb'
import { orderService } from '../services/order.service.js'

const createNew = async (req, res, next) => {
  try {
    const result = await orderService.createNew(req.body)
    const response = responseSuccess(result, 'Create order successfully', StatusCodes.CREATED)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  try {
    const orderId = req.params.id

    if (!ObjectId.isValid(orderId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Order ID is invalid'
      })
    }

    const result = await orderService.remove(orderId)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'Order not found'
      })
    }

    const resData = responseSuccess(result, 'Order removed successfully')
    res.status(resData.code).json(resData)

  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const orderId = req.params.id
    const { ...updateFields } = req.body

    if (!orderId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Order ID is can not be empty'
      })
    }

    if (!ObjectId.isValid(orderId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Order ID is invalid'
      })
    }

    const updateData = { ...updateFields }

    const updatedorder = await orderService.update(orderId, updateData)
    const resData = responseSuccess(updatedorder, 'Order updated successfully')
    res.status(resData.code).json(resData)
  } catch (error) {
    next(error)
  }
}

const getList = async (req, res, next) => {
  try {
    const { page, limit, q, ...rest } = req.query
    const queryFilters = { ...rest, q }
    const orders = await orderService.getList(page, limit, queryFilters)
    const resData = responseSuccess(orders, 'Get all orders successfully')
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}

export const orderController = {
  createNew,
  remove,
  update,
  getList
}