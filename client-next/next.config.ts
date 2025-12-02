import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 启用 standalone 输出（用于 Docker）
  output: 'standalone',
  
  // 重写路径（替代 Vite proxy）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_BASE_URL 
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`
          : 'http://127.0.0.1:3001/api/:path*',
      },
    ];
  },
  
  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: '8.129.88.130',
        port: '3001',
      },
      {
        protocol: 'https',
        hostname: 'www.calicovo.space',  // 添加这行
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // SCSS 支持
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  
  // 压缩和优化
  compress: true,
  
  // 生产环境优化
  poweredByHeader: false, // 移除 X-Powered-By 头
  
  // 实验性功能
  experimental: {
    optimizeCss: true, // CSS 优化
  },
};

export default nextConfig;
