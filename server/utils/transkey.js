/**
 * 临时密钥管理工具
 * 
 * 功能：
 * - 生成临时密钥（transkey）
 * - 存储和管理临时密钥
 * - 自动清理过期的密钥
 * 
 * @author lijingru
 * @created 2025-11-13
 */

const crypto = require('crypto');

// 存储临时密钥（内存存储）
// 格式：{ transkey: { key: string, expiresAt: number } }
const transkeyStore = new Map();

// 密钥有效期（5分钟）
const TRANSKEY_EXPIRES_IN = 5 * 60 * 1000;

// 清理过期密钥的间隔（1分钟）
const CLEANUP_INTERVAL = 60 * 1000;

/**
 * 生成临时密钥
 * @returns {string} 临时密钥
 */
const generateTranskey = () => {
  // 生成32字节的随机密钥
  return crypto.randomBytes(32).toString('hex');
};

/**
 * 创建并存储临时密钥
 * @returns {string} 临时密钥
 */
const createTranskey = () => {
  const transkey = generateTranskey();
  const expiresAt = Date.now() + TRANSKEY_EXPIRES_IN;
  
  transkeyStore.set(transkey, {
    key: transkey,
    expiresAt
  });
  
  return transkey;
};

/**
 * 验证临时密钥是否有效
 * @param {string} transkey 临时密钥
 * @returns {boolean} 是否有效
 */
const validateTranskey = (transkey) => {
  if (!transkey) {
    return false;
  }
  
  const stored = transkeyStore.get(transkey);
  
  if (!stored) {
    return false;
  }
  
  // 检查是否过期
  if (Date.now() > stored.expiresAt) {
    transkeyStore.delete(transkey);
    return false;
  }
  
  return true;
};

/**
 * 获取临时密钥（用于解密）
 * @param {string} transkey 临时密钥标识
 * @returns {string|null} 密钥值，如果无效则返回 null
 */
const getTranskey = (transkey) => {
  if (!validateTranskey(transkey)) {
    return null;
  }
  
  const stored = transkeyStore.get(transkey);
  return stored ? stored.key : null;
};

/**
 * 使用后删除临时密钥（一次性使用）
 * @param {string} transkey 临时密钥
 */
const consumeTranskey = (transkey) => {
  transkeyStore.delete(transkey);
};

/**
 * 清理过期的密钥
 */
const cleanupExpiredKeys = () => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of transkeyStore.entries()) {
    if (now > value.expiresAt) {
      transkeyStore.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`清理了 ${cleaned} 个过期的临时密钥`);
  }
};

// 定期清理过期密钥
setInterval(cleanupExpiredKeys, CLEANUP_INTERVAL);

module.exports = {
  createTranskey,
  validateTranskey,
  getTranskey,
  consumeTranskey,
  cleanupExpiredKeys
};

