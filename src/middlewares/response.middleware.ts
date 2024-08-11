import { NextFunction, Request } from 'express'
import { RequestResponse } from '@/interfaces/logs.interface'
import { Response } from '@/interfaces/routes.interface'

export const ResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.zap = response => {
    const message: RequestResponse = {
      data: response,
      success: !response?.errMess,
      status: response?.errMess ? 400 : 200,
      time: Date.now()
    }

    res.status(message.status)
    return res.json(message)
  }
  return next()
}
