import { Context } from "koa"
import * as request from "request"
import * as redis from "redis"
import { redis as redisConfig } from "../config"
import { wechat } from "../config"

const client = redis.createClient(redisConfig)

client.on("connect", () => console.log("redis is connected"))
client.on("error", err => console.log(`redis error: ${err}`))
client.on("end", () => console.log("redis is on end"))

interface AccessToken {
  access_token: string
  expires_in: number
}

const akURL: (appid: string, secret: string) => string = (appid, secret) => {
  return `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
}

export class TokenController {
  public static async returnToken(ctx: Context) {
    let access_token = await TokenController.getAccessToken()
    ctx.status = 200
    ctx.body = {
      status: 1,
      access_token
    }
  }

  private static async requestAccessToken(): Promise<AccessToken> {
    return new Promise((resolve, reject) => {
      const { appid, secret } = wechat
      request.get(akURL(appid, secret), (err, res, body) => {
        if (err) reject(err)
        let data: AccessToken = JSON.parse(body)
        resolve(data)
      })
    })
  }

  private static setAccessToken(
    access_token: string,
    expires_in: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      client.set("access_token", access_token, "EX", expires_in, err => {
        if (err) reject()
        resolve()
      })
    })
  }

  private static async storeAccessToken(): Promise<string> {
    const data = await this.requestAccessToken()
    const { access_token, expires_in } = data
    await this.setAccessToken(access_token, expires_in)
    console.log("access_token has been stored")
    return access_token
  }

  private static getAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      client.get("access_token", async (err, reply) => {
        if (err) reject(err)
        if (!reply) {
          let newReply = await this.storeAccessToken()
          resolve(newReply)
        } else resolve(reply)
      })
    })
  }
}
