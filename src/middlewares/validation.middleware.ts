import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { HttpException } from '@exceptions/http.exception'
import { get } from 'lodash'

/**
 * @name ValidationMiddleware
 * @description Allows use of decorator and non-decorator based validation
 * @param type dto
 * @param skipMissingProperties When skipping missing properties
 * @param whitelist Even if your object is an instance of a validation class it can contain additional properties that are not defined
 * @param forbidNonWhitelisted If you would rather to have an error thrown when any non-whitelisted properties are present
 */
export const ValidationMiddleware = (type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body)
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req.body = dto
        next()
      })
      .catch((errors: ValidationError[]) => {
        const arrErrorsFormat = errors.map((error: ValidationError) => {
          if (error.children.length > 0) {
            return error.children.map((childErr: ValidationError) => Object.values(get(childErr, 'constraints', false)))
          }
          return Object.values(get(error, 'constraints', false))
        })

        const message = arrErrorsFormat.flat().join(',')
        next(new HttpException(400, message))
      })
  }
}

export const ValidationQueryMiddleware = (type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.query as any)
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        next()
      })
      .catch((errors: ValidationError[]) => {
        const arrErrorsFormat = errors.map((error: ValidationError) => {
          if (error.children.length > 0) {
            return error.children.map((childErr: ValidationError) => Object.values(get(childErr, 'constraints', false)))
          }
          return Object.values(get(error, 'constraints', false))
        })

        const message = arrErrorsFormat.flat().join(',')
        next(new HttpException(400, message))
      })
  }
}
