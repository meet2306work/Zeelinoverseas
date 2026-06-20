import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiGlobe, FiKey, FiBell, FiCheck, FiImage, FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiClock, FiUploadCloud } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import apiClient from '../../services/apiClient';
import {
  setSlideshowEnabled,
  setSlideshowInterval,
  addSlideshowImage,
  removeSlideshowImage,
} from '../../redux/slices/settingsSlice';

export default function AdminSettingsScreen() {
  const dispatch = useDispatch();
  const { slideshowEnabled, slideshowInterval, slideshowImages } = useSelector((state) => state.settings);

  const [activeTab, setActiveTab] = useState('company');
  const [companyName, setCompanyName] = useState('Zeelinoverseas Ltd');
  const [supportEmail, setSupportEmail] = useState('operations@zeelin.com');
  const [apiKey, setApiKey] = useState('sk_live_51Msz32Lksp7981Lwk2');
  const [portApi, setPortApi] = useState('https://api.maritimelogistics.org/v1');
  const [notifyRfq, setNotifyRfq] = useState(true);
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Slideshow form state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [intervalInput, setIntervalInput] = useState(String(slideshowInterval));

  const tabs = [
    { id: 'company', label: 'Company Info', icon: FiGlobe },
    { id: 'slideshow', label: 'Slideshow', icon: FiImage },
    { id: 'api', label: 'Logistics APIs', icon: FiKey },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
  ];

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('System configuration parameters updated successfully!');
    }, 1000);
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    dispatch(addSlideshowImage({
      id: `slide-${Date.now()}`,
      url: newImageUrl.trim(),
      caption: newImageCaption.trim() || 'Product Image',
    }));
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length === 0) return;

    setUploadingImages(true);
    setImageUploadError('');

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    try {
      const response = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      response.data.data.forEach((image, index) => {
        const fallbackCaption = files[index]?.name.replace(/\.[^.]+$/, '') || 'Product Image';
        dispatch(addSlideshowImage({
          id: `slide-${Date.now()}-${index}`,
          url: image.url,
          caption: newImageCaption.trim() || fallbackCaption,
        }));
      });
      setNewImageCaption('');
    } catch (error) {
      setImageUploadError(error.response?.data?.message || error.message || 'Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleIntervalSave = () => {
    const val = parseInt(intervalInput, 10);
    if (!isNaN(val) && val >= 1 && val <= 30) {
      dispatch(setSlideshowInterval(val));
    }
  };

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Settings Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure metadata parameters, logistics webhooks, ocean shipping API integration keys, alerting thresholds, and home page slideshow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4.5 py-3 rounded-xl font-semibold text-xs transition-colors text-left border
                  ${activeTab === tab.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-100/70 hover:text-slate-850 dark:bg-slate-950/20 dark:border-transparent dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Forms Container */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSaveSettings}>
            <Card variant="glass" hover={false} className="p-8 flex flex-col gap-6">

              {/* ── Company Info ── */}
              {activeTab === 'company' && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Company Metadata Info</h3>
                  <Input
                    label="Trade Entity Legal Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                  <Input
                    label="Operations Support Email"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Default Operations Port</label>
                    <input
                      type="text"
                      defaultValue="Port of Rotterdam (Nieuwenhuis Terminal)"
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 outline-none focus:border-secondary transition-colors shadow-sm"
                      required
                    />
                  </div>
                </div>
              )}

              {/* ── Slideshow Management ── */}
              {activeTab === 'slideshow' && (
                <div className="flex flex-col gap-6">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                    Home Page Slideshow Settings
                  </h3>

                  {/* Enable/Disable toggle */}
                  <div
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/20 cursor-pointer"
                    onClick={() => dispatch(setSlideshowEnabled(!slideshowEnabled))}
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Enable Product Slideshow</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                        Show rotating product images on the Live Sourcing Board on the home page.
                      </span>
                    </div>
                    <div className={`text-2xl transition-colors ${slideshowEnabled ? 'text-secondary' : 'text-slate-400'}`}>
                      {slideshowEnabled
                        ? <FiToggleRight className="h-7 w-7" />
                        : <FiToggleLeft className="h-7 w-7" />
                      }
                    </div>
                  </div>

                  {/* Interval */}
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                        <FiClock className="inline h-3.5 w-3.5 mr-1" /> Slide Change Interval (seconds)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={intervalInput}
                        onChange={(e) => setIntervalInput(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 outline-none focus:border-secondary transition-colors shadow-sm"
                      />
                    </div>
                    <Button type="button" variant="outline" size="md" onClick={handleIntervalSave}>
                      Apply
                    </Button>
                  </div>

                  {/* Add new image */}
                  <div className="flex flex-col gap-3 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Add Slideshow Images</p>
                    <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center transition-colors hover:border-secondary dark:border-slate-700 dark:bg-slate-950/50 ${uploadingImages ? 'pointer-events-none opacity-60' : ''}`}>
                      <FiUploadCloud className="h-7 w-7 text-secondary" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {uploadingImages ? 'Uploading images...' : 'Choose multiple images'}
                      </span>
                      <span className="text-[11px] text-slate-500">JPG, PNG or WebP. You can select several files at once.</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                        className="hidden"
                      />
                    </label>
                    {imageUploadError && <p className="text-xs font-medium text-red-500">{imageUploadError}</p>}
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                      Or add by URL
                      <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>
                    <input
                      type="url"
                      placeholder="Image URL (https://...)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 outline-none focus:border-secondary transition-colors shadow-sm"
                    />
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white px-3.5 py-2.5 outline-none focus:border-secondary transition-colors shadow-sm"
                    />
                    <Button type="button" variant="primary" size="sm" icon={FiPlus} onClick={handleAddImage}>
                      Add Image
                    </Button>
                  </div>

                  {/* Current images list */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Current Slides ({slideshowImages.length})
                    </p>
                    {slideshowImages.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No slideshow images added yet.</p>
                    )}
                    {slideshowImages.map((img) => (
                      <div key={img.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40">
                        <div className="h-12 w-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img
                            src={img.url}
                            alt={img.caption}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{img.caption}</p>
                          <p className="text-[10px] text-slate-400 truncate">{img.url}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(removeSlideshowImage(img.id))}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors shrink-0"
                          title="Remove image"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── API Config ── */}
              {activeTab === 'api' && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Ocean Freight APIs Setup</h3>
                  <Input
                    label="Maritime Logistics API Host URL"
                    type="url"
                    value={portApi}
                    onChange={(e) => setPortApi(e.target.value)}
                    required
                  />
                  <Input
                    label="Authorization Secret API Token Key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* ── Notifications ── */}
              {activeTab === 'notifications' && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">System Notification Triggers</h3>
                  
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/20 cursor-pointer" onClick={() => setNotifyRfq(!notifyRfq)}>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Awaiting RFQ Action Alerts</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Trigger alerts when B2B buyers submit a price request proposal.</span>
                    </div>
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all shrink-0
                      ${notifyRfq ? 'bg-secondary border-secondary text-white' : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950'}`}>
                      {notifyRfq && <FiCheck className="h-3.5 w-3.5" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/20 cursor-pointer" onClick={() => setNotifyOrder(!notifyOrder)}>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">Logistics Shipment Milestone Updates</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Send email pings when containers pass ocean clearance checks.</span>
                    </div>
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all shrink-0
                      ${notifyOrder ? 'bg-secondary border-secondary text-white' : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950'}`}>
                      {notifyOrder && <FiCheck className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== 'slideshow' && (
                <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800 mt-4">
                  <Button type="submit" variant="primary" isLoading={isSaving}>
                    Save Settings Details
                  </Button>
                </div>
              )}
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
