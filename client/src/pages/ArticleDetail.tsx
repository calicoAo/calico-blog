/**
 * ArticleDetail 页面 - 文章详情页
 * 
 * 功能：
 * - 显示文章完整内容
 * - 合集菜单栏（左侧）
 * - 文章目录（右侧）
 * - 上一页/下一页导航
 * - 与主页风格一致的布局
 * 
 * @author lijingru
 * @created 2025-10-19
 */

import React, { useState } from 'react';
import CategorySidebar from '@/components/article/CategorySidebar';
import ArticleContent from '@/components/article/ArticleContent';
import ArticleTOC from '@/components/article/ArticleTOC';

/**
 * 文章数据类型
 */
interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  content: string;
  category: string;
}

/**
 * 模拟文章数据
 */
const mockArticles: Article[] = [
  {
    id: 1,
    title: "Vite and Webpack: Concepts and Configuration",
    date: "2025/10/08",
    author: "lijingru",
    category: "Frontend engineering practices",
    content: `
      <h1>Introduction</h1>
      <p>Vite is designed around native ES modules, on-demand compilation, dependency pre-bundling, and fast hot module replacement (HMR). Unlike traditional bundlers like Webpack, Vite skips the upfront bundling step during development. This revolutionary approach has transformed how developers think about build tooling in modern web development.</p>
      
      <p>In this comprehensive guide, we will explore the fundamental concepts, compare Vite with Webpack, dive deep into configuration options, and understand the build processes of both tools. Whether you're a seasoned developer or just starting your journey in frontend engineering, this article will provide valuable insights.</p>
      
      <h2>Understanding Modern Build Tools</h2>
      <p>Modern frontend development requires sophisticated build tools to handle JavaScript modules, CSS preprocessing, asset optimization, and much more. The landscape has evolved significantly from simple concatenation scripts to complex bundling systems.</p>
      
      <h3>The Evolution of Bundlers</h3>
      <p>Early bundlers like Browserify introduced the concept of bundling Node.js modules for browser use. Webpack emerged as a more powerful solution, becoming the de facto standard for many years. However, as applications grew larger and more complex, performance became a critical concern.</p>
      
      <h3>Why Vite Was Created</h3>
      <p>Vite was created by Evan You, the creator of Vue.js, to address the performance bottlenecks of traditional bundlers. The name "Vite" means "fast" in French, and speed is indeed its core philosophy. By leveraging native ES modules and esbuild, Vite achieves near-instant server starts and lightning-fast HMR.</p>
      
      <h2>Key Concepts and Differences</h2>
      <p>Let's dive into the key differences between Vite and Webpack, understanding their fundamental approaches to bundling and development.</p>
      
      <h3>Development Server Architecture</h3>
      <p>Vite uses esbuild for pre-bundling dependencies, which is 10-100x faster than JavaScript-based bundlers. The development server serves source files directly over native ES modules, avoiding the need for bundling during development. This means that only the modules you import are processed, resulting in incredibly fast startup times.</p>
      
      <h3>Hot Module Replacement</h3>
      <p>HMR in Vite is significantly faster because it only needs to update the changed module, not re-bundle the entire application. The browser's native ES module system handles the module resolution, making updates feel instantaneous even in large applications.</p>
      
      <h4>HMR Performance Comparison</h4>
      <p>In typical Webpack setups, HMR can take several seconds for large applications. Vite typically completes HMR updates in under 50ms, regardless of application size. This dramatic difference makes the development experience much more pleasant.</p>
      
      <h2>Configuration Deep Dive</h2>
      <p>Configuration is where Vite and Webpack show their different philosophies. Understanding these differences helps you make informed decisions about your project setup.</p>
      
      <h3>Vite Configuration</h3>
      <p>Vite configuration is simpler and more intuitive than Webpack. The configuration file (vite.config.js) focuses on high-level settings, while plugins handle the specific transformations. This approach reduces boilerplate and makes the configuration easier to understand.</p>
      
      <h4>Basic Vite Config</h4>
      <p>A typical Vite configuration might include settings for plugins, build options, server configuration, and resolve aliases. The syntax is clean and declarative, making it easy to extend and customize.</p>
      
      <h4>Plugin System</h4>
      <p>Vite's plugin system is based on Rollup's plugin API, which provides a unified interface for build and dev server plugins. This consistency makes it easy to create and share plugins across different tools in the Vite ecosystem.</p>
      
      <h3>Webpack Configuration</h3>
      <p>Webpack's configuration is more verbose and requires explicit configuration for many common scenarios. While this provides fine-grained control, it can be overwhelming for beginners and requires more maintenance.</p>
      
      <h4>Loaders and Plugins</h4>
      <p>Webpack uses loaders to transform files and plugins to perform broader actions. This dual system provides flexibility but can also lead to configuration complexity, especially when dealing with multiple file types and transformations.</p>
      
      <h2>Build Process Comparison</h2>
      <p>The production build processes differ significantly between Vite and Webpack. Understanding these differences helps optimize your build pipeline.</p>
      
      <h3>Vite Build Process</h3>
      <p>The production build uses Rollup for optimal performance. Rollup is specifically designed for library bundling and tree-shaking, making it ideal for application bundling. Vite leverages Rollup's capabilities while providing a simpler configuration interface.</p>
      
      <h4>Optimization Features</h4>
      <p>Vite automatically handles code splitting, tree-shaking, and asset optimization out of the box. The build process is optimized for modern browsers, producing smaller bundles with better performance characteristics.</p>
      
      <h4>CSS Handling</h4>
      <p>Vite has built-in support for CSS preprocessors, PostCSS, and CSS modules. The CSS is extracted into separate files during production builds, and unused CSS can be purged automatically.</p>
      
      <h3>Webpack Build Process</h3>
      <p>Webpack's build process is more configurable but requires more setup. You need to explicitly configure optimizations, code splitting strategies, and asset handling. This provides more control but also more complexity.</p>
      
      <h4>Production Optimizations</h4>
      <p>Webpack offers extensive optimization options through its optimization object. You can configure minification, tree-shaking, module concatenation, and more. However, achieving optimal results often requires careful tuning.</p>
      
      <h2>Performance Metrics</h2>
      <p>Real-world performance comparisons provide valuable insights for choosing the right tool for your project.</p>
      
      <h3>Cold Start Time</h3>
      <p>Vite typically starts in under 1 second, even for large projects. Webpack startup time scales with project size and can take 10-30 seconds for large applications. This difference becomes more pronounced as projects grow.</p>
      
      <h3>HMR Update Speed</h3>
      <p>As mentioned earlier, Vite's HMR is significantly faster. For large applications, this can mean the difference between a smooth development experience and a frustrating one.</p>
      
      <h3>Production Build Time</h3>
      <p>Both tools can produce optimized production builds, but Vite's build process is generally faster. The use of esbuild for minification and Rollup for bundling provides excellent performance characteristics.</p>
      
      <h2>When to Use Each Tool</h2>
      <p>Understanding when to use each tool helps you make the right choice for your specific project needs.</p>
      
      <h3>Choose Vite When</h3>
      <p>Vite is ideal for modern projects using ES modules, frameworks like Vue 3 or React with modern tooling, and when development speed is a priority. It works best with TypeScript, modern CSS solutions, and projects targeting modern browsers.</p>
      
      <h3>Choose Webpack When</h3>
      <p>Webpack remains a solid choice for projects with complex requirements, extensive custom configurations, or when you need compatibility with older tooling. It's also preferable when working with legacy codebases that require gradual migration.</p>
      
      <h2>Migration Strategies</h2>
      <p>If you're considering migrating from Webpack to Vite, understanding the migration process helps plan your transition.</p>
      
      <h3>Step-by-Step Migration</h3>
      <p>Migration typically involves updating configuration files, replacing Webpack-specific plugins with Vite equivalents, and adjusting import paths. The process is generally straightforward for modern projects.</p>
      
      <h3>Common Challenges</h3>
      <p>Some challenges include handling legacy plugins, adjusting dynamic imports, and dealing with Webpack-specific features. However, the Vite community has solutions for most common scenarios.</p>
      
      <h2>Conclusion</h2>
      <p>Both Vite and Webpack are powerful tools with their own strengths. Vite excels in development experience and modern project setups, while Webpack provides more flexibility for complex scenarios. The choice depends on your specific project requirements, team preferences, and performance priorities.</p>
      
      <p>As the frontend ecosystem continues to evolve, understanding both tools makes you a more versatile developer. Consider experimenting with both to understand their strengths and weaknesses firsthand.</p>
    `
  },
  {
    id: 2,
    title: "Improving Web Performance with Caching",
    date: "2025/10/10",
    author: "lijingru",
    category: "Performance Optimization",
    content: `
      <h1>Web Performance Optimization</h1>
      <p>Explore modern caching strategies like HTTP caching, Service Workers, and IndexedDB for faster and more resilient web applications.</p>
      
      <h2>HTTP Caching</h2>
      <p>Understanding cache headers and strategies.</p>
      
      <h3>Service Workers</h3>
      <p>Leveraging Service Workers for offline-first applications.</p>
      
      <h2>IndexedDB</h2>
      <p>Using IndexedDB for large data storage in browsers.</p>
    `
  },
  {
    id: 3,
    title: "Understanding React Server Components",
    date: "2025/10/15",
    author: "lijingru",
    category: "React Deep Dive",
    content: `
      <h1>React Server Components</h1>
      <p>React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.</p>
      
      <h2>What are RSC?</h2>
      <p>React Server Components allow you to render components on the server.</p>
      
      <h3>Benefits</h3>
      <p>Smaller bundle sizes and better performance.</p>
      
      <h2>Implementation</h2>
      <p>How to implement RSC in your application.</p>
      
      <h3>Best Practices</h3>
      <p>Guidelines for using RSC effectively.</p>
    `
  }
];

