# Onefly 官网表单邮件服务

这是一个轻量的 Node.js 邮件接口，用于接收 Onefly 官网联系表单，并将内容发送到指定邮箱。

项目提供七个业务接口：

```text
POST /send-email
GET  /api/suggest
POST /webAirline/query
GET  /search
POST /get_seats
POST /get_baggages
POST /book
```

## 项目结构

```text
src/
  server.js                     服务启动入口
  app.js                        Express 应用配置
  email/                        邮件功能模块
    route.js                    表单校验与接口处理
    guard.js                    邮件间隔、小时上限和重复提交保护
    service.js                  SMTP 邮件发送
    renderer.js                 EJS 模板渲染
    inquiry.ejs                 邮件 HTML 模板
  middleware/
    risk.js                     请求频率、IP 封禁和防重放
  travel/
    airport.js                  城市/机场三字码联想中转
    airline.js                  航司名称与 Logo 查询中转
    search.js                   航班价格搜索中转
    seat.js                     座位查询中转
    baggage.js                  行李查询中转
    book.js                     航班验价中转
    proxy.js                    请求转发公共处理

.env                            本地运行配置，不提交到 Git
package.json                    项目与启动命令
pm2.json                        PM2 部署配置
```

## 环境要求

- Node.js 20 或更高版本
- 可用的 SMTP 账号
- 风控数据保存在进程内存中

## 配置

本地通过 `npm start` 启动时读取根目录 `.env`，仅需配置邮件账号与收发件地址：

```dotenv
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
MAIL_FROM=Onefly <support@onefly.com>
MAIL_TO=sales@oneflya.com
```

其他参数使用代码默认值。不要把真实 SMTP 密码提交到 Git。

## 安装和启动

```bash
npm install
npm start
```

默认服务地址：`http://localhost:3000`。

生产环境只需在 `pm2.json` 的 `env` 中配置 SMTP 凭据和收发件地址，不需要修改代码或 `.env`。端口、接口地址、超时和风控等使用代码默认值。首次从旧版本升级时，先删除仍指向旧入口的进程：

```bash
pm2 delete oneflyEmail 2>/dev/null || true
pm2 startOrReload pm2.json --update-env
pm2 save
```

以后修改 `env` 后只需执行：

```bash
pm2 startOrReload pm2.json --update-env
pm2 save
```

服务默认监听 `3000` 端口，PM2 启动时直接读取 `pm2.json` 中的邮件配置。

## 发送邮件

请求：

```http
POST /send-email
Content-Type: application/json
```

请求体：

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corporation",
  "country": "China",
  "emailAddress": "john.doe@example.com",
  "telephone": "+86-138-0000-1234",
  "description": "I would like to inquire about your services."
}
```

必填字段：

- `firstName`
- `lastName`
- `companyName`
- `emailAddress`

发送成功：

```json
{
  "success": true,
  "message": "邮件发送成功"
}
```

参数错误：

```json
{
  "success": false,
  "message": "请填写所有必填项",
  "fields": ["firstName"]
}
```

## 航旅数据

城市/机场三字码联想：

```powershell
curl.exe -G "http://localhost:3000/api/suggest" `
  --data-urlencode "key=Shanghai"
```

批量获取航司名称和 Logo，`codeList` 为航司二字码：

```powershell
curl.exe -X POST "http://localhost:3000/webAirline/query" `
  -H "Content-Type: application/json" `
  -d '{"codeList":["CA","MU","CZ"]}'
```

搜索航班价格：

```powershell
curl.exe -G "http://localhost:3000/search" `
  --data-urlencode "type=roundtrip" `
  --data-urlencode "depCity=BKK" `
  --data-urlencode "arrCity=HKT" `
  --data-urlencode "depDate=2026-11-20" `
  --data-urlencode "retDate=2026-11-27" `
  --data-urlencode "adult=1" `
  --data-urlencode "child=0" `
  --data-urlencode "infant=0"
```

`GET /search` 会将旧前端的查询参数转换为上游格式；`type=roundtrip` 时才会发送返程日期。价格搜索固定使用上游的 `action=search&www=www&version=v2` 参数和 30 秒超时。

机场联想和航司查询接口直接代理上游响应，固定超时为 5 秒。

## 接口保护

请求依次经过以下处理：

```text
risk → 表单校验 → guard → SMTP 发送
```

- `risk`：控制请求频率、临时封禁异常 IP、防止重复请求。
- `guard`：限制同一 IP 的发送间隔、每小时发送数量和相同内容重复提交。
- 风控计数保存在进程内存中，不需要额外服务。

## 代码检查

```bash
npm run check
```

该命令只检查源代码语法，不发送真实邮件。
