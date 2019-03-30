import * as Router from 'koa-router'
import { TokenController } from '../controllers/TokenController'

const router = new Router()

router.get('/', TokenController.returnToken)

export default router