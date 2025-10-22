const express = require('express');
const User = require('../models/User');
const Blog = require('../models/Blog');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

const router = express.Router();

// 获取用户资料
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 获取用户的博客统计
    const blogStats = await Blog.aggregate([
      { $match: { author: user._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalViews: { $sum: '$views' }
      }}
    ]);

    const stats = {
      published: 0,
      draft: 0,
      archived: 0,
      totalViews: 0
    };

    blogStats.forEach(stat => {
      stats[stat._id] = stat.count;
      stats.totalViews += stat.totalViews;
    });

    res.json({
      message: '获取用户资料成功',
      data: {
        user,
        stats
      }
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新用户资料
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const updates = {};

    if (username) {
      // 检查用户名是否已被使用
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: '用户名已被使用' });
      }
      
      updates.username = username;
    }

    if (bio !== undefined) {
      updates.bio = bio;
    }

    if (avatar !== undefined) {
      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: '用户资料更新成功',
      data: user
    });
  } catch (error) {
    console.error('更新用户资料错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取用户的博客列表
router.get('/:id/blogs', validatePagination, async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const { status = 'published' } = req.query;
    const skip = (page - 1) * limit;

    const query = { author: req.params.id };
    
    // 如果是查看自己的博客，显示所有状态
    if (req.user && req.params.id === req.user._id.toString()) {
      if (status !== 'all') {
        query.status = status;
      }
    } else {
      // 查看别人的博客，只显示已发布的
      query.status = 'published';
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);

    res.json({
      message: '获取用户博客列表成功',
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
    console.error('获取用户博客列表错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 获取所有用户（管理员）
router.get('/', authenticateToken, requireAdmin, validatePagination, async (req, res) => {
  try {
    const { page, limit } = req.pagination;
    const { search, role, isActive } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      message: '获取用户列表成功',
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新用户状态（管理员）
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const userId = req.params.id;

    // 不能修改自己的状态
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: '不能修改自己的账户状态' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      message: `用户${isActive ? '启用' : '禁用'}成功`,
      data: user
    });
  } catch (error) {
    console.error('更新用户状态错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 更新用户角色（管理员）
router.put('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: '无效的用户角色' });
    }

    // 不能修改自己的角色
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: '不能修改自己的角色' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json({
      message: '用户角色更新成功',
      data: user
    });
  } catch (error) {
    console.error('更新用户角色错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 删除用户（管理员）
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // 不能删除自己
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: '不能删除自己的账户' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 删除用户的所有博客
    await Blog.deleteMany({ author: userId });

    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
});

module.exports = router;
