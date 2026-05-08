import { StatusCodes } from 'http-status-codes'
import { responseSuccess } from '@/common/helpers/response.helper.js'
import { ObjectId } from 'mongodb'
import { clientService } from '../services/client.service.js'

const createNew = async (req, res, next) => {
  try {
    const result = await clientService.createNew(req.body)
    const response = responseSuccess(result, 'Create client successfully', StatusCodes.CREATED)
    res.status(response.code).json(response)
  } catch (err) {
    next(err)
  }
}

const remove = async (req, res, next) => {
  try {
    const clientId = req.params.id

    if (!ObjectId.isValid(clientId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: 'Client ID is invalid'
      })
    }

    const result = await clientService.remove(clientId)

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        message: 'client not found'
      })
    }

    const resData = responseSuccess(result, 'Client removed successfully')
    res.status(resData.code).json(resData)

  } catch (error) {
    next(error)
  }
}

const getList = async (req, res, next) => {
  try {
    const { page, limit, type } = req.query
    const clients = await clientService.getList(page, limit, type)
    const resData = responseSuccess(clients, `Get all ${type} clients successfully`)
    res.status(resData.code).json(resData)
  } catch (err) {
    next(err)
  }
}


export const clientController = {
  createNew,
  remove,
  getList
}