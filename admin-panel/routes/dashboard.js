const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth, requirePermission } = require('../middlewares/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', auth, requirePermission('dashboard'), async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Total counts
    const totalUsers = await User.countDocuments({ isBlocked: false });
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    // Today's stats
    const todayUsers = await User.countDocuments({
      isBlocked: false,
      createdAt: { $gte: startOfDay }
    });
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay }
    });
    const todayRevenue = await Order.aggregate([
      { $match: { 
        'payment.status': 'completed',
        createdAt: { $gte: startOfDay }
      }},
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    // Monthly stats
    const monthlyUsers = await User.countDocuments({
      isBlocked: false,
      createdAt: { $gte: startOfMonth }
    });
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const monthlyRevenue = await Order.aggregate([
      { $match: { 
        'payment.status': 'completed',
        createdAt: { $gte: startOfMonth }
      }},
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    // Yearly stats
    const yearlyUsers = await User.countDocuments({
      isBlocked: false,
      createdAt: { $gte: startOfYear }
    });
    const yearlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfYear }
    });
    const yearlyRevenue = await Order.aggregate([
      { $match: { 
        'payment.status': 'completed',
        createdAt: { $gte: startOfYear }
      }},
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { 
        _id: '$items.product',
        name: { $first: '$items.name' },
        sku: { $first: '$items.sku' },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Order status distribution
    const orderStatusStats = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Payment method distribution
    const paymentMethodStats = await Order.aggregate([
      { $group: { _id: '$payment.method', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly sales data for chart
    const monthlySales = await Order.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          createdAt: { $gte: new Date(now.getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // User registration trend
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      status: 'active',
      trackInventory: true,
      stock: { $lte: '$lowStockThreshold' }
    })
    .select('name sku stock lowStockThreshold')
    .sort({ stock: 1 })
    .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers: totalUsers || 0,
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        today: {
          users: todayUsers || 0,
          orders: todayOrders || 0,
          revenue: todayRevenue[0]?.total || 0
        },
        monthly: {
          users: monthlyUsers || 0,
          orders: monthlyOrders || 0,
          revenue: monthlyRevenue[0]?.total || 0
        },
        yearly: {
          users: yearlyUsers || 0,
          orders: yearlyOrders || 0,
          revenue: yearlyRevenue[0]?.total || 0
        },
        recentOrders,
        topProducts,
        orderStatusStats,
        paymentMethodStats,
        charts: {
          monthlySales,
          userRegistrations
        },
        alerts: {
          lowStockProducts: lowStockProducts.length
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
});

// Get sales analytics
router.get('/sales', auth, requirePermission('dashboard'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const salesData = await Order.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$pricing.total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          sku: { $first: '$items.sku' },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesData,
        topSellingProducts
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sales analytics'
    });
  }
});

// Get user analytics
router.get('/users', auth, requirePermission('users'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentUsers = await User.find({ isBlocked: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName email role createdAt');

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        userStats,
        recentUsers
      }
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user analytics'
    });
  }
});

// Get order analytics
router.get('/orders', auth, requirePermission('orders'), async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orderTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const paymentMethodBreakdown = await Order.aggregate([
      { $group: { _id: '$payment.method', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        orderTrend,
        orderStatusBreakdown,
        paymentMethodBreakdown
      }
    });
  } catch (error) {
    console.error('Order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order analytics'
    });
  }
});

module.exports = router;
