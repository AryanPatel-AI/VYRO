import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  withCredentials: false,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vyro_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vyro_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;

// ─── Typed API helpers ────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const usersApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: any) => api.patch('/users/me', data),
};

export const socialAccountsApi = {
  list: () => api.get('/social-accounts'),
  disconnect: (id: string) => api.delete(`/social-accounts/${id}`),
};

export const contentApi = {
  list: () => api.get('/content'),
  get: (id: string) => api.get(`/content/${id}`),
  create: (data: { rawInput: string; contentType: string; mediaUrls?: string[] }) =>
    api.post('/content', data),
};

export const aiApi = {
  generate: (input: string, platforms: string[], ctx: object) =>
    api.post('/ai/generate', { input, platforms, ctx }),
  analyzeSEO: (input: string, platform: string, ctx: object) =>
    api.post('/ai/analyze-seo', { input, platform, ctx }),
  extractRequirements: (message: string) =>
    api.post('/ai/extract-requirements', { message }),
};

export const generatedPostsApi = {
  approve: (id: string) => api.patch(`/generated-posts/${id}/approve`),
  reject: (id: string) => api.patch(`/generated-posts/${id}/reject`),
};

export const scheduledPostsApi = {
  schedule: (data: { generatedPostId: string; socialAccountId: string; scheduledAt: string }) =>
    api.post('/scheduled-posts', data),
  calendar: (from: string, to: string) =>
    api.get('/scheduled-posts/calendar', { params: { from, to } }),
};

export const analyticsApi = {
  get: (accountId: string, days?: number) =>
    api.get(`/analytics/${accountId}`, { params: { days } }),
};

export const brandsApi = {
  list: () => api.get('/brands'),
  create: (data: object) => api.post('/brands', data),
  update: (id: string, data: object) => api.patch(`/brands/${id}`, data),
};

export const sponsorshipsApi = {
  list: (status?: string) => api.get('/sponsorships', { params: { status } }),
  get: (id: string) => api.get(`/sponsorships/${id}`),
  create: (data: object) => api.post('/sponsorships', data),
  updateStatus: (id: string, status: string, note?: string) =>
    api.patch(`/sponsorships/${id}/status`, { status, note }),
  verification: (id: string) => api.get(`/sponsorships/${id}/verification`),
  updateCheck: (id: string, checkName: string, isPassed: boolean, notes?: string) =>
    api.patch(`/sponsorships/${id}/checks/${checkName}`, { isPassed, notes }),
};

export const communicationsApi = {
  list: (sponsorshipId: string) =>
    api.get(`/sponsorships/${sponsorshipId}/communications`),
  create: (sponsorshipId: string, data: object) =>
    api.post(`/sponsorships/${sponsorshipId}/communications`, data),
};

export const discoveryApi = {
  brands: () => api.get('/discovery/brands'),
};
