const express = require('express');
const VisitLog = require('../models/VisitLog');
const { success, error, serverError } = require('../utils/response');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * 获取客户端 IP 地址
 */
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         req.ip ||
         'unknown';
};

/**
 * 记录页面访问
 * POST /api/analytics/visit
 */
router.post('/visit', async (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      path,
      referer,
      userAgent,
      screenWidth,
      screenHeight,
      language,
      timestamp
    } = req.body;

    // 验证必要字段
    if (!visitorId || !sessionId || !path) {
      return error(res, '缺少必要参数', 400);
    }

    const clientIp = getClientIp(req);

    // 创建访问记录
    const visitLog = await VisitLog.create({
      visitorId,
      sessionId,
      path,
      referer: referer || null,
      userAgent: userAgent || req.get('user-agent') || 'unknown',
      ip: clientIp,
      screenWidth: screenWidth || null,
      screenHeight: screenHeight || null,
      language: language || 'unknown',
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    return success(res, { id: visitLog._id }, '访问记录已保存');
  } catch (err) {
    console.error('记录访问日志错误:', err);
    return serverError(res);
  }
});

/**
 * 记录事件
 * POST /api/analytics/event
 */
router.post('/event', async (req, res) => {
  try {
    const {
      visitorId,
      sessionId,
      event,
      category,
      label,
      value,
      timestamp
    } = req.body;

    // 验证必要字段
    if (!visitorId || !sessionId || !event) {
      return error(res, '缺少必要参数', 400);
    }

    // 创建事件记录
    const eventLog = await VisitLog.create({
      visitorId,
      sessionId,
      path: req.body.path || null,
      eventType: 'event',
      event,
      category: category || null,
      label: label || null,
      value: value || null,
      userAgent: req.get('user-agent') || 'unknown',
      ip: getClientIp(req),
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    return success(res, { id: eventLog._id }, '事件记录已保存');
  } catch (err) {
    console.error('记录事件日志错误:', err);
    return serverError(res);
  }
});

/**
 * 获取访问统计（需要认证）
 * GET /api/analytics/stats
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage = {};
    
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) {
        matchStage.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.timestamp.$lte = new Date(endDate);
      }
    }

    // 按日期分组统计
    const stats = await VisitLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupBy === 'hour' ? '%Y-%m-%d %H:00:00' : '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' },
          uniqueSessions: { $addToSet: '$sessionId' }
        }
      },
      {
        $project: {
          date: '$_id',
          visits: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          uniqueSessions: { $size: '$uniqueSessions' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // 获取热门页面
    const popularPages = await VisitLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$path',
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          path: '$_id',
          visits: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' }
        }
      },
      { $sort: { visits: -1 } },
      { $limit: 10 }
    ]);

    // 获取总统计
    const totalStats = await VisitLog.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' },
          uniqueSessions: { $addToSet: '$sessionId' }
        }
      },
      {
        $project: {
          totalVisits: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          uniqueSessions: { $size: '$uniqueSessions' }
        }
      }
    ]);

    return success(res, {
      stats,
      popularPages,
      totals: totalStats[0] || {
        totalVisits: 0,
        uniqueVisitors: 0,
        uniqueSessions: 0
      }
    }, '获取统计信息成功');
  } catch (err) {
    console.error('获取访问统计错误:', err);
    return serverError(res);
  }
});

module.exports = router;

