import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EditProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    oldPassword: '',
    newPassword: ''
  });

  const [profileFile, setProfileFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'danger', message: string }
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getFullImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('blob:') ? path : `http://localhost:8081${path}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/user-profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const user = await response.json();

        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          oldPassword: '',
          newPassword: ''
        });

        setProfileImage(user.image || null);
      } catch (error) {
        setAlert({ message: 'Failed to load user data', type: 'danger' });
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (profileFile) {
        data.append('profileImage', profileFile);
      }

      const response = await fetch('http://localhost:8081/api/update-profile', {
        method: 'POST',
        body: data,
        credentials: 'include'
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData?.error || 'Failed to update profile';
        setAlert({ message: errorMessage, type: 'danger' });
        return;
      }

      setAlert({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setAlert({ message: error.message || 'Something went wrong!', type: 'danger' });
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(to right, #66cef6, #f666b1)' }}
    >
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 bg-white text-pink-500 border-2 border-pink-300 px-6 py-3 rounded-full font-bold text-lg shadow-md hover:bg-pink-50 transition-all"
      >
        ← Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-3xl mx-auto"
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-6 text-pink-400"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Edit Your Profile
        </motion.h2>

        {/* ✅ Tailwind Alert */}
        {alert && (
          <div
            className={`rounded-md p-4 mb-4 ${
              alert.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{alert.message}</span>
              <button
                onClick={() => setAlert(null)}
                className="text-xl font-bold focus:outline-none"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🖼 Profile Image Upload */}
          <div className="flex flex-col items-center mb-6 relative">
            <div
              className="relative cursor-pointer w-32 h-32 rounded-full border-4 border-pink-400 shadow-md flex items-center justify-center bg-gray-200 text-pink-500"
              onClick={() => fileInputRef.current.click()}
            >
              {profileImage ? (
                <>
                  <img
                    src={getFullImageUrl(profileImage)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 border-2 border-white hover:bg-pink-600 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </div>
                </>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
                  />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600 select-none">
              Please upload your profile picture
            </p>
          </div>

          {/* 🔤 Form Fields */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-4 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
          />
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full p-4 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-4 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300"
          />

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#66cef6] to-[#f666b1] text-white font-bold py-4 rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
}
