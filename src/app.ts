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
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.wool, 10, 2)
    })
    scheduleJob('0 0 17 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.wool, 10, 2)
    })
    scheduleJob('0 0 18 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.wool, 10, 2)
    })
    scheduleJob('0 0 19 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.wool, 10, 2)
    })
    scheduleJob('0 0 20 * * *', async () => {
      console.log('[Cron job] harverting 10 sheeps')
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.wool, 10, 2)
    })

    // 🪵 - 3 energy
    scheduleJob('0 0 21 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 22 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 23 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.bird, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 0 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.flowerFire, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 1 * * *', async () => {
      console.log('[Cron job] harverting 10 woods')
      await service.harvestResouce(EternalItems.flowerFire, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })

    // 🦋 - 4 energy
    scheduleJob('0 0 2 * * *', async () => {
      console.log('[Cron job] harverting 10 butterfly')
      await service.harvestResouce(EternalItems.flowerFire, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 3 * * *', async () => {
      console.log('[Cron job] harverting 10 butterfly')
      await service.harvestResouce(EternalItems.flowerFire, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 4 * * *', async () => {
      console.log('[Cron job] harverting 10 butterflies')
      await service.harvestResouce(EternalItems.flowerFire, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 5 * * *', async () => {
      console.log('[Cron job] harverting 10 butterflies')
      await service.harvestResouce(EternalItems.flowerFire, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })
    scheduleJob('0 0 6 * * *', async () => {
      console.log('[Cron job] harverting 10 butterflies')
      await service.harvestResouce(EternalItems.flowerFire, 10)
      await service.harvestResouce(EternalItems.woods, 10, 2)
    })

    // play 🤾🏻‍♂️ jumping ropes
    // scheduleJob('0 */15 * * * *', async () => {
      // console.log('[Cron job] jumping rope ')
      // const mythicPetId = 4181
      // const level = 2
      // const accountNumber = 1
      // await service.jumpingRope(mythicPetId, level, accountNumber)

      // console.log('[Cron job] jumping rope pet Quoc 1')
      // await service.jumpingRope(3364, 2, 2)
    // })

    scheduleJob('0 */15 * * * *', async () => {
      console.log('Converting C98 Thanh')
      // service.convertToToken(1)
      // service.convertToToken(1, 2)
      
      console.log('Converting C98 Quoc')
      service.convertToToken(2)
      service.convertToToken(2, 2)

      console.log('Converting C98 Tuan')
      service.convertToToken(3)
    })

    scheduleJob('0 */16 * * * *', async () => {
      console.log('[Cron job] jumping rope pet 2')
      const commonPetId = 8169
      const level = 2
      const accountNumber = 1
      await service.jumpingRope(commonPetId, level, accountNumber)

      // console.log('[Cron job] jumping rope pet Quoc 2')
      // await service.jumpingRope(3447, 2, 2)
    })

    // scheduleJob('0 */17 * * * *', async () => {
    //   console.log('[Cron job] jumping rope pet Quoc 3')
    //   await service.jumpingRope(7639, 2, 2)
    // })

    // Spirit claim 🌠
    // scheduleJob('0 5 0 * * *', async () => {
    //   console.log('[Cron job] claim spirit')
    //   await service.endMiningTownerLevel2()
    //   const petIds = [4181, 8169]
    //   await service.startMiningTowerLevel2(petIds)
    // })

    // scheduleJob('0 5 3 * * *', async () => {
    //   console.log('[Cron job] claim spirit')
    //   await service.endMiningTownerLevel2()
    //   const petIds = [4181, 8169]
    //   await service.startMiningTowerLevel2(petIds)
    // })

    scheduleJob('0 0 */2 * * *', async () => {
      console.log('[Cron job] Feed pet')
      service.feedPet(4181, 1)
      service.feedPet(8169, 1)

      service.feedPet(3364, 2)
      service.feedPet(3447, 2)
      service.feedPet(7639, 2)
    })

    scheduleJob('0 2 7 * * *', async () => {
      console.log('[Cron job] Restore pet health')
      await service.recoverTotalMood(1)
      await service.recoverTotalMood(2)
    })

    scheduleJob('0 5 7 * * *', async () => {
      console.log('[Cron job] Restore pet health')
      await service.recoverTotalMood(1)
      await service.recoverTotalMood(2)
    })

    scheduleJob('0 58 11 * * *', async () => {
      console.log('[Cron job] Restore pet health')
      await service.recoverTotalMood(2)
    })

    scheduleJob('0 55 11 * * *', async () => {
      console.log('[Cron job] Restore pet health')
      await service.recoverTotalMood(2)
    })
  }
}
