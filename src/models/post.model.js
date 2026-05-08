import Joi from 'joi'
import { GET_DB } from '@/config/db.js'
import { ObjectId } from 'mongodb'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/utils/constant.utils.js'

const POST_COLLECTION_NAME = 'posts'

const POST_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title must not exceed 100 characters',
      'any.required': 'Title is required'
    }),
  slug: Joi.string().required('Slug is required'),
  content: Joi.string().required('Content is required'),
  thumbnail: Joi.string().allow('').default(''),
  published: Joi.boolean().default(true),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await POST_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const newPostToAdd = {
      ...validatedData
    }
    const result = await GET_DB().collection(POST_COLLECTION_NAME).insertOne(newPostToAdd)
    const createdPost = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOne({ _id: result.insertedId })
    return createdPost
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
    const result = await GET_DB().collection(POST_COLLECTION_NAME)
    if (type) {
      query.type = type
    }


    const [posts, total] = await Promise.all([
      result
        .find(query)
        .sort({ _id: -1 }) // createdAt
        .skip(skip)
        .limit(limit)
        .toArray(),

      result.countDocuments(query)
    ])

    return {
      posts,
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

const update = async (PostId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const validatedUpdateData = await validateBeforeCreate(updateData)
    const newUpdateData = { ...validatedUpdateData }

    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(PostId) },
        { $set: newUpdateData },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (PostId) => {
  try {
    const result = await GET_DB().collection(POST_COLLECTION_NAME).findOneAndDelete({ _id: new ObjectId(PostId) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetail = async (slug) => {
  try {
    const result = await GET_DB()
      .collection(POST_COLLECTION_NAME)
      .findOne({
        slug,
        _destroy: false
      })

    return result
  } catch (error) {
    throw error
  }
}


export const postModel = {
  createNew,
  getList,
  update,
  remove,
  getDetail
}