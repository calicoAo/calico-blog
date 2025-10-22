// 验证中间件
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 20;
};

// 用户注册验证
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!validateUsername(username)) {
    errors.push('用户名必须为3-20个字符');
  }

  if (!validateEmail(email)) {
    errors.push('请输入有效的邮箱地址');
  }

  if (!validatePassword(password)) {
    errors.push('密码至少6个字符');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: '验证失败', errors });
  }

  next();
};

// 用户登录验证
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('邮箱不能为空');
  }

  if (!password) {
    errors.push('密码不能为空');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: '验证失败', errors });
  }

  next();
};

// 博客创建验证
const validateBlog = (req, res, next) => {
  const { title, content } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('标题不能为空');
  } else if (title.length > 100) {
    errors.push('标题最多100个字符');
  }

  if (!content || content.trim().length < 10) {
    errors.push('内容至少10个字符');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: '验证失败', errors });
  }

  next();
};

// 分页参数验证
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return res.status(400).json({ message: '页码必须大于0' });
  }

  if (limit < 1 || limit > 100) {
    return res.status(400).json({ message: '每页数量必须在1-100之间' });
  }

  req.pagination = { page, limit };
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateBlog,
  validatePagination,
  validateEmail,
  validatePassword,
  validateUsername
};
