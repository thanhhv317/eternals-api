import Container from 'typedi'
import { EternalService } from '@/services/eternal.service'
import { Response, Request } from 'interfaces/routes.interface'

export class EtenalController {
  private readonly service: EternalService
  constructor() {
    this.service = Container.get(EternalService)
  }

  public getResource = async (req: Request, res: Response) => {
    const { item } = req.query
    const result = await this.service.getResource(item as string)
    res.zap(result)
  }

  public havertResrouce = async (req: Request, res: Response) => {
    const { item, quantity = 1 } = req.body
    const result = await this.service.harvertResouce(item, quantity)
    res.zap(result)
  }
}
