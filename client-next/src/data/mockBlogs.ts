/**
 * 模拟博客数据
 * 
 * 用于开发和测试阶段
 * 实际生产环境应该从 API 获取数据
 * 
 * @author lijingru
 * @created 2025-11-12
 */

import type { BlogData } from '@/components/blog/BlogGrid';

/**
 * 博客卡片背景颜色数组
 */
export const colors = [
  "bg-amber-50", "bg-blue-50", "bg-green-50", "bg-purple-50", 
  "bg-pink-50", "bg-indigo-50", "bg-yellow-50", "bg-teal-50",
  "bg-orange-50", "bg-red-50", "bg-cyan-50", "bg-emerald-50"
];

/**
 * 模拟博客数据列表（30篇文章）
 */
export const mockBlogs: BlogData[] = [
  {
    id: 1,
    title: "Vite and Webpack: Concepts and Configuration",
    description: "Vite is designed around native ES modules, on-demand compilation, dependency pre-bundling, and fast hot module replacement (HMR). Unlike traditional bundlers like Webpack, Vite skips the upfront bundling step during development.",
    category: "Frontend engineering practices",
    date: "2025/10/08",
    color: colors[0]
  },
  {
    id: 2,
    title: "Improving Web Performance with Caching",
    description: "Explore modern caching strategies like HTTP caching, Service Workers, and IndexedDB for faster and more resilient web applications.",
    category: "Performance Optimization",
    date: "2025/10/10",
    color: colors[1]
  },
  {
    id: 3,
    title: "Understanding React Server Components",
    description: "React Server Components (RSC) enable faster page loads and smaller client bundles. Let's see how they work and how to use them effectively.",
    category: "React Deep Dive",
    date: "2025/10/15",
    color: colors[2]
  },
  {
    id: 4,
    title: "TypeScript Best Practices",
    description: "Learn advanced TypeScript patterns and techniques for building robust applications.",
    category: "TypeScript",
    date: "2025/10/12",
    color: colors[3]
  },
  {
    id: 5,
    title: "CSS Grid vs Flexbox",
    description: "When to use CSS Grid and when to use Flexbox for different layout scenarios.",
    category: "CSS Layout",
    date: "2025/10/18",
    color: colors[4]
  },
  {
    id: 6,
    title: "Node.js Performance Tips",
    description: "Optimize your Node.js applications with these proven performance techniques and best practices.",
    category: "Backend Development",
    date: "2025/10/20",
    color: colors[5]
  },
  {
    id: 7,
    title: "Database Design Patterns",
    description: "Essential database design patterns for scalable applications.",
    category: "Database",
    date: "2025/10/22",
    color: colors[6]
  },
  {
    id: 8,
    title: "Microservices Architecture",
    description: "Building scalable applications with microservices architecture patterns and best practices.",
    category: "Architecture",
    date: "2025/10/25",
    color: colors[7]
  },
  {
    id: 9,
    title: "Advanced React Hooks",
    description: "Deep dive into custom hooks and advanced React patterns for better code organization.",
    category: "React Deep Dive",
    date: "2025/10/28",
    color: colors[8]
  },
  {
    id: 10,
    title: "TypeScript Generics Explained",
    description: "Understanding TypeScript generics and how to use them effectively in your projects.",
    category: "TypeScript",
    date: "2025/11/01",
    color: colors[9]
  },
  {
    id: 11,
    title: "Modern CSS Techniques",
    description: "Exploring modern CSS features like container queries, subgrid, and more.",
    category: "CSS Layout",
    date: "2025/11/05",
    color: colors[10]
  },
  {
    id: 12,
    title: "RESTful API Design",
    description: "Best practices for designing RESTful APIs that are scalable and maintainable.",
    category: "Backend Development",
    date: "2025/11/08",
    color: colors[11]
  },
  {
    id: 13,
    title: "Building Modern Web Applications with Next.js",
    description: "Learn how to leverage Next.js features like server-side rendering, static site generation, and API routes to build fast and scalable web applications.",
    category: "Frontend engineering practices",
    date: "2025/11/10",
    color: colors[0]
  },
  {
    id: 14,
    title: "Optimizing Bundle Size in Production",
    description: "Techniques for reducing JavaScript bundle sizes including code splitting, tree shaking, and lazy loading to improve application performance.",
    category: "Performance Optimization",
    date: "2025/11/12",
    color: colors[1]
  },
  {
    id: 15,
    title: "React Context API Deep Dive",
    description: "Understanding React Context API, when to use it, and how to avoid common pitfalls when managing global state in React applications.",
    category: "React Deep Dive",
    date: "2025/11/14",
    color: colors[2]
  },
  {
    id: 16,
    title: "TypeScript Utility Types Guide",
    description: "Master TypeScript utility types like Partial, Pick, Omit, and Record to write more flexible and type-safe code.",
    category: "TypeScript",
    date: "2025/11/16",
    color: colors[3]
  },
  {
    id: 17,
    title: "CSS Custom Properties and Theming",
    description: "Using CSS custom properties (variables) to create dynamic themes and maintainable stylesheets in modern web development.",
    category: "CSS Layout",
    date: "2025/11/18",
    color: colors[4]
  },
  {
    id: 18,
    title: "Express.js Middleware Patterns",
    description: "Understanding Express.js middleware, creating custom middleware, and implementing common patterns for request processing.",
    category: "Backend Development",
    date: "2025/11/20",
    color: colors[5]
  },
  {
    id: 19,
    title: "MongoDB Aggregation Pipeline",
    description: "Master MongoDB aggregation pipeline to perform complex data transformations and analytics on your database collections.",
    category: "Database",
    date: "2025/11/22",
    color: colors[6]
  },
  {
    id: 20,
    title: "System Design Principles",
    description: "Fundamental principles of system design including scalability, reliability, and maintainability for building robust applications.",
    category: "Architecture",
    date: "2025/11/24",
    color: colors[7]
  },
  {
    id: 21,
    title: "Webpack Configuration Best Practices",
    description: "Advanced Webpack configuration techniques for optimizing build performance and managing complex project structures.",
    category: "Frontend engineering practices",
    date: "2025/11/26",
    color: colors[8]
  },
  {
    id: 22,
    title: "Image Optimization Strategies",
    description: "Comprehensive guide to image optimization including format selection, lazy loading, responsive images, and CDN usage.",
    category: "Performance Optimization",
    date: "2025/11/28",
    color: colors[9]
  },
  {
    id: 23,
    title: "React Performance Optimization",
    description: "Advanced techniques for optimizing React applications including memoization, code splitting, and virtual DOM optimization.",
    category: "React Deep Dive",
    date: "2025/11/30",
    color: colors[10]
  },
  {
    id: 24,
    title: "TypeScript Decorators and Metadata",
    description: "Exploring TypeScript decorators, reflection metadata, and how to use them for building powerful frameworks and libraries.",
    category: "TypeScript",
    date: "2025/12/02",
    color: colors[11]
  },
  {
    id: 25,
    title: "Advanced CSS Animations",
    description: "Creating smooth and performant CSS animations using keyframes, transitions, and modern CSS animation techniques.",
    category: "CSS Layout",
    date: "2025/12/04",
    color: colors[0]
  },
  {
    id: 26,
    title: "GraphQL API Development",
    description: "Building efficient GraphQL APIs with proper schema design, resolvers, and best practices for query optimization.",
    category: "Backend Development",
    date: "2025/12/06",
    color: colors[1]
  },
  {
    id: 27,
    title: "Redis Caching Strategies",
    description: "Implementing effective caching strategies with Redis to improve application performance and reduce database load.",
    category: "Database",
    date: "2025/12/08",
    color: colors[2]
  },
  {
    id: 28,
    title: "Event-Driven Architecture",
    description: "Designing scalable systems using event-driven architecture patterns and message queues for decoupled microservices.",
    category: "Architecture",
    date: "2025/12/10",
    color: colors[3]
  },
  {
    id: 29,
    title: "Progressive Web Apps (PWA)",
    description: "Building Progressive Web Apps with service workers, offline support, and app-like experiences for web applications.",
    category: "Frontend engineering practices",
    date: "2025/12/12",
    color: colors[4]
  },
  {
    id: 30,
    title: "Web Security Best Practices",
    description: "Essential web security practices including HTTPS, CSP, XSS prevention, and secure authentication mechanisms for modern web applications.",
    category: "Performance Optimization",
    date: "2025/12/14",
    color: colors[5]
  }
];

