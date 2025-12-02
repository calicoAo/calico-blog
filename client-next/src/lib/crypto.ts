/**
 * 加密工具类
 * 
 * 功能：
 * - 使用 AES 加密密码
 * - 与后端使用相同的密钥和算法
 * 
 * @author lijingru
 * @created 2025-11-13
 */

import CryptoJS from 'crypto-js';

/**
 * 加密密钥（应该与后端保持一致）
 * 注意：生产环境应该使用环境变量
 */
const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET || 'calico-blog-secret-key-2025';

/**
 * 加密密码（使用固定密钥，向后兼容）
 * @param password 原始密码
 * @returns 加密后的密码（Base64 编码）
 */
export const encryptPassword = (password: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('密码加密失败:', error);
    throw new Error('密码加密失败');
  }
};

/**
 * 使用临时密钥加密密码
 * @param password 原始密码
 * @param transkey 临时密钥
 * @returns 加密后的密码（Base64 编码）
 */
export const encryptPasswordWithTranskey = (password: string, transkey: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(password, transkey).toString();
    return encrypted;
  } catch (error) {
    console.error('密码加密失败:', error);
    throw new Error('密码加密失败');
  }
};

/**
 * 解密密码（前端一般不需要，主要用于测试）
 * @param encryptedPassword 加密后的密码
 * @returns 解密后的原始密码
 */
export const decryptPassword = (encryptedPassword: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('密码解密失败:', error);
    throw new Error('密码解密失败');
  }
};

