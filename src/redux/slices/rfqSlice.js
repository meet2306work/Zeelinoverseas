import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

// Helper to map backend RFQ model to frontend properties
const mapBackendRfq = (r) => {
  let displayStatus = 'Pending Quote';
  if (r.status === 'Reviewed') displayStatus = 'Under Review';   // Bug #25 fix: was 'Pending Review' — semantically backwards
  else if (r.status === 'Quoted') displayStatus = 'Quote Submitted';
  else if (r.status === 'Accepted') displayStatus = 'Approved';
  else if (r.status === 'Rejected') displayStatus = 'Rejected';

  return {
    id: r._id,
    _id: r._id,
    company: r.companyName || r.contactName || 'Corporate Client',
    date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: r.productDetails || 'Industrial Sourcing',
    port: r.shippingDestination || 'Rotterdam',
    qty: typeof r.quantity === 'number' ? `${r.quantity.toLocaleString()} Units` : r.quantity || '0 Units',
    targetBudget: r.targetPrice ? `$${r.targetPrice.toLocaleString()}` : 'Contact Desk',
    status: displayStatus,
    leadTime: r.requirements ? r.requirements.slice(0, 35) : '21 Days Delivery ETA',
    approvedQuote: r.status === 'Quoted' || r.status === 'Accepted' ? `$${(r.targetPrice || 5000).toLocaleString()}` : '',
    trackingId: r._id,
  };
};

// Async Thunks
export const fetchMyRfqs = createAsyncThunk(
  'rfq/fetchMyRfqs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/rfq/myrfqs');
      return response.data.data; // Array of RFQ objects
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchAllRfqs = createAsyncThunk(
  'rfq/fetchAllRfqs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/rfq');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const submitRfq = createAsyncThunk(
  'rfq/submitRfq',
  async (rfqData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/rfq', rfqData);
      return response.data.data; // Created RFQ object
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateRfqQuote = createAsyncThunk(
  'rfq/updateRfqQuote',
  async ({ id, status, bidPrice }, { rejectWithValue }) => {
    try {
      let backendStatus = 'Pending';
      if (status === 'Approved' || status === 'Accepted') {
        backendStatus = 'Accepted';
      } else if (status === 'Rejected' || status === 'Cancelled') {
        backendStatus = 'Rejected';
      } else if (status === 'Quoted' || status === 'Quote Submitted') {
        backendStatus = 'Quoted';
      } else if (status === 'Pending Review' || status === 'Reviewed') {
        backendStatus = 'Reviewed';
      }

      const payload = { status: backendStatus };
      if (bidPrice !== undefined && bidPrice !== null) {
        const numPrice = parseFloat(bidPrice.toString().replace(/[^\d.]/g, ''));
        if (!isNaN(numPrice)) {
          payload.targetPrice = numPrice;
        }
      }

      const response = await apiClient.put(`/rfq/${id}`, payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  rfqsList: [],
  selectedRfq: null,
  isLoading: false,
  error: null,
};

const rfqSlice = createSlice({
  name: 'rfq',
  initialState,
  reducers: {
    setSelectedRfq: (state, action) => {
      state.selectedRfq = action.payload;
    },
    clearRfqError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My RFQs
      .addCase(fetchMyRfqs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyRfqs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rfqsList = action.payload.map(mapBackendRfq);
      })
      .addCase(fetchMyRfqs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All RFQs (Admin)
      .addCase(fetchAllRfqs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllRfqs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rfqsList = action.payload.map(mapBackendRfq);
      })
      .addCase(fetchAllRfqs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Submit RFQ
      .addCase(submitRfq.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitRfq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rfqsList.unshift(mapBackendRfq(action.payload));
      })
      .addCase(submitRfq.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update RFQ Quote (Admin)
      .addCase(updateRfqQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRfqQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = mapBackendRfq(action.payload);
        const index = state.rfqsList.findIndex(
          (r) => r._id === updated._id || r.id === updated._id
        );
        if (index !== -1) {
          state.rfqsList[index] = updated;
        }
      })
      .addCase(updateRfqQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedRfq, clearRfqError } = rfqSlice.actions;
export default rfqSlice.reducer;
export const selectAllRfqs = (state) => state.rfq.rfqsList;
export const selectActiveRfq = (state) => state.rfq.selectedRfq;
export const selectRfqLoading = (state) => state.rfq.isLoading;
export const selectRfqError = (state) => state.rfq.error;
