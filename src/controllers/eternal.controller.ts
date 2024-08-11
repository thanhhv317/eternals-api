import Container from 'typedi'
import { EternalService } from '@/services/eternal.service'
import { Response, Request } from 'interfaces/routes.interface'

export class EtenalController {
  private readonly service: EternalService
  constructor() {
    this.service = Container.get(EternalService)
  }

  getResource = async (req: Request, res: Response) => {
    const { item } = req.query
    const result = await this.service.getResource(item as string)
    res.zap(result)
  }

  havestResrouce = async (req: Request, res: Response) => {
    const { item, quantity = 1 } = req.body
    const result = await this.service.harvestResouce(item, quantity)
    res.zap(result)
  }

  jumpingRope = async (req: Request, res: Response) => {
    const result = await this.service.jumpingRope()
    res.zap(result)
  }
}
