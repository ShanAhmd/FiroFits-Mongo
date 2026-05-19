import React, { useState } from 'react';
import { type User } from '../types';

interface MyProfileProps {
  user: User;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
}

const MyProfile: React.FC<MyProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    profilePhotoUrl: user.profilePhotoUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-black p-8">
      <div className="flex justify-between items-center border-b border-black/20 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-black uppercase tracking-tighter">My Profile</h2>
          <p className="text-[10px] text-brand-dark-gray uppercase tracking-[0.2em] font-bold mt-2">
            Your Personal Information
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 bg-gray-100 border border-black flex items-center justify-center overflow-hidden relative group">
             {formData.profilePhotoUrl || user.profilePhotoUrl ? (
                <img src={formData.profilePhotoUrl || user.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover grayscale" />
             ) : (
                <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
             )}
             {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer text-[9px] uppercase tracking-[0.2em] font-bold text-white text-center px-2">
                    Upload Photo
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({ ...prev, profilePhotoUrl: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
             )}
          </div>
        </div>

        <div className="flex-1 w-full">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-sm font-bold uppercase tracking-widest text-black rounded-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-sm font-bold uppercase tracking-widest text-black rounded-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+94 77 XXXXXXX"
                  className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-sm font-bold uppercase tracking-widest text-black rounded-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] font-bold text-black mb-2">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Fashion St, Colombo"
                  className="w-full bg-transparent border-0 border-b border-black/20 focus:border-black focus:ring-0 px-0 py-2 text-sm font-bold uppercase tracking-widest text-black rounded-none"
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-colors disabled:bg-gray-300"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user.name, email: user.email });
                  }}
                  className="px-8 py-3 bg-transparent border border-black text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-sans text-brand-dark-gray font-bold uppercase tracking-[0.3em]">
                  Full Name
                </h3>
                <p className="text-xl font-serif text-black uppercase mt-1 tracking-wider">{user.name}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-sans text-brand-dark-gray font-bold uppercase tracking-[0.3em]">
                  Email Address
                </h3>
                <p className="text-xl font-serif text-black uppercase mt-1 tracking-wider">{user.email}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-sans text-brand-dark-gray font-bold uppercase tracking-[0.3em]">
                  Phone Number
                </h3>
                <p className="text-xl font-serif text-black uppercase mt-1 tracking-wider">{user.phone || 'Not Provided'}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-sans text-brand-dark-gray font-bold uppercase tracking-[0.3em]">
                  Delivery Address
                </h3>
                <p className="text-xl font-serif text-black uppercase mt-1 tracking-wider">{user.address || 'Not Provided'}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-sans text-brand-dark-gray font-bold uppercase tracking-[0.3em]">
                  Account Type
                </h3>
                <p className="text-sm font-sans text-white bg-black px-4 py-2 inline-block uppercase mt-2 tracking-[0.2em] font-bold">
                  {user.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
