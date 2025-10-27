/**
 * ArticleTOC 组件 - 文章目录
 * 
 * 功能：
 * - 自动解析富文本内容中的标题（H1, H2, H3等）
 * - 生成文章目录导航
 * - 支持点击跳转到对应标题
 * - 滚动时高亮当前位置
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React, { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  level: number;
  text: string;
}

interface ArticleTOCProps {
  /** 富文本内容 */
  content: string;
}

/**
 * 文章目录组件
 */
const ArticleTOC: React.FC<ArticleTOCProps> = ({ content }) => {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 解析HTML内容中的标题
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items: TOCItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = `heading-${index}`;
      
      heading.id = id;
      items.push({ id, level, text });
    });
    
    setTocItems(items);
  }, [content]);

  // 监听滚动，更新当前激活的标题
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let current = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <aside className="w-64 p-6">
      <div className="sticky top-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">目录</h3>
        <nav className="space-y-2">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.id);
              }}
              className={`block py-2 text-sm transition-colors duration-200 ${
                activeId === item.id
                  ? 'text-blue-600 font-semibold border-l-2 border-blue-600 pl-3'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              style={{
                paddingLeft: `${(item.level - 1) * 12 + 8}px`,
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default ArticleTOC;

