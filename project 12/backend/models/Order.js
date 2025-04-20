import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  orderId: { // A custom, potentially shorter ID for display/reference
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String
  },
  items: [{ name: String, quantity: Number, price: Number }],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    default: 'pending',
  },
  stripePaymentIntentId: { // Store Stripe Payment Intent ID
    type: String,
  },
  // Store uploaded images as Base64 strings
  uploadedImages: [{
    filename: String,
    contentType: String,
    data: String, // Base64 encoded image data
  }],
  // Store the final processed video/image as Base64
  processedVideo: {
    filename: String,
    contentType: String,
    data: String, // Base64 encoded data
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Order = mongoose.model('Order', orderSchema);

export default Order; 