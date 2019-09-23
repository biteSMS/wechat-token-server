# wechat-token-server

微信access_token中控服务器，用于微信开发中多个业务共享access_token。

## 基本功能

自动获取access_token并保存到redis中，当access_token过期时自动更新，解决微信access_token接口每天只能调用2000次的限制。

## 使用方法

先clone本项目，修改config文件夹中的配置文件。

- 使用Docker

  ```shell
  $ docker-compose up -d
  ```

- 一般情况

  ```shell
  $ npm install
  $ npm start
  ```

访问 [http://localhost:3000](http://localhost:3000/) 获取 `access_token`

获取成功

```json
{
  "code": 0,
  "access_token": "access_token"
}
```

获取失败

```json
{
  "code": 1
}
```

