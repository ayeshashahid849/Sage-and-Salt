const express = require('express');
const {
  getAllFeedback,
  respondToFeedback,
  deleteFeedback,
  searchFeedback
} = require('../controllers/feedbackController');

const router = express.Router();

// Route to view all feedback
router.get('/', getAllFeedback);

// Route to respond to feedback
router.put('/:feedbackId/respond', respondToFeedback);

// Route to delete feedback
router.delete('/:feedbackId', deleteFeedback);

// Route to search feedback based on parameters
router.get('/search', searchFeedback);

module.exports = router;
