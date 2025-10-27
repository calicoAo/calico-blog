// 页脚组件
const Footer = () => {
  return (
    <footer className="p-4 text-center text-xs text-gray-500 fixed bottom-0 right-0 w-[75%] h-8 bg-black/50 backdrop-blur-sm flex items-center justify-between">
      <a className="text-white hover:text-gray-300"  style={{ color: 'white' }} href="#">LinkedIn</a>
     <span className="text-white ">copyright 2025 @caleb</span>
    </footer>
  );
};

export default Footer;
