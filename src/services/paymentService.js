import apiClient from './apiClient';

// Helper to load external scripts dynamically (required for Razorpay and PayPal SDKs)
const loadExternalScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const paymentService = {
  // 1. Stripe Checkout Integration
  initializeStripePayment: async (orderId, amount) => {
    // Calls backend API to generate Stripe Payment Intent / Client Secret
    const response = await apiClient.post('/payments/stripe/create-intent', { orderId, amount });
    return response.data; // { clientSecret, publicKey }
  },

  // 2. Razorpay Integration
  initializeRazorpayPayment: async ({ orderId, amount, currency = 'INR', customerInfo, onSuccess, onFailure }) => {
    const isScriptLoaded = await loadExternalScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!isScriptLoaded) {
      alert('Failed to load Razorpay SDK. Please check your network connection.');
      return;
    }

    // Call backend API to create a Razorpay Order ID
    const orderResponse = await apiClient.post('/payments/razorpay/create-order', { orderId, amount, currency });
    const { razorpayOrderId, keyId } = orderResponse.data;

    const options = {
      key: keyId,
      amount: amount * 100, // in paise
      currency,
      name: 'Zeelinoverseas Ltd',
      description: `Invoice Payment for Order ${orderId}`,
      order_id: razorpayOrderId,
      handler: async function (response) {
        // Handle successful payment, verify signature on backend
        try {
          const verificationResponse = await apiClient.post('/payments/razorpay/verify-signature', {
            orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
          if (onSuccess) onSuccess(verificationResponse.data);
        } catch (err) {
          if (onFailure) onFailure(err);
        }
      },
      prefill: {
        name: customerInfo.name || '',
        email: customerInfo.email || '',
        contact: customerInfo.contact || '',
      },
      theme: {
        color: '#0d9488', // Luxury Teal
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onFailure) onFailure(response.error);
    });
    rzp.open();
  },

  // 3. PayPal Integration
  initializePayPalPayment: async (orderId, amount) => {
    // Generate PayPal order intent
    const response = await apiClient.post('/payments/paypal/create-order', { orderId, amount });
    return response.data; // { approvalUrl }
  },

  // 4. UPI / Bank Wire Transfer logger
  recordWireTransfer: async (orderId, transferData) => {
    // Submit bank receipt file for administrative auditing
    const response = await apiClient.post(`/payments/wire-transfer/${orderId}`, transferData);
    return response.data;
  },
};

export default paymentService;
