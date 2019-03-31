# wechat-token-server

微信access_token中控服务器，用于微信开发中多个业务共享access_token。

## 基本功能

自动获取access_token并保存到redis中，当access_token过期时自动更新，解决微信access_token接口每天只能调用2000次的限制。