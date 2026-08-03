import { store } from './store';

function ok(data, extra = {}) {
  return { status: 200, data: { success: true, data, ...extra } };
}

function fail(status, message) {
  const error = new Error(message);
  error.isAxiosError = true;
  error.response = { status, data: { success: false, message } };
  return error;
}

const demoUnavailable = (action) => fail(403, `${action} isn't available in this demo — there's no backend connected.`);

function compile(pattern) {
  const keys = [];
  const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, (m) => {
    keys.push(m.slice(1));
    return '([^/]+)';
  }) + '$');
  return { regex, keys };
}

function route(method, pattern, handler) {
  return { method, handler, ...compile(pattern) };
}

const routes = [
  // Categories
  route('get', '/categories', ({ query }) => ok(store.getCategories(), { pagination: { page: 1, pages: 1, total: store.getCategories().length }, count: store.getCategories().length })),
  route('post', '/categories', () => { throw demoUnavailable('Managing categories'); }),
  route('put', '/categories/:id', () => { throw demoUnavailable('Managing categories'); }),
  route('delete', '/categories/:id', () => { throw demoUnavailable('Managing categories'); }),

  // Products
  route('get', '/products', ({ query }) => {
    const { items, pagination } = store.getProducts(query);
    return ok(items, { pagination, count: items.length });
  }),
  route('get', '/products/:id', ({ params }) => {
    const p = store.getProductById(params.id);
    if (!p) throw fail(404, 'Product not found.');
    return ok(p);
  }),
  route('get', '/products/:id/reviews', ({ params }) => ok(store.getReviews(params.id))),
  route('post', '/products/:id/reviews', ({ params, body }) => {
    const review = store.addReview(params.id, body);
    if (!review) throw fail(404, 'Product not found.');
    return { status: 201, data: { success: true, data: review } };
  }),
  route('post', '/products', () => { throw demoUnavailable('Managing products'); }),
  route('put', '/products/:id', () => { throw demoUnavailable('Managing products'); }),
  route('delete', '/products/:id', () => { throw demoUnavailable('Managing products'); }),

  // Wishlist
  route('get', '/users/wishlist', () => ok(store.getWishlistProducts())),
  route('post', '/users/wishlist', ({ body }) => ok(store.addToWishlist(body.productId))),
  route('delete', '/users/wishlist/:productId', ({ params }) => ok(store.removeFromWishlist(params.productId))),

  // Auth
  route('post', '/auth/login', ({ body }) => ok({ user: store.login(body) })),
  route('post', '/auth/register', ({ body }) => ({ status: 201, data: { success: true, data: { user: store.register(body) } } })),
  route('get', '/auth/me', () => {
    const user = store.getCurrentUser();
    if (!user) throw fail(401, 'Not authenticated.');
    return ok(user);
  }),
  route('post', '/auth/verify-email', () => ok({})),
  route('post', '/auth/resend-otp', () => ok({})),
  route('put', '/users/profile', ({ body }) => {
    const user = store.updateProfile(body);
    if (!user) throw fail(401, 'Not authenticated.');
    return ok(user);
  }),
  route('post', '/auth/forgot-password', () => ok({})),
  route('put', '/auth/reset-password/:token', () => ok({})),
  route('post', '/auth/logout', () => { store.logout(); return ok({}); }),

  // Orders — reads return empty (existing UI already shows static sample orders when the list is empty)
  route('get', '/orders/myorders', () => ok([], { pagination: { page: 1, pages: 1, total: 0 } })),
  route('get', '/orders', () => ok([], { pagination: { page: 1, pages: 1, total: 0 } })),
  route('get', '/orders/:id', () => { throw fail(404, 'Order not found in this demo.'); }),
  route('post', '/orders', () => { throw demoUnavailable('Checkout'); }),
  route('put', '/orders/:id', () => { throw demoUnavailable('Updating orders'); }),

  // Support tickets
  route('get', '/tickets/mytickets', () => ok([])),
  route('get', '/tickets', () => ok([])),
  route('post', '/tickets', () => { throw demoUnavailable('Submitting a support ticket'); }),
  route('post', '/tickets/:id/replies', () => { throw demoUnavailable('Replying to tickets'); }),

  // RFQ
  route('get', '/rfq/myrfqs', () => ok([], { pagination: { page: 1, pages: 1, total: 0 } })),
  route('get', '/rfq', () => ok([], { pagination: { page: 1, pages: 1, total: 0 } })),
  route('post', '/rfq', () => { throw demoUnavailable('Submitting an RFQ'); }),
  route('put', '/rfq/:id', () => { throw demoUnavailable('Updating RFQs'); }),
];

function matchRoute(method, path) {
  for (const r of routes) {
    if (r.method !== method) continue;
    const m = path.match(r.regex);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      return { handler: r.handler, params };
    }
  }
  return null;
}

export default function mockAdapter(config) {
  return new Promise((resolve, reject) => {
    const delayMs = 250 + Math.random() * 300;
    setTimeout(() => {
      try {
        const method = (config.method || 'get').toLowerCase();
        const [path, queryString = ''] = (config.url || '').split('?');
        const query = Object.fromEntries(new URLSearchParams(queryString));

        let body = {};
        if (config.data) {
          body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        }

        const matched = matchRoute(method, path);
        if (!matched) {
          reject(fail(404, `No mock handler for ${method.toUpperCase()} ${path}`));
          return;
        }

        const result = matched.handler({ params: matched.params, query, body });
        resolve({
          data: result.data,
          status: result.status || 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
        });
      } catch (error) {
        reject(error?.response ? error : fail(500, error?.message || 'Mock API error'));
      }
    }, delayMs);
  });
}
