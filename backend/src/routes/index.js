const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');

const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const rfqRoutes = require('./rfqRoutes');
const uploadRoutes = require('./uploadRoutes');
const ticketRoutes = require('./ticketRoutes');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// Re-route into other resource routers
const reviewRouter = require('./reviewRoutes');
router.use('/:productId/reviews', reviewRouter);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/rfq', rfqRoutes);
router.use('/uploads', uploadRoutes);
router.use('/tickets', ticketRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
