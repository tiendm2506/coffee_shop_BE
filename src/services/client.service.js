import { BadRequestException } from '../common/helpers/error.helper.js'
import { clientModel } from '../models/client.model.js'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '../utils/constant.utils.js'
import { sendEmail } from '../helpers/email.helper.js'
import { subscribeTemplate } from '../templates/subscribe.template.js'

const createNew = async (reqBody) => {
  try {
    const existing = await clientModel.findByEmail(reqBody.email)
    if (existing) throw new BadRequestException('Your email already exists in system')
    const result = await clientModel.createNew(reqBody)
    await sendEmail({
      to: reqBody.email,
      subject: 'Subscription Success',
      html: subscribeTemplate({ email: reqBody.email })
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const remove = async (clientId) => {
  try {
    const result = await clientModel.remove(clientId)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (page, limit, type) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!limit) limit = DEFAULT_ITEMS_PER_PAGE
    const data = await clientModel.getList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      type
    })
    return data
  } catch (error) {
    throw new Error(error)
  }
}


export const clientService = {
  createNew,
  remove,
  getList
}
