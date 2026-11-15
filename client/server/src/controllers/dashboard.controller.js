import { sendSuccess } from '../utils/response.js'
import { getDashboardMetrics } from '../services/dashboard.service.js'

export const getDashboardController = async (req, res, next) => {
  try {
    const data = await getDashboardMetrics()
    return sendSuccess(res, 'Dashboard metrics fetched successfully', data)
  } catch (err) {
    return next(err)
  }
}
