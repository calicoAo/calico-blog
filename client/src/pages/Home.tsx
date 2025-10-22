import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      {/* 右侧主内容区域 */}
      <main className="flex-1 ml-[25%] p-10">
        {/* BlogGrid 等内容 */}
      </main>
    </div>
  );
}