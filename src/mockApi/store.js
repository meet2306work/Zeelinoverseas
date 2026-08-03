import { categories as seedCategories, products as seedProducts, demoUserBase } from './data';

const STORAGE_KEY = 'zeelin_mock_db_v1';

function seedState() {
  return {
    products: seedProducts.map((p) => ({ ...p, reviews: [...(p.reviews || [])] })),
    categories: seedCategories,
    wishlist: [],
    user: null,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.products) && Array.isArray(parsed?.categories)) return parsed;
    }
  } catch {
    // corrupted/unavailable storage — fall back to fresh seed
  }
  return null;
}

const db = loadState() || seedState();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // storage unavailable (private mode, quota exceeded) — mock still works in-memory
  }
}

let reviewCounter = 1;

export const store = {
  getCategories() {
    return db.categories;
  },

  getProducts({ search, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = {}) {
    let items = [...db.products];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (category) {
      items = items.filter((p) => p.category?._id === category || p.category?.name === category);
    }
    if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));
    if (rating) items = items.filter((p) => p.averageRating >= Number(rating));

    switch (sort) {
      case 'price_asc': items.sort((a, b) => a.price - b.price); break;
      case 'price_desc': items.sort((a, b) => b.price - a.price); break;
      case 'rating': items.sort((a, b) => b.averageRating - a.averageRating); break;
      default: break;
    }

    const total = items.length;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;
    const start = (pageNum - 1) * limitNum;
    const pageItems = items.slice(start, start + limitNum);

    return { items: pageItems, pagination: { page: pageNum, pages: Math.max(1, Math.ceil(total / limitNum)), total } };
  },

  getProductById(id) {
    return db.products.find((p) => p._id === id || p.slug === id) || null;
  },

  addReview(productId, { rating, title, text }) {
    const product = this.getProductById(productId);
    if (!product) return null;
    const review = {
      _id: `review-${Date.now()}-${reviewCounter++}`,
      title: title || '',
      rating: Number(rating) || 5,
      comment: text || '',
      user: { firstName: db.user?.firstName || 'Guest' },
      createdAt: new Date().toISOString(),
    };
    product.reviews = [review, ...(product.reviews || [])];
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = Math.round((total / product.reviews.length) * 10) / 10;
    product.rating = product.averageRating;
    persist();
    return review;
  },

  getReviews(productId) {
    return this.getProductById(productId)?.reviews || [];
  },

  getWishlistProducts() {
    return db.wishlist.map((id) => this.getProductById(id)).filter(Boolean);
  },

  addToWishlist(productId) {
    if (!db.wishlist.includes(productId)) db.wishlist.push(productId);
    persist();
    return this.getWishlistProducts();
  },

  removeFromWishlist(productId) {
    db.wishlist = db.wishlist.filter((id) => id !== productId);
    persist();
    return this.getWishlistProducts();
  },

  getCurrentUser() {
    return db.user;
  },

  login({ email }) {
    db.user = { ...demoUserBase, email: email || demoUserBase.email };
    persist();
    return db.user;
  },

  register({ firstName, lastName, email, phone }) {
    db.user = {
      ...demoUserBase,
      firstName: firstName || demoUserBase.firstName,
      lastName: lastName || demoUserBase.lastName,
      email: email || demoUserBase.email,
      phone: phone || demoUserBase.phone,
    };
    persist();
    return db.user;
  },

  updateProfile(updates) {
    if (!db.user) return null;
    db.user = { ...db.user, ...updates };
    persist();
    return db.user;
  },

  logout() {
    db.user = null;
    persist();
  },
};
