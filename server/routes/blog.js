const express = require('express');
const Blog = require('../models/Blog');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validateBlog, validatePagination } = require('../middleware/validation');

const router = express.Router();

// 获取博客列表（公开）
router.get('/', optionalAuth, validatePagination, async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const { status = 'published', category, tag, search, author } = req.query;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const query = { status };
    
    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (author) query.author = author;
    if (search) {
      query.$text = { $search: search };
    }

    // 如果是作者查看自己的博客，显示所有状态
    if (req.user && author === req.user._id.toString()) {
      delete query.status;
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);

    res.json({
      message: '获取博客列表成功',
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取博客列表错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取单个博客详情
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('likes', 'username')
      .populate('comments.user', 'username avatar');

    if (!blog) {
      return res.status(404).json({ message: '博客不存在' });
    }

    // 只有作者或已发布的博客才能查看
    if (blog.status !== 'published' && 
        (!req.user || blog.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: '无权限查看此博客' });
    }

    // 增加浏览量
    blog.views += 1;
    await blog.save();

    res.json({
      message: '获取博客详情成功',
      data: blog
    });
  } catch (error) {
    console.error('获取博客详情错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 创建博客
router.post('/', authenticateToken, validateBlog, async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user._id
    };

    const blog = new Blog(blogData);
    await blog.save();
    await blog.populate('author', 'username avatar');

    res.status(201).json({
      message: '博客创建成功',
      data: blog
    });
  } catch (error) {
    console.error('创建博客错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新博客
router.put('/:id', authenticateToken, validateBlog, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: '博客不存在' });
    }

    // 检查权限
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限修改此博客' });
    }

    Object.assign(blog, req.body);
    await blog.save();
    await blog.populate('author', 'username avatar');

    res.json({
      message: '博客更新成功',
      data: blog
    });
  } catch (error) {
    console.error('更新博客错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除博客
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: '博客不存在' });
    }

    // 检查权限
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限删除此博客' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: '博客删除成功' });
  } catch (error) {
    console.error('删除博客错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 点赞/取消点赞博客
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: '博客不存在' });
    }

    const userId = req.user._id;
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex > -1) {
      // 取消点赞
      blog.likes.splice(likeIndex, 1);
      await blog.save();
      res.json({ message: '取消点赞成功', liked: false });
    } else {
      // 点赞
      blog.likes.push(userId);
      await blog.save();
      res.json({ message: '点赞成功', liked: true });
    }
  } catch (error) {
    console.error('点赞操作错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 添加评论
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: '评论内容不能为空' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: '评论最多500个字符' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: '博客不存在' });
    }

    const comment = {
      user: req.user._id,
      content: content.trim()
    };

    blog.comments.push(comment);
    await blog.save();
    await blog.populate('comments.user', 'username avatar');

    const newComment = blog.comments[blog.comments.length - 1];

    res.status(201).json({
      message: '评论添加成功',
      data: newComment
    });
  } catch (error) {
    console.error('添加评论错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取博客统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments({ status: 'published' });
    const totalViews = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    const popularTags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      message: '获取统计信息成功',
      data: {
        totalBlogs,
        totalViews: totalViews[0]?.total || 0,
        popularTags
      }
    });
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
