import * as Router from 'koa-router'
import * as fs from 'fs'
import * as path from 'path'

const router = new Router()

fs
  .readdirSync(__dirname)
  .filter(file => 
    (file.indexOf('.') !== 0) &&
    (file.split('.').slice(-1)[0] === 'ts') &&
    file !== 'index.ts'    
    )
  .forEach(async file => {
    const route = (await import(path.resolve(__dirname, file))).default
    router.use(route.routes(), route.allowedMethods())
  })

export default router