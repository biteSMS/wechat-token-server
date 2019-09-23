import { ClientOpts } from 'redis'

//使用Docker不需要修改该配置文件
export const redis: ClientOpts = {
  host: 'redis',
  port: 6379,
  db: 0
}