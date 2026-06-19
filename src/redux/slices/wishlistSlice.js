import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

// Helper to map backend product structure to frontend structure
const mapWishlistItem = (p) => ({
  id: p._id,
  name: p.title,
  image: p.images?.[0]?.url || '',
  price: p.price,
  priceFormatted: p.price ? `$${p.price.toLocaleString()}` : 'Contact for Price',
  moq: p.moq || '100 Units',
  _id: p._id,
  title: p.title,
  images: p.images || [],
  specifications: p.specifications || [],
  description: p.description || '',
  averageRating: p.averageRating || 0,
});

// Async Thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users/wishlist');
      return response.data.data; // Array of product objects
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  'wishlist/addProductToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/users/wishlist', { productId });
      return response.data.data; // Updated wishlist array
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk(
  'wishlist/removeProductFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/users/wishlist/${productId}`);
      return response.data.data; // Updated wishlist array
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
  wishlistItems: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.map(mapWishlistItem);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Product To Wishlist
      .addCase(addProductToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.map(mapWishlistItem);
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Product From Wishlist
      .addCase(removeProductFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.map(mapWishlistItem);
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export const selectIsInWishlist = (id) => (state) =>
  state.wishlist.wishlistItems.some((item) => item.id === id || item._id === id);
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
