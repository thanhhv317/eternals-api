import { NextFunction, Request, Response } from 'express'
import { HttpException } from '@exceptions/http.exception'

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500
    const message: string = error.message

    res.status(status).json({ data: { errMess: message }, success: false, status: 500, time: Date.now() })
  } catch (error) {
    next(error)
  }
}
