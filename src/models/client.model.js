import Joi from 'joi'
import { GET_DB } from '@/config/db.js'
import { ObjectId } from 'mongodb'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/utils/constant.utils.js'

const CLIENT_COLLECTION_NAME = 'clients'

const CLIENT_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(100).trim(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format'
    }),

  phone: Joi.string().trim().pattern(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/).required()
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Invalid phone number'
    }),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await CLIENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const newClientToAdd = {
      ...validatedData
    }
    const result = await GET_DB().collection(CLIENT_COLLECTION_NAME).insertOne(newClientToAdd)
    const createdClient = await GET_DB()
      .collection(CLIENT_COLLECTION_NAME)
      .findOne({ _id: result.insertedId })
    return createdClient
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (clientId) => {
  try {
    const result = await GET_DB().collection(CLIENT_COLLECTION_NAME).findOneAndDelete({ _id: new ObjectId(clientId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_ITEMS_PER_PAGE,
  type
}) => {
  try {
    const skip = (page - 1) * limit
    const query = {}
    const result = await GET_DB().collection(CLIENT_COLLECTION_NAME)
    if (type) {
      query.type = type
    }


    const [clients, total] = await Promise.all([
      result
        .find(query)
        .sort({ _id: -1 }) // createdAt
        .skip(skip)
        .limit(limit)
        .toArray(),

      result.countDocuments(query)
    ])

    return {
      clients,
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

const findByEmail = async (email) => {
  return await GET_DB()
    .collection(CLIENT_COLLECTION_NAME)
    .findOne({ email })
}

export const clientModel = {
  createNew,
  remove,
  getList,
  findByEmail
}