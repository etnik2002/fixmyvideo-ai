import express from 'express';
import { getAdminDashboardData, getAdminDashboardOrders, getUsers } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get Admin Dashboard Data
// @route   GET /api/dashboard/admin
// @access  Private/Admin
router.get('/admin', protect, admin, getAdminDashboardData);
router.get('/admin/orders', protect, admin, getAdminDashboardOrders);
router.get('/users', protect, admin, getUsers);


export default router; 