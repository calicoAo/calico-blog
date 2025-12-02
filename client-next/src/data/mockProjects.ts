/**
 * 项目数据类型和模拟数据
 * 
 * @author lijingru
 * @created 2025-11-13
 */

export interface Project {
  id: number;
  name: string;
  description: string;
  fullDescription?: string; // 详情页使用的完整描述
  image: string;
  link?: string; // 项目链接
  github?: string; // GitHub 链接
  technologies: string[]; // 技术栈标签
  category?: string; // 项目分类
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
  status?: 'completed' | 'ongoing' | 'archived'; // 项目状态
  features?: string[]; // 主要功能特性
  screenshots?: string[]; // 项目截图
}

/**
 * 模拟项目数据
 */
export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Calico Blog',
    description: '一个现代化的个人博客系统，支持文章发布、分类管理和响应式设计。',
    fullDescription: `
      <h2>项目简介</h2>
      <p>Calico Blog 是一个基于 React + TypeScript + Vite 构建的现代化个人博客系统。该项目采用前后端分离架构，提供了完整的文章管理、分类筛选、用户认证等功能。</p>
      
      <h2>核心功能</h2>
      <ul>
        <li>富文本编辑器：基于 Tiptap 的强大编辑器，支持 Markdown、代码高亮等</li>
        <li>文章管理：支持发布、编辑、删除、草稿保存等完整流程</li>
        <li>分类系统：灵活的文章分类和标签管理</li>
        <li>响应式设计：完美适配桌面端和移动端</li>
        <li>用户认证：基于 JWT 的安全认证系统</li>
        <li>瀑布流布局：美观的文章展示方式</li>
      </ul>
      
      <h2>技术亮点</h2>
      <p>项目采用了最新的前端技术栈，包括 React Hooks、Framer Motion 动画库、Tailwind CSS 等，确保了良好的用户体验和开发体验。</p>
      
      <h2>项目架构</h2>
      <p>前端使用 Vite 作为构建工具，后端采用 Express.js + MongoDB，实现了 RESTful API 设计。整个项目遵循模块化、组件化的开发理念。</p>
    `,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    link: 'https://github.com/yourusername/calico-blog',
    github: 'https://github.com/yourusername/calico-blog',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Express.js', 'MongoDB', 'JWT'],
    category: 'Web Application',
    startDate: '2025-10-01',
    status: 'ongoing',
    features: [
      '富文本编辑器',
      '文章管理',
      '分类系统',
      '用户认证',
      '响应式设计'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop'
    ]
  },
  {
    id: 2,
    name: 'E-Commerce Platform',
    description: '全栈电商平台，包含商品管理、购物车、订单处理等完整功能。',
    fullDescription: `
      <h2>项目简介</h2>
      <p>一个功能完整的电商平台，支持商品浏览、购物车管理、订单处理、支付集成等核心电商功能。</p>
      
      <h2>核心功能</h2>
      <ul>
        <li>商品管理：商品分类、搜索、筛选</li>
        <li>购物车系统：实时更新、持久化存储</li>
        <li>订单管理：订单创建、跟踪、历史记录</li>
        <li>支付集成：支持多种支付方式</li>
        <li>用户中心：个人信息、订单管理</li>
      </ul>
      
      <h2>技术架构</h2>
      <p>采用微服务架构，前端使用 Next.js 实现 SSR，后端使用 Node.js + PostgreSQL，支付系统集成 Stripe API。</p>
    `,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    link: 'https://ecommerce-demo.example.com',
    github: 'https://github.com/yourusername/ecommerce-platform',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
    category: 'E-Commerce',
    startDate: '2025-08-01',
    endDate: '2025-09-30',
    status: 'completed',
    features: [
      '商品管理',
      '购物车',
      '订单处理',
      '支付集成',
      '用户中心'
    ]
  },
  {
    id: 3,
    name: 'Task Management App',
    description: '团队协作任务管理工具，支持看板视图、任务分配和进度跟踪。',
    fullDescription: `
      <h2>项目简介</h2>
      <p>一个现代化的任务管理应用，帮助团队高效协作，支持看板视图、任务分配、进度跟踪等功能。</p>
      
      <h2>核心功能</h2>
      <ul>
        <li>看板视图：直观的任务管理界面</li>
        <li>任务分配：支持多用户协作</li>
        <li>进度跟踪：实时更新任务状态</li>
        <li>通知系统：任务更新提醒</li>
        <li>数据可视化：项目进度图表</li>
      </ul>
      
      <h2>技术特点</h2>
      <p>使用 React + Redux 管理状态，WebSocket 实现实时更新，支持拖拽排序等交互功能。</p>
    `,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    link: 'https://taskapp-demo.example.com',
    github: 'https://github.com/yourusername/task-management',
    technologies: ['React', 'Redux', 'WebSocket', 'Node.js', 'MongoDB', 'Material-UI'],
    category: 'Productivity',
    startDate: '2025-07-01',
    endDate: '2025-07-31',
    status: 'completed',
    features: [
      '看板视图',
      '任务分配',
      '进度跟踪',
      '实时通知',
      '数据可视化'
    ]
  },
  {
    id: 4,
    name: 'Weather Dashboard',
    description: '实时天气数据展示面板，支持多城市查询和天气预警。',
    fullDescription: `
      <h2>项目简介</h2>
      <p>一个美观实用的天气数据展示应用，提供实时天气信息、多城市查询、天气预警等功能。</p>
      
      <h2>核心功能</h2>
      <ul>
        <li>实时天气：获取最新天气数据</li>
        <li>多城市查询：支持添加多个城市</li>
        <li>天气预警：恶劣天气提醒</li>
        <li>数据可视化：温度、湿度等图表展示</li>
        <li>位置服务：自动定位当前城市</li>
      </ul>
      
      <h2>技术实现</h2>
      <p>集成 OpenWeatherMap API，使用 Chart.js 进行数据可视化，支持 PWA 离线访问。</p>
    `,
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
    link: 'https://weather-demo.example.com',
    github: 'https://github.com/yourusername/weather-dashboard',
    technologies: ['Vue.js', 'Chart.js', 'PWA', 'OpenWeatherMap API', 'Vite'],
    category: 'Utility',
    startDate: '2025-06-01',
    endDate: '2025-06-20',
    status: 'completed',
    features: [
      '实时天气',
      '多城市查询',
      '天气预警',
      '数据可视化',
      'PWA 支持'
    ]
  },
  {
    id: 5,
    name: 'Social Media Analytics',
    description: '社交媒体数据分析平台，提供内容分析和用户洞察。',
    fullDescription: `
      <h2>项目简介</h2>
      <p>一个强大的社交媒体数据分析平台，帮助用户了解内容表现和用户行为。</p>
      
      <h2>核心功能</h2>
      <ul>
        <li>内容分析：文章、视频等内容的性能分析</li>
        <li>用户洞察：用户画像和行为分析</li>
        <li>数据报表：自动生成分析报告</li>
        <li>多平台支持：支持多个社交媒体平台</li>
        <li>实时监控：实时数据更新</li>
      </ul>
      
      <h2>技术架构</h2>
      <p>使用 Python 进行数据处理，React 构建前端界面，集成多个社交媒体 API。</p>
    `,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    link: 'https://analytics-demo.example.com',
    github: 'https://github.com/yourusername/social-analytics',
    technologies: ['React', 'Python', 'Django', 'PostgreSQL', 'Chart.js', 'REST API'],
    category: 'Analytics',
    startDate: '2025-05-01',
    status: 'ongoing',
    features: [
      '内容分析',
      '用户洞察',
      '数据报表',
      '多平台支持',
      '实时监控'
    ]
  },
  {
    id: 6,
    name: 'Music Player',
    description: '现代化的音乐播放器，支持播放列表、歌词显示和音效调节。',
    fullDescription: `
      <h2>项目简介</h2>
      <p>一个功能丰富的音乐播放器应用，提供流畅的播放体验和丰富的功能。</p>
      
      <h2>核心功能</h2>
      <ul>
        <li>音乐播放：支持多种音频格式</li>
        <li>播放列表：创建和管理播放列表</li>
        <li>歌词显示：同步歌词展示</li>
        <li>音效调节：均衡器和音效设置</li>
        <li>搜索功能：快速查找音乐</li>
      </ul>
      
      <h2>技术特点</h2>
      <p>使用 Web Audio API 实现音频处理，支持本地文件和在线流媒体播放。</p>
    `,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    link: 'https://musicplayer-demo.example.com',
    github: 'https://github.com/yourusername/music-player',
    technologies: ['React', 'Web Audio API', 'IndexedDB', 'Tailwind CSS', 'Vite'],
    category: 'Entertainment',
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    status: 'completed',
    features: [
      '音乐播放',
      '播放列表',
      '歌词显示',
      '音效调节',
      '搜索功能'
    ]
  }
];

