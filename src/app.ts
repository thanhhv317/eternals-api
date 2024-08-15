import 'reflect-metadata'
import 'express-async-errors'
import cors from 'cors'
import express from 'express'
import hpp from 'hpp'
import { Routes } from '@interfaces/routes.interface'
import { ErrorMiddleware } from '@middlewares/error.middleware'
import { ResponseMiddleware } from '@middlewares/response.middleware'
import { PORT } from './config'
import { scheduleJob } from 'node-schedule'
import Container from 'typedi'
import { EternalService } from './services/eternal.service'
import { EternalItems } from './constants/eternal-item.constants'
import { TelegramBot } from './bot/telegram.bot'

export default class App {
  public app: express.Application
  public env: string
  public port: string | number
  private bot: TelegramBot

  constructor(routes: Routes[]) {
    this.app = express()
    this.port = PORT || 3000

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeErrorHandling()
    this.initializeHealthCheck()
    this.initializeCronjob()
    this.bot = new TelegramBot()
    this.bot.start()
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
    this.app.use(express.json())
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use(`/${route.path}`, route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware)
  }

  private initializeHealthCheck() {
    this.app.get('/health', (req, res) => res.json(true))
  }

  private initializeCronjob() {
    const service = Container.get(EternalService)
    // 🐏 sheeps - 4 energy
    scheduleJob('0 0 16 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.wool, 10)
    })
    scheduleJob('0 0 17 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.wool, 10)
    })
    scheduleJob('0 0 18 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.wool, 10)
    })
    scheduleJob('0 0 19 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.wool, 10)
    })
    scheduleJob('0 0 20 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.wool, 10)
    })
  
    // 🪵 - 3 energy
    scheduleJob('0 0 21 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.woods, 10)
    })
    scheduleJob('0 0 22 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.woods, 10)
    })
    scheduleJob('0 0 23 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.woods, 10)
    })
    scheduleJob('0 0 0 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.woods, 10)
    })
    scheduleJob('0 0 1 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.woods, 10)
    })

    // 🦋 - 4 energy
    scheduleJob('0 0 2 * * *', async () => {
      console.log('[Cron job] harverting 10 butterfly')
      await service.harvestResouce(EternalItems.butterfly, 10)
    })
    scheduleJob('0 0 3 * * *', async () => {
      console.log('[Cron job] harverting 10 butterfly')
      await service.harvestResouce(EternalItems.butterfly, 10)
    })
    scheduleJob('0 0 4 * * *', async () => {
      console.log('[Cron job] harverting 10 butterflies')
      await service.harvestResouce(EternalItems.butterfly, 10)
    })
    scheduleJob('0 0 5 * * *', async () => {
      console.log('[Cron job] harverting 10 butterflies')
      await service.harvestResouce(EternalItems.butterfly, 10)
    })

    // play 🤾🏻‍♂️ jumping ropes
    scheduleJob('0 */15 * * * *', async () => {
      console.log('[Cron job] jumping rope ')
      const rarePetId = 7465
      await Promise.allSettled([
        service.jumpingRope(),
        service.jumpingRope(rarePetId)
      ])
    })
  }
}
