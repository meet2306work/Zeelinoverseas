import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiBriefcase, FiMapPin, FiMail, FiPhone, FiCheckCircle, FiShield, FiGlobe, FiInfo, FiCamera } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';
import Input from '../../commonComponents/inputs/Input';
import { updateUserProfile } from '../../redux/slices/authSlice';
import apiClient from '../../services/apiClient';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    registrationNo: '',
    prefPort: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    avatar: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        registrationNo: user.registrationNo || '',
        prefPort: user.prefPort || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
        avatar: user.avatar || ''
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setIsUploading(true);
      setLocalError('');
      try {
        const formData = new FormData();
        formData.append('images', file);
        const response = await apiClient.post('/uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data && response.data.data && response.data.data[0]) {
          const avatarUrl = response.data.data[0].url;
          setProfile(prev => ({ ...prev, avatar: avatarUrl }));
        }
      } catch (err) {
        setLocalError(err.response?.data?.message || err.message || 'Failed to upload avatar');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await dispatch(updateUserProfile(profile)).unwrap();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setLocalError(err || 'Failed to update profile');
    }
  };

  const initials = user && user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() 
    : 'US';

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
          Profile Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage your personal credentials, corporate registration details, and preferred delivery ports.
        </p>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
          <FiCheckCircle className="h-4.5 w-4.5" />
          <span>Profile configuration changes saved successfully to your cloud account registry.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Card: Account Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card variant="glass" hover={false} className="p-6 text-center border-slate-200/40 dark:border-slate-800/40">
            {/* Avatar with change button */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className={`w-full h-full rounded-full object-cover shadow-xl shadow-secondary/15 border-2 border-secondary/20 ${isUploading ? 'opacity-50' : ''}`}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-secondary to-accent flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-secondary/15">
                  {initials}
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold text-white">
                  Uploading...
                </div>
              )}
              {/* Active badge */}
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900" title="Active importer profile">
                <FiCheckCircle className="h-4.5 w-4.5" />
              </div>
              {/* Change photo button */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-secondary p-1.5 rounded-full shadow-md transition-colors"
                title="Change profile photo"
              >
                <FiCamera className="h-3.5 w-3.5" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-3">
              {profile.companyName}
            </p>

            {/* Upload hint */}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="text-[11px] text-secondary dark:text-accent font-semibold hover:underline mb-6 block w-full"
            >
              Change Profile Photo
            </button>

            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-200/40 dark:border-slate-800/40">
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                <div className="text-lg font-extrabold text-secondary dark:text-accent font-mono">02</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">Active Cargo</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                <div className="text-lg font-extrabold text-secondary dark:text-accent font-mono">03</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">RFQs Sent</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Form Layout */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-6">
          {/* Section: General (Phone required) */}
          <Card variant="default" hover={false} className="p-6 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100/5">
              <FiUser className="h-4.5 w-4.5 text-secondary dark:text-accent" /> Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                required
                icon={FiUser}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                required
                icon={FiUser}
              />
              <Input
                label="Corporate Email"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                disabled // Email should typically not be editable directly here without verification
                icon={FiMail}
              />
              <Input
                label="Mobile Phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
                icon={FiPhone}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </Card>

          {/* Section: Business & Logistics (all optional) */}
          <Card variant="default" hover={false} className="p-6 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100/5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FiBriefcase className="h-4.5 w-4.5 text-secondary dark:text-accent" /> Business & Logistics
              </h3>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Optional
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registered Company"
                name="companyName"
                value={profile.companyName}
                onChange={handleChange}
                icon={FiBriefcase}
              />
              <Input
                label="Company Registration No."
                name="registrationNo"
                value={profile.registrationNo}
                onChange={handleChange}
                icon={FiShield}
              />
              <Input
                label="Preferred Shipping Destination"
                name="prefPort"
                value={profile.prefPort}
                onChange={handleChange}
                icon={FiGlobe}
                className="sm:col-span-2"
              />
              <Input
                label="Delivery Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                icon={FiMapPin}
                className="sm:col-span-2"
              />
              <Input
                label="City"
                name="city"
                value={profile.city}
                onChange={handleChange}
              />
              <Input
                label="Postal / ZIP Code"
                name="postalCode"
                value={profile.postalCode}
                onChange={handleChange}
              />
            </div>
          </Card>

          {/* Save Action */}
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <FiInfo className="h-4 w-4 text-emerald-500" /> Data encrypted in cloud registry.
            </span>
            {localError && <span className="text-red-500 text-sm ml-4">{localError}</span>}
            <Button variant="primary" type="submit" size="md" isLoading={loading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
