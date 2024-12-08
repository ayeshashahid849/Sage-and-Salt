import React, { useState, useCallback, useEffect } from 'react';
import { FaSearch, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import Sidebar from './Sidebar.jsx';
import staffImage from '../../assets/staff.jpg';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    contact_number: '',
    skills: '',
    shift_schedule: [{ date: '', start_time: '', end_time: '' }]
  });

  const fetchStaff = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/search?name=${searchName}&role=${searchRole}`
      );
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  }, [searchName, searchRole]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = selectedStaff
      ? `http://localhost:5000/api/staff/update/${selectedStaff._id}`
      : 'http://localhost:5000/api/staff/create';
    const method = selectedStaff ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map((skill) => skill.trim()),
          shift_schedule: formData.shift_schedule.filter(shift =>
            shift.date && shift.start_time && shift.end_time
          ),
        }),
      });

      if (response.ok) {
        fetchStaff();
        setShowAddModal(false);
        setShowEditModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/staff/delete/${id}`, {
        method: 'DELETE',
      });
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      contact_number: '',
      skills: '',
      shift_schedule: [{ date: '', start_time: '', end_time: '' }]
    });
    setSelectedStaff(null);
  };

  const handleAddShift = () => {
    setFormData({
      ...formData,
      shift_schedule: [
        ...formData.shift_schedule,
        { date: '', start_time: '', end_time: '' }
      ]
    });
  };

  const handleRemoveShift = (index) => {
    const newShifts = formData.shift_schedule.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      shift_schedule: newShifts
    });
  };

  const handleShiftChange = (index, field, value) => {
    const newShifts = formData.shift_schedule.map((shift, i) => {
      if (i === index) {
        return { ...shift, [field]: value };
      }
      return shift;
    });
    setFormData({
      ...formData,
      shift_schedule: newShifts
    });
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-[#1a1814] p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#cda45e]">{title}</h2>
            <button onClick={onClose} className="text-[#cda45e] hover:text-[#b0843b]">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const StaffForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-[#cda45e]">Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#cda45e]">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#cda45e]">Password</label>
          <input
            type="password"
            required={!selectedStaff}
            className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#cda45e]">Role</label>
          <select
            required
            className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="waiter">Waiter</option>
            <option value="chef">Chef</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#cda45e]">Contact Number</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
            value={formData.contact_number}
            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[#cda45e]">Skills (comma-separated)</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-[#cda45e]">Shift Schedule</h3>
          <button
            type="button"
            onClick={handleAddShift}
            className="px-3 py-1 bg-[#cda45e] text-[#1a1814] rounded hover:bg-[#b0843b]"
          >
            Add Shift
          </button>
        </div>
        {formData.shift_schedule.map((shift, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 mb-4 p-4 bg-[#1a1814] rounded">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#cda45e]">Date</label>
              <input
                type="date"
                required
                className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
                value={shift.date}
                onChange={(e) => handleShiftChange(index, 'date', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#cda45e]">Start Time</label>
              <input
                type="time"
                required
                className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
                value={shift.start_time}
                onChange={(e) => handleShiftChange(index, 'start_time', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#cda45e]">End Time</label>
              <input
                type="time"
                required
                className="w-full p-2 border rounded bg-[#1a1814] text-[#cda45e]"
                value={shift.end_time}
                onChange={(e) => handleShiftChange(index, 'end_time', e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveShift(index)}
              className="p-1 bg-red-600 text-white rounded hover:bg-red-800"
            >
              Remove Shift
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          className="px-4 py-2 bg-gray-500 text-[#cda45e] rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#cda45e] text-[#1a1814] rounded hover:bg-[#b0843b]"
        >
          {selectedStaff ? 'Update Staff' : 'Add Staff'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-1/4 bg-[#1a1814] text-[#cda45e] h-full fixed" />

      <div
        className="flex-1 p-4 relative"
        style={{
          backgroundImage: `url(${staffImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-6 text-[#cda45e] mt-12">Staff Management</h1>

          <div className="mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 relative">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="       Search by name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full p-2 text-[#cda45e] border rounded bg-[#1a1814] pl-10"
              />
              <div className="search-icon-container absolute left-2 top-1/2 transform -translate-y-1/2">
                <FaSearch className="text-white" size={16} />
              </div>
            </div>
            <select
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="w-full md:w-auto p-2 border rounded bg-[#1a1814] text-[#cda45e]"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mb-6 px-4 py-2 text-[#cda45e] bg-transparent border border-[#cda45e] rounded hover:bg-[#cda45e] hover:text-[#1a1814] transition-colors duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Staff
          </button>

          <div className="bg-[#1a1814] bg-opacity-60 rounded-lg overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-[#1a1814] bg-opacity-10 text-[#cda45e]">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2 hidden md:table-cell">Skills</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr key={staffMember._id} className="border-b border-[#cda45e]">
                    <td className="border px-4 py-2 text-white">{staffMember.name}</td>
                    <td className="border px-4 py-2 text-white">{staffMember.role}</td>
                    <td className="border px-4 py-2 hidden md:table-cell text-white">{staffMember.skills.join(', ')}</td>
                    <td className="border px-4 py-2 text-white">
                      <div className="flex space-x-4 justify-center">
                        <button
                          onClick={() => {
                            setSelectedStaff(staffMember);
                            setFormData({
                              ...formData,...formData,
                              ...staffMember,
                              skills: staffMember.skills.join(', '),
                            });
                            setShowEditModal(true);
                          }}
                          className="icon-container edit-icon-container"
                          title="Edit Staff"
                        >
                          <FaEdit className="text-[#cda45e]" size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(staffMember._id)}
                          className="icon-container delete-icon-container"
                          title="Delete Staff"
                        >
                          <FaTrash className="text-red-600" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Staff">
        <StaffForm />
      </Modal>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Staff">
        <StaffForm />
      </Modal>

      <style jsx>{`
        .icon-container {
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
        }

        .search-icon-container {
          background-color: #cda45e;
        }

        .search-icon-container:hover {
          background-color: #b0843b;
        }

        .edit-icon-container:hover {
          background-color: #b0843b;
        }

        .delete-icon-container:hover {
          background-color: #e63946;
          border-color: #d62828;
        }

        @media (max-width: 768px) {
          .icon-container {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default StaffManagement;

