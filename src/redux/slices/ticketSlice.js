import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

// Helper to map backend SupportTicket model to frontend properties
const mapBackendTicket = (t) => ({
  id: t._id,
  _id: t._id,
  date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  subject: t.subject,
  message: t.message,
  priority: t.priority,
  status: t.status,
  replies: t.replies || [],
  user: t.user, // Contains user details populated from the DB
});

// Async Thunks
export const fetchMyTickets = createAsyncThunk(
  'tickets/fetchMyTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/tickets/mytickets');
      return response.data.data; // Array of support ticket objects
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchAllTickets = createAsyncThunk(
  'tickets/fetchAllTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/tickets');
      return response.data.data; // Array of all support tickets (Admin)
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/tickets', ticketData);
      return response.data.data; // Created support ticket object
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const addTicketReply = createAsyncThunk(
  'tickets/addTicketReply',
  async ({ ticketId, message, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/tickets/${ticketId}/replies`, { message, status });
      return response.data.data; // Updated support ticket object with replies
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
  ticketsList: [],
  selectedTicket: null,
  isLoading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setSelectedTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    clearTicketError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Tickets
      .addCase(fetchMyTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticketsList = action.payload.map(mapBackendTicket);
      })
      .addCase(fetchMyTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch All Tickets (Admin)
      .addCase(fetchAllTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticketsList = action.payload.map(mapBackendTicket);
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Ticket
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticketsList.unshift(mapBackendTicket(action.payload));
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Ticket Reply
      .addCase(addTicketReply.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTicketReply.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.ticketsList.findIndex(
          (t) => t._id === action.payload._id || t.id === action.payload._id
        );
        const mapped = mapBackendTicket(action.payload);
        if (index !== -1) {
          state.ticketsList[index] = mapped;
        }
        if (state.selectedTicket && (state.selectedTicket._id === action.payload._id || state.selectedTicket.id === action.payload._id)) {
          state.selectedTicket = mapped;
        }
      })
      .addCase(addTicketReply.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedTicket, clearTicketError } = ticketSlice.actions;
export default ticketSlice.reducer;
export const selectAllTickets = (state) => state.tickets.ticketsList;
export const selectActiveTicket = (state) => state.tickets.selectedTicket;
export const selectTicketLoading = (state) => state.tickets.isLoading;
export const selectTicketError = (state) => state.tickets.error;
