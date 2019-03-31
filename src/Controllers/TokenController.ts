import { Context } from "koa"
import * as request from "request"
import { client } from "../redis"
import { wechat } from "../config"

interface AccessToken {
  access_token: string
  expires_in: number
}

const akURL: (appid: string, secret: string) => string = (appid, secret) => {
  return `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
}

export class TokenController {
  public static async returnToken(ctx: Context) {
    try {
      let access_token = await TokenController.getAccessToken()
      ctx.status = 200
      ctx.body = {
        code: 0,
        access_token
      }
    } catch (err) {
      console.log(err)
      ctx.status = 400
      ctx.body = {
        code: 1
      }
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
        if (err) reject(err)
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
