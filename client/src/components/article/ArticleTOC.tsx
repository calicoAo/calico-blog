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
      
      items.push({ id, level, text });
    });
    
    setTocItems(items);
    
    // 为实际DOM中的标题设置id
    setTimeout(() => {
      const articleContent = document.getElementById('article-content');
      if (articleContent) {
        const actualHeadings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        actualHeadings.forEach((heading, index) => {
          heading.id = `heading-${index}`;
        });
      }
    }, 100);
  }, [content]);

  // 监听滚动，更新当前激活的标题
  useEffect(() => {
    const handleScroll = () => {
      const articleContent = document.getElementById('article-content');
      if (!articleContent) return;
      
      const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let current = '';
      let maxTop = -Infinity;
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        // 如果标题在视口上方或视口内，且距离顶部最近
        if (rect.top <= 150 && rect.top > maxTop) {
          maxTop = rect.top;
          current = heading.id;
        }
      });
      
      // 如果没有任何标题在视口内，选择第一个可见的
      if (!current && headings.length > 0) {
        for (let i = 0; i < headings.length; i++) {
          const rect = headings[i].getBoundingClientRect();
          if (rect.top > 150) {
            current = headings[i].id;
            break;
          }
        }
      }
      
      setActiveId(current);
    };

    // 初始检查
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const articleContent = document.getElementById('article-content');
    if (!articleContent) return;
    
    const element = articleContent.querySelector(`#${id}`);
    if (element) {
      const yOffset = -100; // 偏移量，避免被固定头部遮挡
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <aside className="w-64 p-6 bg-linear-to-b from-sky-50 to-blue-50 border-l border-gray-200">
      <div className="sticky top-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">目录</h3>
        <nav className="space-y-2">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block py-2 text-sm transition-all duration-200 cursor-pointer ${
                activeId === item.id
                  ? 'text-blue-600 font-semibold border-l-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
              style={{
                paddingLeft: activeId === item.id 
                  ? `${(item.level - 1) * 12 + 12}px`
                  : `${(item.level - 1) * 12 + 8}px`,
                transition: 'padding-left 0.2s ease, background-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.paddingLeft = `${(item.level - 1) * 12 + 12}px`;
                }
              }}
              onMouseLeave={(e) => {
                if (activeId !== item.id) {
                  e.currentTarget.style.paddingLeft = `${(item.level - 1) * 12 + 8}px`;
                }
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

