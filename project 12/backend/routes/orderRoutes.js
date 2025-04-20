import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import User from '../models/User.js'; // Needed for populating user info
import { v4 as uuidv4 } from 'uuid'; // For generating unique order IDs
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Helper function to generate a unique, shorter order ID (example)
function generateOrderId() {
  // Simple example: timestamp + short random string
  return `FX-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
}

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, asyncHandler(async (req, res) => {
    console.log("zi")
    const orders = await Order.find({ user: req.user._id }).sort({  }); 
    console.log({orders, user: req.user})
    res.json({data: orders});
}));


// @desc    Create a new order with payment intent
// @route   POST /api/orders
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { packageType, totalAmount, items, currency = 'chf', description } = req.body;
  console.log(req.body)
  const userId = req.user._id;

  // Basic validation
  if (!packageType || !totalAmount) {
    res.status(400);
    throw new Error('Missing order details');
  }

  // Validate package type
  const validPackageTypes = ['spark', 'flash', 'ultra'];
  if (!validPackageTypes.includes(packageType.toLowerCase())) {
    res.status(400);
    throw new Error('Invalid package type specified');
  }

  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: userId.toString(),
        packageType: packageType
      }
    });

    // Create the order with payment information
    const order = new Order({
      user: userId,
      orderId: generateOrderId(),
      packageType: packageType,
      items: items || [],
      total: totalAmount, // Store the actual amount
      currency: currency,
      status: 'pending',
      paymentStatus: 'pending',
      stripePaymentIntentId: paymentIntent.id, // Save the payment intent ID
      uploadedImages: [],
      description
    });

    const createdOrder = await order.save();

    // Return order info and payment details for frontend
    res.status(201).json({
      order: createdOrder,
      paymentIntent: {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      }
    });
  } catch (error) {
    // Handle Stripe API errors
    console.error('Payment intent creation error:', error);
    res.status(400);
    throw new Error(`Failed to create payment: ${error.message}`);
  }
}));

// @desc    Upload images for an order (saves as Base64)
// @route   POST /api/orders/:orderId/upload
// @access  Private
// Note: This expects JSON body with files array [{ filename, contentType, data (base64) }]
router.post('/:orderId/upload', protect, asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { files } = req.body; // Expecting an array of file objects in the body
    const userId = req.user._id;

    if (!files || !Array.isArray(files) || files.length === 0) {
        res.status(400);
        throw new Error('No files provided in the request body');
    }

    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Ensure the order belongs to the logged-in user
    if (order.user.toString() !== userId.toString()) {
        res.status(403); // Forbidden
        throw new Error('User not authorized to upload to this order');
    }

    // Validate file objects and add to order
    const imageDocs = files.map(file => {
        if (!file.filename || !file.contentType || !file.data) {
            throw new Error('Invalid file object structure. Required fields: filename, contentType, data (base64)');
        }
        // Basic validation for Base64 pattern (optional but recommended)
        // const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        // if (!base64Regex.test(file.data)) {
        //     throw new Error(`Invalid Base64 data for file: ${file.filename}`);
        // }
        return {
            filename: file.filename,
            contentType: file.contentType,
            data: file.data, // Store the Base64 string directly
        };
    });

    order.uploadedImages.push(...imageDocs);
    // Optionally update status
    // order.status = 'processing'; // Or some other status indicating files received

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
}));


// @desc    Get order by ID
// @route   GET /api/orders/:orderId
// @access  Private
router.get('/:orderId', protect, asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId: orderId }).populate('user', 'name email'); // Populate user details

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Ensure the order belongs to the logged-in user OR user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); // Forbidden
        throw new Error('User not authorized to view this order');
    }

    res.json(order);
}));





// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
}));

// @desc    Update order status (e.g., mark as completed)
// @route   PUT /api/orders/:orderId/status
// @access  Private/Admin
router.put('/:orderId/status', protect, admin, asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId: orderId });

    if (order) {
        order.status = status;
        // If marking completed, potentially add processed video data here
        // if (status === 'completed' && req.body.processedVideo) {
        //    const { filename, contentType, data } = req.body.processedVideo;
        //     if(filename && contentType && data) {
        //         order.processedVideo = { filename, contentType, data };
        //     } else {
        //         res.status(400);
        //         throw new Error('Invalid processed video data structure');
        //     }
        // }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
}));

// @desc    Upload processed video/image for an order (saves as Base64)
// @route   POST /api/orders/:orderId/processed
// @access  Private/Admin
router.post('/:orderId/processed', protect, admin, asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { filename, contentType, data } = req.body; // Expecting single file object

    if (!filename || !contentType || !data) {
        res.status(400);
        throw new Error('Invalid processed file data structure. Required fields: filename, contentType, data (base64)');
    }

    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.processedVideo = { filename, contentType, data };
    order.status = 'completed'; // Assuming upload means completion

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
}));


export default router; 