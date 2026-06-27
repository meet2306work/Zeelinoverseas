const paymentUnavailable = async () => {
  throw new Error('Online payment integration is not configured yet.');
};

export const paymentService = {
  initializeStripePayment: paymentUnavailable,
  initializeRazorpayPayment: paymentUnavailable,
  initializePayPalPayment: paymentUnavailable,
  recordWireTransfer: paymentUnavailable,
};

export default paymentService;
