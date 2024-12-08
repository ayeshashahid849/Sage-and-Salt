import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import Sidebar from './Sidebar.jsx';
import orderImage from '../../assets/order.jpeg'; // Import the image

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // New Colors
  const PIE_COLORS = ['#D2691E', '#6B8E23', '#A0522D', '#8B4513'];
  const TABLE_COLORS = ['#0c0b09', '#1a1814'];

  useEffect(() => {
    fetchOrders();
    fetchReport();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/order/');
      const data = await response.json();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReport = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/order/report');
      const data = await response.json();
      setReportData(data.report || []);
    } catch (error) {
      console.error('Error fetching report:', error);
      setReportData([]);
    }
  };

  const handleStatusFilter = async (status) => {
    setActiveTab(status);
    if (status === 'All') {
      setFilteredOrders(orders);
    } else {
      try {
        const response = await fetch(`http://localhost:5000/api/order/status?status=${status}`);
        const data = await response.json();
        setFilteredOrders(data.orders || []);
      } catch (error) {
        console.error('Error filtering orders:', error);
        setFilteredOrders([]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar className="w-1/4 bg-gray-800 text-white h-full fixed" />

      {/* Main Content */}
      <div
        className="flex-1 p-4 relative  bg-cover bg-center"
        style={{
          backgroundImage: `url(${orderImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-[#cda45e] mt-12">Orders Dashboard</h1>

          {/* Analytics Section */}
          <div className="bg-[#0c0b09] p-6 rounded-lg shadow-lg mb-8 border border-[#625b4b] opacity-70">
            <h2 className="text-xl font-semibold text-[#cda45e] mb-4">Order Analytics</h2>
            <div className="flex flex-wrap gap-4">
              {/* Bar Chart */}
              {reportData && reportData.length > 0 ? (
                <div className="flex-1">
                  <BarChart width={400} height={250} data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#625b4b" />
                    <XAxis dataKey="_id" stroke="#cda45e" />
                    <YAxis stroke="#cda45e" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalOrders" fill= ' #4CAF50' name="Total Orders" />
                    <Bar dataKey="totalPrice" fill='#C70039' name="Total Revenue" />
                  </BarChart>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  No data available for bar chart
                </div>
              )}
              {/* Pie Chart */}
              {reportData && reportData.length > 0 ? (
                <div className="flex-1">
                  <PieChart width={400} height={250}>
                    <Pie
                      data={reportData}
                      dataKey="totalOrders"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {reportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  No data available for pie chart
                </div>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-[#0c0b09] p-6 rounded-lg shadow-lg border border-[#625b4b] opacity-70">
            <h2 className="text-xl font-semibold text-[#cda45e] mb-6">Orders</h2>
            <div className="flex space-x-4 mb-6">
              {['All', 'Preparing', 'Ready', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === status
                      ? 'bg-[#cda45e] text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              {filteredOrders.length > 0 ? (
                <table className="min-w-full divide-y divide-white border border-white ">
                  <thead className="bg-[#1a1814] text-[#cda45e]">
                    <tr>
                      <th className="px-6 py-3 text-left uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left uppercase">Status</th>
                      <th className="px-6 py-3 text-left uppercase">Total Price</th>
                      <th className="px-6 py-3 text-left uppercase">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order._id}
                        style={{ backgroundColor: TABLE_COLORS[index % 2] }}
                        className="text-white"
                      >
                        <td className="px-6 py-4">{order._id}</td>
                        <td className="px-6 py-4">{order.tracking?.status}</td>
                        <td className="px-6 py-4">${order.totalPrice?.toFixed(2) || '0.00'}</td>
                        <td className="px-6 py-4">
                          {order.tracking?.lastUpdated
                            ? new Date(order.tracking.lastUpdated).toLocaleDateString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">No orders found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
