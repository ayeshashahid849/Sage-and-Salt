import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
   ResponsiveContainer 
} from 'recharts';
import Sidebar from '../components/auth/Sidebar.jsx';
import dashboardImage from '../assets/Dashboard.jpeg';  // Import the background image

const Dashboard = () => {
  const [dailyStats, setDailyStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({
    averageRating: 0,
    totalFeedback: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch daily stats
        const dailyStatsResponse = await fetch('http://localhost:5000/api/dashboard/daily-stats');
        const dailyStatsData = await dailyStatsResponse.json();
        setDailyStats(dailyStatsData);

       
        // Fetch revenue trend
        const revenueTrendResponse = await fetch('http://localhost:5000/api/dashboard/revenue-trend');
        const revenueTrendData = await revenueTrendResponse.json();
        setRevenueTrend(revenueTrendData);

        // Fetch feedback stats
        const feedbackStatsResponse = await fetch('http://localhost:5000/api/dashboard/feedback-stats');
        const feedbackStatsData = await feedbackStatsResponse.json();
        setFeedbackStats(feedbackStatsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-pulse">
            <svg className="mx-auto h-20 w-20 text-[#cda45e]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p className="text-xl text-[#cda45e] mt-4">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex min-h-screen bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${dashboardImage})`,
        backgroundBlendMode: 'darken'
      }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-black bg-opacity-0 border-r border-[#cda45e]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-auto p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold text-[#cda45e] drop-shadow-lg mt-12">
              Restaurant Dashboard
            </h1>
          </div>
          
          {/* Daily Overview Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { 
                title: 'Daily Orders', 
                value: dailyStats.totalOrders, 
                icon: '🍽️'
              },
              { 
                title: 'Total Revenue', 
                value: `$${dailyStats.totalRevenue.toFixed(2)}`, 
                icon: '💰'
              },
              { 
                title: 'Avg Order Value', 
                value: `$${dailyStats.averageOrderValue.toFixed(2)}`, 
                icon: '📊'
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-black bg-opacity-50 backdrop-blur-sm border-2 border-[#cda45e] rounded-xl p-6 transform transition hover:scale-105 hover:shadow-2xl shadow-[#cda45e]/50 group"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-[#cda45e] font-semibold group-hover:text-white transition">{stat.title}</h2>
                  <span className="text-3xl opacity-70 group-hover:opacity-100 transition">{stat.icon}</span>
                </div>
                <p className="text-3xl font-bold text-white group-hover:text-[#cda45e] transition">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Revenue Trend Line Chart */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border-2 border-[#cda45e]">
              <h2 className="text-2xl text-[#cda45e] font-semibold mb-6">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="_id" 
                    tick={{fill: 'white'}} 
                    axisLine={{stroke: '#cda45e'}}
                  />
                  <YAxis 
                    tick={{fill: 'white'}} 
                    axisLine={{stroke: '#cda45e'}}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '2px solid #cda45e',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#cda45e" 
                    strokeWidth={3}
                    activeDot={{r: 8, fill: '#cda45e'}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

         

            {/* Feedback Statistics */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border-2 border-[#cda45e]">
              <h2 className="text-2xl text-[#cda45e] font-semibold mb-6">Feedback Overview</h2>
              <div className="grid grid-rows-2 gap-4">
                {/* Average Rating Section */}
                <div>
                  <p className="text-lg text-white mb-2">Average Rating</p>
                  <div className="flex items-center">
                    <p className="text-4xl font-bold text-[#cda45e] mr-2">
                      {feedbackStats.averageRating.toFixed(1)}
                    </p>
                    <span className="text-[#cda45e] text-2xl">★</span>
                  </div>
                </div>

                {/* Total Feedback Section */}
                <div>
                  <p className="text-lg text-white mb-2">Total Feedback</p>
                  <p className="text-4xl font-bold text-[#cda45e]">
                    {feedbackStats.totalFeedback}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
