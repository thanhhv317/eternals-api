import App from '@/app'
import { ValidateEnv } from '@utils/validateEnv'
import { EternalRoute } from './routes/eternals.route'
ValidateEnv()

const app = new App([new EternalRoute()])

app.listen()