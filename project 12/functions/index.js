const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "");

admin.initializeApp();

// Create a Stripe checkout session when a document is added to the stripeCheckout collection
exports.createStripeCheckout = functions.firestore
  .document('stripeCheckout/{docId}')
  .onCreate(async (snap, context) => {
    try {
      const data = snap.data();
      const { priceId, successUrl, cancelUrl, userId, mode, upsellOptions = [], additionalFormats = 0 } = data;

      // Get or create a Stripe customer
      let customerId;
      const customerSnapshot = await admin.firestore()
        .collection('customers')
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (customerSnapshot.empty) {
        // Get user email from auth
        let email = 'guest@example.com'; // Default for guest users
        
        if (userId !== 'guest') {
          try {
            const user = await admin.auth().getUser(userId);
            email = user.email;
          } catch (error) {
            console.error('Error getting user:', error);
          }
        }
        
        // Create a new customer
        const customer = await stripe.customers.create({
          email,
          metadata: { userId }
        });
        
        // Save customer to Firestore
        await admin.firestore().collection('customers').add({
          userId,
          customerId: customer.id,
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        customerId = customer.id;
      } else {
        customerId = customerSnapshot.docs[0].data().customerId;
      }

      // Create line items array
      const lineItems = [
        {
          price: priceId,
          quantity: 1
        }
      ];
      
      // Add upsell options if any
      if (upsellOptions && upsellOptions.length > 0) {
        // You would need to map these to actual Stripe price IDs
        // This is a simplified example
        for (const option of upsellOptions) {
          // Get price ID for this option from your config
          const optionPriceId = getUpsellPriceId(option);
          if (optionPriceId) {
            lineItems.push({
              price: optionPriceId,
              quantity: 1
            });
          }
        }
      }
      
      // Add additional formats if any
      if (additionalFormats > 0) {
        // Get price ID for additional format
        const formatPriceId = getAdditionalFormatPriceId();
        if (formatPriceId) {
          lineItems.push({
            price: formatPriceId,
            quantity: additionalFormats
          });
        }
      }

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: mode || 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl
      });

      // Update the document with the session ID and URL
      await snap.ref.update({
        sessionId: session.id,
        sessionUrl: session.url,
        status: 'created',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // Update the document with the error
      await snap.ref.update({
        error: error.message,
        status: 'error',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return { error: error.message };
    }
  });

// Helper function to get upsell price ID
function getUpsellPriceId(optionId) {
  // This would be replaced with your actual mapping logic
  const priceMap = {
    '4k-resolution': process.env.STRIPE_PRICE_4K || 'price_4k',
    'additional-format': process.env.STRIPE_PRICE_FORMAT || 'price_format',
    'express-delivery': process.env.STRIPE_PRICE_EXPRESS || 'price_express',
    'color-correction': process.env.STRIPE_PRICE_COLOR || 'price_color',
    'custom-effects': process.env.STRIPE_PRICE_EFFECTS || 'price_effects',
    'source-files': process.env.STRIPE_PRICE_SOURCE || 'price_source'
  };
  
  return priceMap[optionId];
}

// Helper function to get additional format price ID
function getAdditionalFormatPriceId() {
  return process.env.STRIPE_PRICE_FORMAT || 'price_format';
}

// Webhook handler for Stripe events
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Get customer ID
      const customerId = session.customer;
      
      // Find the customer in Firestore
      const customerSnapshot = await admin.firestore()
        .collection('customers')
        .where('customerId', '==', customerId)
        .limit(1)
        .get();
      
      if (!customerSnapshot.empty) {
        const userId = customerSnapshot.docs[0].data().userId;
        
        // Create an order record
        await admin.firestore().collection('orders').add({
          userId,
          sessionId: session.id,
          paymentIntentId: session.payment_intent,
          amount: session.amount_total,
          status: 'In Bearbeitung',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.status(200).send({ received: true });
});

// Function to move files from temporary storage to permanent storage
exports.moveFilesToOrderFolder = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    try {
      const orderData = snap.data();
      const { userId, orderId: orderIdentifier } = orderData;
      
      if (!userId || !orderIdentifier) {
        console.log('Missing userId or orderId, skipping file move');
        return null;
      }
      
      // Get the storage bucket
      const bucket = admin.storage().bucket();
      
      // Source and destination paths
      const tempPath = `temp-uploads/${userId}/`;
      const destPath = `orders/${userId}/${orderIdentifier}/`;
      
      // List files in the temp folder
      const [files] = await bucket.getFiles({ prefix: tempPath });
      
      if (files.length === 0) {
        console.log('No files found in temp folder');
        return null;
      }
      
      // Move each file
      const movePromises = files.map(async (file) => {
        const fileName = file.name.split('/').pop();
        const newFilePath = `${destPath}${fileName}`;
        
        // Copy the file to the new location
        await file.copy(newFilePath);
        
        // Delete the original file
        await file.delete();
        
        return newFilePath;
      });
      
      await Promise.all(movePromises);
      
      console.log(`Moved ${files.length} files to order folder ${orderIdentifier}`);
      return { success: true, filesMoved: files.length };
    } catch (error) {
      console.error('Error moving files:', error);
      return { error: error.message };
    }
  });

// Function to generate a signed URL for video download
exports.getSignedDownloadUrl = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to download files'
    );
  }
  
  try {
    const { filePath } = data;
    
    if (!filePath) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'File path is required'
      );
    }
    
    // Check if the user has access to this file
    // Extract userId from the path (assuming format: orders/userId/orderId/...)
    const pathParts = filePath.split('/');
    if (pathParts[0] === 'orders' && pathParts[1] !== context.auth.uid) {
      // Check if user is the owner of this file
      if (pathParts[1] !== context.auth.uid) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'You do not have permission to access this file'
        );
      }
    }
    
    // Generate a signed URL that expires in 15 minutes
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });
    
    return { url };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});