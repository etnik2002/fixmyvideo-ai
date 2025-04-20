import express from 'express';
import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js'; // Assuming Order model stores payment details
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'; // Default to common Vite dev port

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private
router.post('/create-checkout-session', protect, asyncHandler(async (req, res) => {
    const { orderId, amount, currency = 'usd', description = 'Video Fix Service' } = req.body; // Expect orderId, amount
    const userId = req.user._id;

    if (!orderId || !amount) {
        res.status(400);
        throw new Error('Missing orderId or amount for payment session');
    }

    // You might want to validate the amount against the actual order details from your DB
    // const order = await Order.findById(orderId);
    // if (!order || order.user.toString() !== userId.toString() || order.totalAmount !== amount) {
    //     res.status(400);
    //     throw new Error('Invalid order details or amount');
    // }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: description,
                            // You can add more details here if needed
                        },
                        unit_amount: Math.round(amount * 100), // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
            cancel_url: `${clientUrl}/payment/cancel?orderId=${orderId}`,
            client_reference_id: orderId, // Link session to your internal order ID
            metadata: { // Add any metadata you need
                userId: userId.toString(),
                orderId: orderId.toString(),
            }
        });

        res.json({ id: session.id, url: session.url });

    } catch (error) {
        console.error("Stripe session creation failed:", error);
        res.status(500).json({ error: error.message });
    }
}));

// @desc    Verify payment status after redirect (using session ID)
// @route   GET /api/payments/verify-payment/:sessionId
// @access  Private
router.get('/verify-payment/:sessionId', protect, asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Basic check: Ensure the session belongs to the logged-in user if needed
        // if (session.metadata.userId !== req.user._id.toString()) {
        //     res.status(403);
        //     throw new Error('Session does not belong to this user');
        // }

        console.log({ajdindallenajdini: req.query.orderId})
        if (session.payment_status === 'paid') {
            const order = await Order.findOneAndUpdate(
                { orderId: req.query.orderId },
                { status: 'processing', paymentIntentId: session.payment_intent.id },
                { new: true }
            );
            if (!order) {
                throw new Error('Order not found or user mismatch after payment success');
            }

            res.json({
                status: session.payment_status,
                paymentIntentId: session.payment_intent,
                orderId: session.client_reference_id,
                customerEmail: session.customer_details?.email
            });
        } else {
            res.status(400).json({ status: session.payment_status, message: 'Payment not successful' });
        }
    } catch (error) {
        console.error("Stripe payment verification failed:", error);
        res.status(500).json({ error: error.message });
    }
}));

// Optional: Stripe Webhook Endpoint (Recommended for reliable status updates)
// You would need to configure this endpoint in your Stripe dashboard
// router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//   let event;
//
//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error(`Webhook signature verification failed.`, err.message);
//     return res.sendStatus(400);
//   }
//
//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object;
//       console.log('Checkout Session Completed:', session.id);
//       // Fulfill the purchase (e.g., update DB, send email)
//       // Find order using session.client_reference_id
//       // Update order status to 'processing' or 'completed'
//       // Order.findOneAndUpdate({ orderId: session.client_reference_id }, { status: 'processing', paymentIntentId: session.payment_intent });
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//
//   // Return a 200 response to acknowledge receipt of the event
//   res.json({received: true});
// });

export default router; 