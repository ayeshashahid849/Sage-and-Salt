import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import { FaSearch, FaTrash } from 'react-icons/fa';
import './feedbackManagement.css';
import feedbackImage from '../../assets/feedback.jpg';
const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMap, setResponseMap] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    rating: '',
    userId: '',
    orderId: ''
  });

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/feedback');
      const data = await response.json();
      if (response.ok) {
        setFeedbacks(data.feedbacks);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchFilters.rating) queryParams.append('rating', searchFilters.rating);
      if (searchFilters.userId) queryParams.append('userId', searchFilters.userId);
      if (searchFilters.orderId) queryParams.append('orderId', searchFilters.orderId);

      const searchResponse = await fetch(`http://localhost:5000/api/feedback/search?${queryParams}`);
      const data = await searchResponse.json();

      if (searchResponse.ok) {
        setFeedbacks(data.feedback);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to search feedbacks');
    }
  };

  const handleRespond = async (feedbackId) => {
    try {
      const submitResponse = await fetch(`http://localhost:5000/api/feedback/${feedbackId}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: responseMap[feedbackId] })
      });

      const data = await submitResponse.json();

      if (submitResponse.ok) {
        fetchFeedbacks();
        setResponseMap(prev => ({ ...prev, [feedbackId]: '' }));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit response');
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const deleteResponse = await fetch(`http://localhost:5000/api/feedback/${feedbackId}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          fetchFeedbacks();
        } else {
          const data = await deleteResponse.json();
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to delete feedback');
      }
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
     <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className="w-full md:w-1/4 bg-[#0c0b09] text-[#cda45e] md:h-screen fixed md:sticky top-0 transition-transform transform opacity-0 translate-x-[-100%] animate-slideIn" />

      <div
        className="flex-1 relative min-h-screen opacity-90"
        style={{
          backgroundImage: `url(${feedbackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="relative z-20 text-[#cda45e] p-4">
                <h2 className="text-3xl font-bold mb-4 text-[#cda45e] mt-12">Feedback Management</h2>
         
        {/* Search Section */}
        <div className="relative flex flex-col md:flex-row items-center mb-4">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full pr-12 mb-4 md:mb-0">
            <div className="input-container">
              <input 
                type="text" 
                value={searchFilters.rating} 
                onChange={(e) => setSearchFilters({ ...searchFilters, rating: e.target.value })}
                placeholder="Rating" 
                className="w-full bg-dark-secondary border p-2 rounded-md text-grey pl-4"
              />
            </div>
            <div className="input-container">
              <input 
                type="text" 
                value={searchFilters.userId} 
                onChange={(e) => setSearchFilters({ ...searchFilters, userId: e.target.value })}
                placeholder="User ID" 
                className="w-full border p-2 bg-dark-secondary rounded-md text-white pl-4"
              />
            </div>
            <div className="input-container">
              <input 
                type="text" 
                value={searchFilters.orderId} 
                onChange={(e) => setSearchFilters({ ...searchFilters, orderId: e.target.value })}
                placeholder="Order ID" 
                className="w-full border p-2 bg-dark-secondary rounded-md text-white pl-4 bg"
              />
            </div>
          </div>

          {/* Search Icon */}
          <div 
            className="search-icon-container cursor-pointer z-20 mt-4 md:mt-0 md:ml-60"
            onClick={handleSearch}
          >
            <FaSearch className="text-white" />
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <p className="text-white">Loading feedbacks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            {feedbacks.map((feedback) => (
              <div 
                key={feedback._id} 
                className="p-4 border rounded-lg shadow-md bg-opacity-60 mb-4 bg-[#1a1814] border-[#625b4b]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">
                      Rating: 
                      <span className="bg-black bg-opacity-20 text-white p-1 border border-white border-opacity-30 rounded-md ml-2">
                        {feedback.rating}/5
                      </span>
                    </p>
                    <p className="text-white">User ID: {feedback.userId}</p>
                    <p className="text-white">Order ID: {feedback.orderId}</p>
                  </div>
                  <div 
                    className="delete-icon-container flex justify-center items-center w-10 h-10 bg-red-500 rounded-md hover:bg-red-600 border-2 border-red-700"
                    onClick={() => handleDelete(feedback._id)}
                  >
                    <FaTrash className="text-white" />
                  </div>
                </div>
                <p className="my-2 text-white">Feedback: {feedback.comment}</p>

                {feedback.response && (
                  <div className="mt-2 p-2 bg-black rounded bg-opacity-30">
                    <p className="font-semibold text-[#cda45e]">Response:</p>
                    <p>{feedback.response}</p>
                  </div>
                )}
                
                {!feedback.response && (
                  <div className="mt-2">
                    <textarea 
                      placeholder="Write your response..." 
                      className="mt-2 p-2 border rounded-md bg-[#0c0b09] text-[#cda45e] border-[#625b4b] bg-opacity-30 w-full h-15" 
                      value={responseMap[feedback._id] || ''}
                      onChange={(e) => setResponseMap(prev => ({ 
                        ...prev, 
                        [feedback._id]: e.target.value 
                      }))}
                    />
                    <button 
                      onClick={() => handleRespond(feedback._id)}
                      className="mt-2 px-4 py-2 bg-[#cda45e] text-black rounded hover:bg-[#625b4b]"
                    >
                      Submit Response
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  
);

};

export default FeedbackManager;
