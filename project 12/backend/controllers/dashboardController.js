import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get data aggregated for the admin dashboard
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboardData = asyncHandler(async (req, res) => {

  // --- Order Counts ---
  const totalOrdersPromise = Order.countDocuments();
  const pendingOrdersPromise = Order.countDocuments({ status: 'pending' });
  const processingOrdersPromise = Order.countDocuments({ status: 'processing' });
  const completedOrdersPromise = Order.countDocuments({ status: 'completed' });

  // --- Revenue Stats ---
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const revenueStatsPromise = Order.aggregate([
    {
      $group: {
        _id: null, // Group all documents together
        totalRevenue: { $sum: "$totalAmount" }, // Sum the totalAmount field
      }
    },
    {
      $lookup: { // Perform a lookup to calculate monthly revenue in the same pipeline (more efficient)
        from: "orders", // The collection to join
        pipeline: [
          {
            $match: {
              createdAt: { $gte: firstDayOfMonth } // Filter orders created this month
            }
          },
          {
            $group: {
              _id: null,
              monthlyRevenue: { $sum: "$totalAmount" }
            }
          }
        ],
        as: "monthlyData" // Output array field name
      }
    },
    {
      $unwind: { // Deconstruct the monthlyData array (it will have 0 or 1 element)
        path: "$monthlyData",
        preserveNullAndEmptyArrays: true // Keep the document even if no orders this month
      }
    },
    {
      $project: { // Select and reshape the output
        _id: 0, // Exclude the default _id
        totalRevenue: 1,
        monthlyRevenue: { $ifNull: ["$monthlyData.monthlyRevenue", 0] } // Default to 0 if no monthly data
      }
    }
  ]);

  // --- User Counts ---
  const totalUsersPromise = User.countDocuments();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const newUsersPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

  // --- Recent Orders ---
  const recentOrdersPromise = Order.find()
    .sort({ createdAt: -1 })
    // .select("-uploadedImages")
    .limit(10) // Get latest 10 orders
    .populate('user', 'name email'); // Populate user details

  // --- Execute all promises in parallel ---
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      revenueResults,
      totalUsers,
      newUsers,
      recentOrders
    ] = await Promise.all([
      totalOrdersPromise,
      pendingOrdersPromise,
      processingOrdersPromise,
      completedOrdersPromise,
      revenueStatsPromise,
      totalUsersPromise,
      newUsersPromise,
      recentOrdersPromise
    ]);

    // Extract revenue results (aggregation returns an array)
    const revenueStats = revenueResults[0] || { totalRevenue: 0, monthlyRevenue: 0 };
    const averageOrderValue = totalOrders > 0 ? revenueStats.totalRevenue / totalOrders : 0;

    res.json({
      orderStats: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
      },
      revenueStats: {
        totalRevenue: revenueStats.totalRevenue,
        monthlyRevenue: revenueStats.monthlyRevenue,
        averageOrderValue: averageOrderValue,
      },
      userStats: {
        totalUsers: totalUsers,
        newUsers: newUsers,
      },
      recentOrders: recentOrders,
    });

  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500);
    throw new Error('Server error fetching dashboard data');
  }
});
const getAdminDashboardOrders = asyncHandler(async (req, res) => {
  try {
    return res.json({ data: await Order.find({}).select("-uploadedImages") })
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500);
    throw new Error('Server error fetching dashboard data');
  }
});
const getUsers = asyncHandler(async (req, res) => {
  try {
    return res.json({ data: await User.find({}) })
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500);
    throw new Error('Server error fetching dashboard data');
  }
});

export { getAdminDashboardData, getAdminDashboardOrders, getUsers }; 