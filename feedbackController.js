const Feedback = require('../models/Feedbacks'); // Import the Feedback model

// 1. View Customer Feedback and Reviews
const getAllFeedback = async (req, res) => {
  try {
    // Fetch all feedbacks asynchronously using await
    const feedbacks = await Feedback.find({});
    
    return res.status(200).json({
      message: 'Feedback fetched successfully',
      feedbacks: feedbacks
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching feedback', error: err });
  }
};


// 2. Respond to Customer Reviews
const respondToFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  const { response } = req.body;  // Assuming the response is sent in the request body
  
  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    feedback.response = response;  // Set the response
    await feedback.save();  // Save the updated feedback
    res.status(200).json({ message: 'Response added successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to feedback', error: error.message });
  }
};

// 3. Delete Feedback
const deleteFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  
  try {
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
};

const searchFeedback = async (req, res) => {
  const { rating, userId, orderId } = req.query;  // Extract search filters from query params
  
  try {
    // Prepare filters for the search
    const filters = {};
    if (rating) filters.rating = rating;  // Filter by rating if provided
    if (userId) filters.userId = userId;  // Filter by userId if provided
    if (orderId) filters.orderId = orderId;  // Filter by orderId if provided
    
    // Query the Feedback model with the filters
    const feedback = await Feedback.find(filters);

    // Check if feedback exists
    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ message: 'No feedback found matching the criteria' });
    }

    // If 'user' and 'order' details are embedded within feedback, you can return them directly
    res.status(200).json({ message: 'Feedback search results', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Error searching feedback', error: error.message });
  }
};


module.exports = {
  getAllFeedback,
  respondToFeedback,
  deleteFeedback,
  searchFeedback
};
