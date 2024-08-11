import 'reflect-metadata'
import 'express-async-errors'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Routes } from '@interfaces/routes.interface'
import { ErrorMiddleware } from '@middlewares/error.middleware'
import { ResponseMiddleware } from '@middlewares/response.middleware'
import { PORT } from './config'

export default class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = PORT || 3000

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeSwagger()
    this.initializeErrorHandling()
    this.initializeHealthCheck()
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`=================================`)
      console.info(`🚀 Server listening on the port ${this.port}`)
      console.info(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(cors({ credentials: true }))
    this.app.use(hpp())
    this.app.use(ResponseMiddleware)
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use(`/${route.path}`, route.router)
    })
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs'
        }
      },
      apis: ['swagger.yaml']
    }

    const specs = swaggerJSDoc(options)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware)
  }
  private initializeHealthCheck() {
    this.app.get('/health', (req, res) => res.json(true))
    this.app.get('/ping', (req, res) => res.json(true))
    this.app.get('/health-check', (req, res) => res.json(true))
  }

}
