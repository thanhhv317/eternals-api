import { Router } from 'express'
import { Routes } from '@interfaces/routes.interface'
import { EtenalController } from '@/controllers/eternal.controller'

export class EternalRoute implements Routes {
  public path = 'eternals'
  public router = Router()
  public controller = new EtenalController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get('/resources', this.controller.getResource)
    this.router.post('/resources', this.controller.havestResrouce)
    this.router.post('/traning/jumping-ropes', this.controller.jumpingRope)
  }
}
