import * as redis from 'redis'
import { redis as redisConfig } from '../config'

export const client = redis.createClient(redisConfig)

client.on("connect", () => console.log("redis is connected"))
client.on("error", err => console.log(`redis error: ${err}`))
client.on("end", () => console.log("redis is on end"))