const ArticleDetail: React.FC = () => {
  const [currentArticleId, setCurrentArticleId] = useState(1);
  
  const currentArticle = mockArticles.find(a => a.id === currentArticleId) || mockArticles[0];
  const categoryArticles = mockArticles.filter(a => a.category === currentArticle.category);
  
  const currentIndex = mockArticles.findIndex(a => a.id === currentArticleId);
  const previousArticle = currentIndex > 0 ? mockArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < mockArticles.length - 1 ? mockArticles[currentIndex + 1] : null;

  const handleArticleClick = (articleId: number) => {
    setCurrentArticleId(articleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    return (
    <div className="flex min-h-screen bg-linear-to-tr from-sky-100 via-amber-50 to-slate-100">
      {/* 左侧合集菜单栏 */}
      <CategorySidebar
        categoryName={currentArticle.category}
        articles={categoryArticles.map(a => ({
          id: a.id,
          title: a.title,
          date: a.date
        }))}
        currentArticleId={currentArticleId}
        onArticleClick={handleArticleClick}
      />

      {/* 中间文章内容区 */}
      <main className="flex-1 flex">
        <ArticleContent
          title={currentArticle.title}
          date={currentArticle.date}
          author={currentArticle.author}
          content={currentArticle.content}
          previousArticle={previousArticle}
          nextArticle={nextArticle}
          onNavigate={handleArticleClick}
        />

        {/* 右侧文章目录 */}
        <ArticleTOC content={currentArticle.content} />
      </main>
      </div>
    );
};

export default ArticleDetail;
  