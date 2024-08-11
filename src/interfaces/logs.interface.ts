export interface LogRequest {
  type: string
  name: string
}

export interface RequestResponse {
  data: any
  success: boolean
  status: number
  time: number
}
