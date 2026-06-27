import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (queryParams = '', { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/products${queryParams}`);
      return response.data; // Expected format: { success, count, pagination, data }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
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

export const fetchProductReviews = createAsyncThunk(
  'products/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/products/${productId}/reviews`);
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

export const createProductReview = createAsyncThunk(
  'products/createProductReview',
  async ({ productId, rating, comment, title }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/products/${productId}/reviews`, { rating, text: comment, title });
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

export const adminCreateProduct = createAsyncThunk(
  'products/adminCreateProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/products', productData);
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

export const adminDeleteProduct = createAsyncThunk(
  'products/adminDeleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const adminUpdateProduct = createAsyncThunk(
  'products/adminUpdateProduct',
  async ({ id, ...productData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/products/${id}`, productData);
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
  products: [],
  productDetails: null,
  reviews: [],
  pagination: {},
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
      state.reviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state) => {
        state.loading = false;
      })
      // Create Review
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      // Admin Create Product
      .addCase(adminCreateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(adminCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Delete Product
      .addCase(adminDeleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload && p.id !== action.payload);
      })
      .addCase(adminDeleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Admin Update Product
      .addCase(adminUpdateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p._id === action.payload._id || p.id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(adminUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
