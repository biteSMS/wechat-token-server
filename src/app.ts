import * as Koa from 'Koa'
import router from './routes'

const app = new Koa()

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)

console.log('Listening 3000...')
