/**
 * Home 页面 - 主页
 * 
 * 布局结构：
 * - 使用 Flexbox 布局
 * - 左侧 Sidebar 占 25% 宽度
 * - 右侧 MainContent 占 75% 宽度
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import Sidebar from "@/components/layout/Sidebar";
import MainContent from "@/components/layout/MainContent";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MainContent />
    </div>
  );
}
