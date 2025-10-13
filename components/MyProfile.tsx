import React, { useState, useEffect } from 'react';
import { type User } from '../types';
import { UserCircleIcon, CameraIcon } from './IconComponents';

interface MyProfileProps {
  user: User;
  onUpdateUser: (updatedData: Partial<User>) => void;
  notification: string | null;
  setNotification: (message: string | null) => void;
}

const MyProfile: React.FC<MyProfileProps> = ({ user, onUpdateUser, notification, setNotification }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
  }, [user]);
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
    });
    setIsEditing(false);
  };
  
  const handlePhotoChange = () => {
      // In a real app, this would open a file picker and handle upload.
      // For this demo, we'll just show a notification.
      setNotification("Profile photo upload is a demo feature.");
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-8">My Profile</h1>
        <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture */}
                <div className="relative group flex-shrink-0">
                    {user.profilePhotoUrl ? (
                        <img
                            src={user.profilePhotoUrl}
                            alt="Profile"
                            className="h-32 w-32 rounded-full object-cover ring-4 ring-brand-teal/20"
                        />
                    ) : (
                        <UserCircleIcon className="h-32 w-32 text-brand-dark-gray" />
                    )}
                    <button onClick={handlePhotoChange} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                       <CameraIcon className="h-8 w-8" />
                    </button>
                </div>
                {/* Profile Form */}
                <form onSubmit={handleSaveChanges} className="w-full">
                    {notification && (
                        <div className="mb-4 p-3 rounded-xl bg-brand-success/10 border border-brand-success/30 text-brand-success text-sm text-center font-semibold">
                            {notification}
                        </div>
                    )}
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-brand-charcoal">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="mt-2 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal disabled:bg-gray-100"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-brand-charcoal">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled // Email is typically not editable
                                className="mt-2 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal disabled:bg-gray-100 text-gray-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-brand-charcoal">Contact Number</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="mt-2 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal disabled:bg-gray-100"
                                placeholder="e.g., 077 123 4567"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-semibold text-brand-charcoal">Delivery Address</label>
                            <textarea
                                name="address"
                                id="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="mt-2 block w-full shadow-sm sm:text-sm border-brand-light-gray rounded-xl focus:ring-brand-teal focus:border-brand-teal disabled:bg-gray-100"
                                placeholder="e.g., 123 Main Street, Colombo"
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        {isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2.5 bg-gray-200 text-brand-charcoal rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-brand-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors shadow-lg"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2.5 bg-brand-charcoal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors shadow-lg"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default MyProfile;
