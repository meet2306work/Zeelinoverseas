const SupportTicket = require('../models/SupportTicket');
const ErrorResponse = require('../utils/errorResponse');
const sendResponse = require('../utils/responseFormatter');

// @desc    Create new support ticket
// @route   POST /v1/tickets
// @access  Private
exports.createTicket = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const ticket = await SupportTicket.create(req.body);
    sendResponse(res, 201, 'Support ticket created successfully', ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tickets
// @route   GET /v1/tickets/mytickets
// @access  Private
exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort('-createdAt');
    sendResponse(res, 200, 'Tickets fetched successfully', tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets
// @route   GET /v1/tickets
// @access  Private/Admin
exports.getTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find().populate('user', 'firstName lastName email').sort('-createdAt');
    sendResponse(res, 200, 'All tickets fetched successfully', tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Add reply to ticket
// @route   POST /v1/tickets/:id/replies
// @access  Private
exports.addReply = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return next(new ErrorResponse('Ticket not found', 404));
    }

    // Must be ticket owner or admin
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized', 401));
    }

    const reply = {
      user: req.user.id,
      message: req.body.message
    };

    ticket.replies.push(reply);

    // If admin replies, status might be changed to In Progress
    if (req.user.role === 'admin') {
      ticket.status = req.body.status || 'In Progress';
    }

    await ticket.save();

    sendResponse(res, 201, 'Reply added successfully', ticket);
  } catch (error) {
    next(error);
  }
};
