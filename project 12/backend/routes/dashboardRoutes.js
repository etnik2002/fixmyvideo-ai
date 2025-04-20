import express from 'express';
import { getAdminDashboardData , getAdminDashboardOrders} from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get Admin Dashboard Data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
router.get('/admin', protect, admin, getAdminDashboardData);
router.get('/admin/orders', protect, admin, getAdminDashboardOrders);

export default router; 