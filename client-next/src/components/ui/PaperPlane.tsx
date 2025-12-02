'use client'
/**
 * PaperPlane 组件 - 纸飞机动画组件
 * 
 * 功能：
 * - 提供纸飞机的点击飞出和返回动画
 * - 支持抛物线飞行轨迹
 * - 真实的飞行旋转效果
 * - 独立层级管理，确保显示在最顶层
 * 
 * 设计特点：
 * - 抛物线飞行路径
 * - 分阶段旋转动画
 * - 硬件加速优化
 * - 响应式定位
 * 
 * @author lijingru
 * @created 2025-10-19
 */

'use client'

import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Next.js 静态资源路径（文件在 public/assets/ 目录下）
const paperPlaneIcon = '/assets/paper_plane.svg';

/**
 * 纸飞机组件属性
 */
interface PaperPlaneProps {
  /** Logo容器的选择器，用于获取起始位置 */
  logoSelector?: string;
  /** 纸飞机尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示调试信息 */
  debug?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 纸飞机组件
 * 
 * 这是一个独立的纸飞机动画组件，支持点击飞出和返回功能。
 * 使用抛物线轨迹和真实的旋转效果模拟纸飞机飞行。
 * 
 * @param props 组件属性
 * @returns JSX 元素
 */
const PaperPlane: React.FC<PaperPlaneProps> = ({
  logoSelector = '[data-logo]',
  size = 'md',
  debug = false,
  className = ''
}) => {
  // 纸飞机动画状态
  const [isFlying, setIsFlying] = useState(false);
  const planeControls = useAnimation();

  // 尺寸配置
  const sizeConfig = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  /**
   * 计算飞行轨迹的旋转角度
   * @param progress 飞行进度 (0-1)
   * @returns 旋转角度
   */
  const calculateRotation = (progress: number) => {
    // 根据飞行进度计算旋转角度 - 更平滑的抛物线旋转
    // 0-20%: 向上倾斜 (0-25度) - 起飞阶段
    // 20-40%: 继续上升 (25-35度) - 上升阶段
    // 40-60%: 水平飞行 (35-40度) - 最高点附近
    // 60-80%: 开始下降 (40-50度) - 下降阶段
    // 80-100%: 向下倾斜 (50-65度) - 降落阶段
    
    if (progress <= 0.2) {
      return progress / 0.2 * 25; // 0-25度
    } else if (progress <= 0.4) {
      return 25 + (progress - 0.2) / 0.2 * 10; // 25-35度
    } else if (progress <= 0.6) {
      return 35 + (progress - 0.4) / 0.2 * 5; // 35-40度
    } else if (progress <= 0.8) {
      return 40 + (progress - 0.6) / 0.2 * 10; // 40-50度
    } else {
      return 50 + (progress - 0.8) / 0.2 * 15; // 50-65度
    }
  };

  /**
   * 处理纸飞机点击事件
   * 生成向右的抛物线飞行路径并落在页面下边缘
   */
  const handlePlaneClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (debug) {
      console.log('点击纸飞机，当前状态:', isFlying);
    }
    
    if (isFlying) {
      // 如果正在飞行，则返回原位
      if (debug) {
        console.log('返回原位');
      }
      
      // 获取Logo的当前位置（相对于视口）
      const logoElement = document.querySelector(logoSelector) as HTMLElement;
      const logoRect = logoElement?.getBoundingClientRect();
      
      // 返回位置：Logo的当前位置
      const returnX = logoRect ? logoRect.left + 10 : 0;
      const returnY = logoRect ? logoRect.top + 10 : 0;
      
      if (debug) {
        console.log('返回到位置:', { returnX, returnY });
      }
      
      await planeControls.start({
        x: returnX, // 直接到返回位置
        y: returnY, // 直接到返回位置
        rotate: [60, 30, 0], // 从倾斜状态逐渐回到水平
        scale: [0.8, 1, 1], // 从飞行大小逐渐回到原始大小
        zIndex: 999999, // 保持最高层级
        transition: { 
          duration: 2, 
          ease: "easeInOut",
          times: [0, 0.5, 1] // 返回时的关键帧
        }
      });
      setIsFlying(false);
    } else {
      // 生成向右的抛物线飞行路径
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 获取Logo的当前位置（相对于视口）
      const logoElement = document.querySelector(logoSelector) as HTMLElement;
      const logoRect = logoElement?.getBoundingClientRect();
      
      // 起始位置：Logo的当前位置
      const startX = logoRect ? logoRect.left + logoRect.width / 2 : 0;
      const startY = logoRect ? logoRect.top + logoRect.height / 2 : 0;
      
      if (debug) {
        console.log('Logo位置信息:', { logoRect, startX, startY });
      }
      
      // 目标位置：页面下边缘的随机位置
      const targetX = viewportWidth * 0.7 + Math.random() * viewportWidth * 0.2; // 70%-90% 宽度范围
      const targetY = viewportHeight - 100; // 页面下边缘上方100px
      
      // 抛物线中间点（最高点）- 更自然的抛物线
      const midX = startX + (targetX - startX) * 0.5; // 从起始点到目标点50%处
      const midY = Math.min(startY, targetY) - 300; // 比起始点和目标点都高300px
      
      // 添加额外的控制点，创建更平滑的抛物线
      const controlX1 = startX + (targetX - startX) * 0.25; // 25%处
      const controlY1 = Math.min(startY, targetY) - 150; // 中等高度
      const controlX2 = startX + (targetX - startX) * 0.75; // 75%处
      const controlY2 = Math.min(startY, targetY) - 150; // 中等高度
      
      // 生成随机缩放（保持可见）
      const randomScale = 0.8 + Math.random() * 0.2; // 0.7 到 0.9
      
      if (debug) {
        console.log('飞出到位置:', { 
          startX, startY, 
          controlX1, controlY1,
          midX, midY,
          controlX2, controlY2,
          targetX, targetY 
        });
      }
      setIsFlying(true);
      
      // 先设置初始位置
      await planeControls.set({
        x: startX,
        y: startY,
        rotate: 0,
        scale: 1,
        zIndex: 999999
      });
      
      // 执行抛物线飞出动画 - 使用更多关键帧创建平滑抛物线
      await planeControls.start({
        x: [startX, controlX1, midX, controlX2, targetX], // 5个关键帧的X坐标
        y: [startY, controlY1, midY, controlY2, targetY], // 5个关键帧的Y坐标
        rotate: [
          0, 
          calculateRotation(0.1), 
          calculateRotation(0.3), 
          calculateRotation(0.5),
          calculateRotation(0.7), 
          calculateRotation(0.9), 
          calculateRotation(1)
        ], // 7个关键帧旋转
        scale: [1, randomScale * 0.6, randomScale * 0.8, randomScale * 0.9, randomScale], // 逐渐放大
        zIndex: 999999, // 确保在最顶层
        transition: { 
          duration: 6, // 增加飞行时间到6秒
          ease: [0.25, 0.46, 0.45, 0.94], // 自定义缓动曲线
          type: "tween",
          times: [0, 0.15, 0.35, 0.55, 0.75, 0.9, 1] // 7个时间点
        }
      });
    }
  };

  return (
    <>
      {/* 独立的纸飞机容器 - 确保在最顶层 */}
      {isFlying && (
        <motion.img 
          src={paperPlaneIcon} 
          alt="Flying Paper Plane" 
          className={`${sizeConfig[size]} cursor-pointer select-none fixed ${className}`}
          initial={false}
          animate={planeControls}
          onClick={handlePlaneClick}
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,1))',
            zIndex: 999999,
            pointerEvents: 'auto',
            userSelect: 'none',
            top: '0px',
            left: '0px',
            transform: 'translateZ(0)'
          }}
        />
      )}
      
      {/* 静止状态的纸飞机 */}
      {!isFlying && (
        <motion.img 
          src={paperPlaneIcon} 
          alt="Paper Plane Logo" 
          className={`${sizeConfig[size]} cursor-pointer select-none ${className}`}
          initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
          onClick={handlePlaneClick}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none'
          }}
        />
      )}
    </>
  );
};

export default PaperPlane;
