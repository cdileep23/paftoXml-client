import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '@/util/url';
import { userLoggedIn } from '@/store/userSlice';
import { toast } from 'sonner';

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
  });
  const [previewUrl, setPreviewUrl] = useState(user.PhotoUrl );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Create preview URL
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading('Updating profile...');
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      
      // Get the file from the input directly
      const file = fileInputRef.current?.files[0];
      if (file) {
        data.append('photo', file);
        console.log('File being sent:', file); // Debug log
      }

      const response = await axios.put(`${BASE_URL}/user/profile`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          
        },
        withCredentials: true
      });

      if (response.data.success) {
        dispatch(userLoggedIn(response.data.user));
        toast.success('Profile updated successfully!', { id: toastId });
        
        // Reset file input after successful upload
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={previewUrl || '/default-avatar.png'} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Photo
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            accept="image/*"
            name="photo" // Add name attribute
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-70 transition-all"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default Profile;