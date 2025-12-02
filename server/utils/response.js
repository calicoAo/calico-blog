/**
 * 统一响应格式工具
 * 
 * 标准响应格式：
 * {
 *   code: number,    // HTTP 状态码
 *   msg: string,     // 响应消息
 *   data: any        // 响应数据（可选）
 * }
 */

/**
 * 成功响应
 * @param {Object} res - Express 响应对象
 * @param {any} data - 响应数据
 * @param {string} msg - 响应消息
 * @param {number} code - HTTP 状态码（默认200）
 */
const success = (res, data = null, msg = '操作成功', code = 200) => {
  return res.status(code).json({
    code,
    msg,
    data
  });
};

/**
 * 错误响应
 * @param {Object} res - Express 响应对象
 * @param {string} msg - 错误消息
 * @param {number} code - HTTP 状态码（默认400）
 * @param {any} data - 额外数据（可选）
 */
const error = (res, msg = '操作失败', code = 400, data = null) => {
  return res.status(code).json({
    code,
    msg,
    data
  });
};

/**
 * 未授权响应（401）
 * @param {Object} res - Express 响应对象
 * @param {string} msg - 错误消息
 */
const unauthorized = (res, msg = '未授权，请先登录') => {
  return error(res, msg, 401);
};

/**
 * 禁止访问响应（403）
 * @param {Object} res - Express 响应对象
 * @param {string} msg - 错误消息
 */
const forbidden = (res, msg = '没有权限访问该资源') => {
  return error(res, msg, 403);
};

/**
 * 资源不存在响应（404）
 * @param {Object} res - Express 响应对象
 * @param {string} msg - 错误消息
 */
const notFound = (res, msg = '请求的资源不存在') => {
  return error(res, msg, 404);
};

/**
 * 服务器错误响应（500）
 * @param {Object} res - Express 响应对象
 * @param {string} msg - 错误消息
 */
const serverError = (res, msg = '服务器内部错误') => {
  return error(res, msg, 500);
};

/**
 * 验证错误响应（400）
 * @param {Object} res - Express 响应对象
 * @param {string} msg - 错误消息
 * @param {any} errors - 验证错误详情（可选）
 */
const validationError = (res, msg = '验证失败', errors = null) => {
  return error(res, msg, 400, errors);
};

module.exports = {
  success,
  error,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  validationError
};

