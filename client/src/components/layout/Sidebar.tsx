/**
 * Sidebar 组件 - 左侧导航栏
 * 
 * 功能：
 * - 提供网站主导航菜单
 * - 显示网站 Logo 和品牌信息
 * - 包含位置信息展示
 * - 支持悬停动画效果
 * - 固定定位，始终可见
 * - 集成 PaperPlane 组件
 * 
 * 设计特点：
 * - 背景图片和遮罩层
 * - 响应式宽度（25% 屏幕宽度，最小240px）
 * - 流畅的进入动画
 * - 优雅的悬停效果
 * - 独立的纸飞机动画
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import { motion } from "framer-motion";
import PaperPlane from "../ui/PaperPlane";
// 使用 Vite 的静态资源导入
const sidebarBackground = new URL('../../assets/sidebar_back.JPG', import.meta.url).href;
const logoBackground = new URL('../../assets/logo_back.png', import.meta.url).href;

/**
 * 导航菜单项类型定义
 */
interface NavItem {
  /** 菜单项显示文本 */
  label: string;
  /** 菜单项图标名称 */
  icon: string;
  /** 菜单项链接路径 */
  path: string;
}

/**
 * 左侧导航栏组件
 * 
 * 这是网站的主要导航组件，提供页面间的快速跳转。
 * 使用 Framer Motion 实现流畅的动画效果，提升用户体验。
 * 
 * @returns JSX 元素
 */
const Sidebar = () => {

  // 导航菜单配置
  const navItems: NavItem[] = [
    {
      label: "Home",
      icon: "home",
      path: "/",
    },
    {
      label: "About",
      icon: "about",
      path: "/about",
    },
    {
      label: "Blog",
      icon: "blog",
      path: "/blog",
    },
    {
      label: "Contact",
      icon: "contact",
      path: "/contact",
    },
  ];

  return (
    <>
      {/* 纸飞机组件 */}
      {/* <PaperPlane 
        logoSelector="[data-logo]"
        size="md"
        debug={true}
      /> */}
      
      <motion.aside
        // 进入动画：从左侧滑入并淡入
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        
        // 样式：相对定位、背景图、弹性布局
        className="w-[25%] min-w-[240px] h-screen text-white flex flex-col items-center py-8 relative [&_a]:text-white [&_a]:no-underline [&_a]:font-black [&_a]:uppercase [&_a]:tracking-wide hover:[&_a]:text-amber-300 [&_a]:transition-colors [&_a]:duration-200"
        style={{
          backgroundImage: `url(${sidebarBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          fontFamily: "'Arial Black', 'Arial Bold', 'Helvetica Neue', Arial, sans-serif"
        }}
      >
      {/* 背景遮罩层 - 确保文字清晰可见 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* 内容区域 - 相对定位确保在遮罩层之上 */}
      <div className="relative z-10 flex flex-col items-end justify-center h-full w-full pr-8 mb-48">
        {/* Logo 区域 - 顶部 */}
        <div className="mb-8">
          <div 
            className="w-20 h-20 flex items-center justify-center"
            data-logo="true"
            style={{
              backgroundImage: `url(${logoBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* 网站 Logo - 纸飞机 SVG 图标 - 由 PaperPlane 组件处理 */}
            <PaperPlane />
          </div>
        </div>
        
        {/* 主导航菜单 - 中间区域 */}
        <nav className="flex flex-col gap-6 ">
          {navItems.map((item) => {
            return (
              <motion.a
                key={item.label}
                href={`#${item.path}`}
                
                // 悬停动画：放大和发光效果
                whileHover={{
                  scale: 1.05,
                  textShadow: "0px 0px 8px rgba(255,255,255,0.6)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer select-none text-right text-2xl text-white font-black uppercase tracking-wide mr-8 hover:text-amber-300 transition-colors duration-200 no-underline"
                style={{ color: 'white' }}
              >
                {item.label}
              </motion.a>
            );
          })}
        </nav>
        
       
       
      </div>
       {/* 底部位置信息 - 绝对定位在底部左侧 */}
      <div className="absolute bottom-4 left-4 text-sm text-white font-normal">
          chengdu, sichuan, china
        </div>
    </motion.aside>
    </>
  );
};

export default Sidebar;
