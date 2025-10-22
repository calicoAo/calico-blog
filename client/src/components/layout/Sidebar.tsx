// 左侧导航栏组件

import { motion } from "framer-motion";

const Sidebar = () => {
  const navItems = [
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
      label: "Contact",
      icon: "contact",
      path: "/contact",
    },
  ];
  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }} // 初始状态（位置偏左、透明）
      animate={{ x: 0, opacity: 1 }} // 动画目标状态
      transition={{ duration: 0.8, ease: "easeOut" }} // 动画时间与曲线
      className="fixed left-0 top-0 h-full w-[25%] min-w-[240px]
               bg-gradient-to-b from-slate-900/80 to-amber-900/60
               text-white flex flex-col justify-between items-center py-10"
    >
      {/* logo */}

      <div className="flex flex-col items-center gap-3 bg-white rounded-full p-2 w-10 h-10">
        {/* 简单的 logo 图标（纸飞机 emoji，可替换成 svg） */}
        <span className="text-4xl">✈️</span>
        
      </div>
      <nav className="flex flex-col gap-6 text-lg font-semibold">
        {/* 导航菜单 */}
        {navItems.map((item) => (
          <motion.a
            key={item.label}
            href={`#${item.path}`}
            whileHover={{
              scale: 1.1, // 悬停放大
              textShadow: "0px 0px 8px rgba(255,255,255,0.8)", // 发光
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-pointer select-none"
          >
            {item.label}
          </motion.a>
        ))}
      </nav>

      {/* 底部信息区 */}
      <div className="text-sm opacity-70 hover:opacity-100 transition-opacity duration-300">
        chengdu, sichuan, china
      </div>
    </motion.aside>
  );
};

export default Sidebar;
