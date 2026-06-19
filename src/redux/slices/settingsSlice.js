import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Slideshow settings (managed from Admin Settings)
  slideshowEnabled: true,
  slideshowInterval: 4, // seconds
  slideshowImages: [
    {
      id: 'slide-001',
      url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
      caption: 'Heavy-Duty Corrugated Boxes',
    },
    {
      id: 'slide-002',
      url: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=800&q=80',
      caption: 'Custom Kraft Paper Mailers',
    },
    {
      id: 'slide-003',
      url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80',
      caption: 'Premium Magnetic Gift Boxes',
    },
    {
      id: 'slide-004',
      url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
      caption: 'Biodegradable Bubble Wrap Rolls',
    },
  ],

  // Theme setting ('light' | 'dark' | 'system')
  theme: 'system',

  // Support ticket predefined topics (admin-managed)
  supportTopics: [
    'Shipment Status Update',
    'RFQ Follow-up',
    'Invoice / Payment Query',
    'Custom Packaging Request',
    'Product Quality Issue',
    'Delivery Delay',
    'Other',
  ],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSlideshowEnabled: (state, action) => {
      state.slideshowEnabled = action.payload;
    },
    setSlideshowInterval: (state, action) => {
      state.slideshowInterval = action.payload;
    },
    addSlideshowImage: (state, action) => {
      state.slideshowImages.push(action.payload);
    },
    removeSlideshowImage: (state, action) => {
      state.slideshowImages = state.slideshowImages.filter(img => img.id !== action.payload);
    },
    updateSlideshowImage: (state, action) => {
      const index = state.slideshowImages.findIndex(img => img.id === action.payload.id);
      if (index !== -1) {
        state.slideshowImages[index] = { ...state.slideshowImages[index], ...action.payload };
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Apply theme to document
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (action.payload === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // system: check prefers-color-scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    addSupportTopic: (state, action) => {
      // Insert before 'Other' (always last)
      const otherIndex = state.supportTopics.indexOf('Other');
      if (otherIndex !== -1) {
        state.supportTopics.splice(otherIndex, 0, action.payload);
      } else {
        state.supportTopics.push(action.payload);
      }
    },
    removeSupportTopic: (state, action) => {
      // Cannot remove 'Other'
      if (action.payload === 'Other') return;
      state.supportTopics = state.supportTopics.filter(t => t !== action.payload);
    },
  },
});

export const {
  setSlideshowEnabled,
  setSlideshowInterval,
  addSlideshowImage,
  removeSlideshowImage,
  updateSlideshowImage,
  setTheme,
  addSupportTopic,
  removeSupportTopic,
} = settingsSlice.actions;

export default settingsSlice.reducer;
