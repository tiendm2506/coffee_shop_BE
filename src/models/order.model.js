import Joi from 'joi'
import { GET_DB } from '@/config/db.js'
import { ObjectId } from 'mongodb'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/utils/constant.utils.js'

const ORDER_COLLECTION_NAME = 'orders'

const objectId = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error('any.invalid')
  }
  return value
}

const ORDER_COLLECTION_SCHEMA = Joi.object({
  _id: Joi.any().custom(objectId).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.any().custom(objectId).required(),
        name: Joi.string().trim().required(),
        slug: Joi.string().trim().required(),
        image: Joi.string().uri().required(),
        on_sale: Joi.boolean(),
        origin_price: Joi.number().min(0).required(),
        promotion_price: Joi.number().min(0).allow(null),
        quantity: Joi.number().integer().min(1).required(),
        final_price: Joi.number().min(0).required()
      })
    )
    .min(1)
    .required(),

  shipping_info: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{9,11}$/)
      .required(),
    address: Joi.string().trim().min(5).required(),
    note: Joi.string().allow('').optional()
  }).required(),

  order_status: Joi.string()
    .valid('New', 'Cancelled', 'Completed')
    .default('New'),
  total_items: Joi.number().integer().min(1).required(),
  total_price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).default(0),
  final_total: Joi.number().min(0).required(),
  createdAt: Joi.date()
    .timestamp('javascript')
    .default(Date.now),
  updatedAt: Joi.date()
    .timestamp('javascript')
    .allow(null)
    .default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await ORDER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const newOrderToAdd = {
      ...validatedData
    }
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).insertOne(newOrderToAdd)
    const createdOrder = await GET_DB().collection(ORDER_COLLECTION_NAME).findOne({ _id: result.insertedId })
    return createdOrder
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (orderId) => {
  try {
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME).findOneAndDelete({ _id: new ObjectId(orderId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (orderId, updateData) => {
  const ALLOWED_STATUS = ['New', 'Canceled', 'Completed']
  try {
    const { order_status } = updateData

    if (!order_status) {
      throw new Error('order_status is required')
    }

    if (!ALLOWED_STATUS.includes(order_status)) {
      throw new Error('Invalid order_status')
    }

    const result = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            order_status,
            updatedAt: Date.now()
          }
        },
        { returnDocument: 'after' }
      )

    return result

  } catch (error) {
    throw new Error(error)
  }
}

const getList = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_ITEMS_PER_PAGE,
  queryFilters = {}
}) => {
  try {
    const skip = (page - 1) * limit
    const query = {}
    const result = await GET_DB().collection(ORDER_COLLECTION_NAME)

    // remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(queryFilters).filter(([_, v]) => v !== undefined)
    )

    // search filter
    if (cleanFilters.q) {
      query.name = {
        $regex: cleanFilters.q,
        $options: 'i'
      }
    }

    if (cleanFilters.exclude) {
      query._id = { $ne: new ObjectId(cleanFilters.exclude) }
    }

    const [orders, total] = await Promise.all([
      result
        .find(query)
        .sort({ _id: -1 }) // createdAt
        .skip(skip)
        .limit(limit)
        .toArray(),

      result.countDocuments(query)
    ])

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const orderModel = {
  createNew,
  remove,
  update,
  getList
}