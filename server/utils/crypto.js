/**
 * 加密工具类
 * 
 * 功能：
 * - 使用 AES 解密前端传来的加密密码
 * - 与前端使用相同的密钥和算法
 * 
 * @author lijingru
 * @created 2025-11-13
 */

const CryptoJS = require('crypto-js');

/**
 * 加密密钥（应该与前端保持一致）
 * 注意：生产环境应该使用环境变量
 */
const SECRET_KEY = process.env.CRYPTO_SECRET || 'calico-blog-secret-key-2025';

/**
 * 解密密码（使用固定密钥，向后兼容）
 * @param {string} encryptedPassword 加密后的密码（Base64 编码）
 * @returns {string} 解密后的原始密码
 */
const decryptPassword = (encryptedPassword) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    const password = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!password) {
      throw new Error('解密失败：密码为空');
    }
    
    return password;
  } catch (error) {
    console.error('密码解密失败:', error);
    throw new Error('密码解密失败');
  }
};

/**
 * 使用临时密钥解密密码
 * @param {string} encryptedPassword 加密后的密码（Base64 编码）
 * @param {string} transkey 临时密钥
 * @returns {string} 解密后的原始密码
 */
const decryptPasswordWithTranskey = (encryptedPassword, transkey) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, transkey);
    const password = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!password) {
      throw new Error('解密失败：密码为空');
    }
    
    return password;
  } catch (error) {
    console.error('密码解密失败:', error);
    throw new Error('密码解密失败');
  }
};

/**
 * 加密密码（后端一般不需要，主要用于测试）
 * @param {string} password 原始密码
 * @returns {string} 加密后的密码（Base64 编码）
 */
const encryptPassword = (password) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('密码加密失败:', error);
    throw new Error('密码加密失败');
  }
};

module.exports = {
  encryptPassword,
  decryptPassword,
  decryptPasswordWithTranskey
};

