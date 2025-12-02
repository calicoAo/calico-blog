# Express 中间件执行顺序说明

本文档详细说明了服务器端中间件的执行顺序，参考 [Express 官方文档](https://expressjs.com/zh-cn/guide/writing-middleware.html)。

## 中间件执行顺序

### 1. Helmet（安全响应头）
- **位置**：最前面
- **作用**：设置各种 HTTP 安全响应头
- **原因**：必须在其他中间件之前设置安全头，防止安全漏洞

### 2. CORS（跨域配置）
- **位置**：在 Helmet 之后，路由之前
- **作用**：处理跨域请求和 OPTIONS 预检请求
- **注意**：CORS 中间件会自动处理 OPTIONS 请求，通常不需要手动处理

### 3. Morgan（请求日志）
- **位置**：在 CORS 之后，解析之前
- **作用**：记录 HTTP 请求日志
- **配置**：开发环境使用 `dev` 格式，生产环境使用 `combined` 格式

### 4. JSON/URL 解析中间件
- **位置**：在路由之前
- **作用**：解析 JSON 和 URL 编码的请求体
- **注意**：必须在调试中间件之前，这样 `req.body` 才能被正确解析

### 5. 调试中间件（仅开发环境）
- **位置**：在 JSON 解析之后
- **作用**：开发环境调试，记录请求详情
- **注意**：必须在 JSON 解析之后，才能正确显示 `req.body`

### 6. 速率限制中间件
- **位置**：在路由之前，但在解析之后
- **作用**：防止 API 滥用和暴力攻击
- **配置**：排除健康检查接口

### 7. 路由
- **位置**：在所有中间件之后
- **顺序**：
  1. 健康检查（最前面，避免被其他中间件影响）
  2. API 路由（按功能分组）

### 8. 404 处理
- **位置**：在所有路由之后，错误处理之前
- **作用**：处理未匹配的路由

### 9. 错误处理中间件
- **位置**：最后
- **作用**：统一处理所有错误
- **注意**：必须是 4 个参数 `(err, req, res, next)`，Express 会自动识别

## 中间件编写规范

根据 Express 官方文档，中间件函数必须：

1. **调用 `next()`**：如果当前中间件没有结束请求/响应循环，必须调用 `next()` 将控制权传递给下一个中间件
2. **处理错误**：如果中间件是异步的，必须正确处理 Promise 和错误
3. **错误传递**：如果发生错误，可以调用 `next(error)` 将错误传递给错误处理中间件

### 示例：正确的中间件写法

```javascript
// 同步中间件
const myMiddleware = (req, res, next) => {
  // 执行一些操作
  console.log('中间件执行');
  next(); // 必须调用 next()
};

// 异步中间件
const asyncMiddleware = async (req, res, next) => {
  try {
    // 执行异步操作
    await someAsyncOperation();
    next(); // 成功时调用 next()
  } catch (error) {
    next(error); // 错误时调用 next(error)
  }
};
```

## 常见问题

### Q: 为什么服务器没有输出？
A: 检查中间件是否正确调用了 `next()`。如果中间件没有调用 `next()`，请求会被挂起。

### Q: 为什么 CORS 错误？
A: 确保 CORS 中间件在路由之前，并且配置正确。CORS 中间件会自动处理 OPTIONS 预检请求。

### Q: 为什么 `req.body` 是 `undefined`？
A: 确保 JSON 解析中间件在访问 `req.body` 的中间件之前。

### Q: 为什么错误没有被捕获？
A: 确保错误处理中间件在最后，并且是 4 个参数的函数。

## 参考文档

- [Express 编写中间件](https://expressjs.com/zh-cn/guide/writing-middleware.html)
- [Express 使用中间件](https://expressjs.com/zh-cn/guide/using-middleware.html)
- [Express 错误处理](https://expressjs.com/zh-cn/guide/error-handling.html)
