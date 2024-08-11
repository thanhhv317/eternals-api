import { Request as RequestExpress, Response as ResponseExpress } from 'express'
import { Router } from 'express'
export interface Routes {
  path?: string
  router: Router
}

export interface Response extends ResponseExpress {
  zap: (data: any) => void
}
export interface Request extends RequestExpress {
  user?: string
  auth?: AuthData
}

export interface AuthData {
  address?: string
  roles?: string[]
}
