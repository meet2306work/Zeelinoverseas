const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTickets,
  addReply
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(protect, createTicket)
  .get(protect, authorize('admin'), getTickets);

router.route('/mytickets').get(protect, getMyTickets);

router.route('/:id/replies').post(protect, addReply);

module.exports = router;
