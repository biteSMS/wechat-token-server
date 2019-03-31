import * as Router from 'koa-router'
import { TokenController } from '../Controllers/TokenController'

const router = new Router()

router.get('/', TokenController.returnToken)

export default router