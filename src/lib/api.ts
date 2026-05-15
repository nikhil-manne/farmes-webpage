type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  timestamp: string;
};

type ApiErrorEnvelope = {
  success: false;
  error?: { message?: string | string[] };
};

export type BackendUser = {
  id: string;
  phone: string;
  name: string | null;
  address: string | null;
  roles: string[];
};

export type BackendProduct = {
  id: string;
  name: string;
  pricePerKg: string;
  farmerId: string;
  isActive: boolean;
  farmer: {
    id: string;
    farmName: string | null;
    villageOrAddress: string;
    user: {
      name: string | null;
      phone: string;
    };
  };
  farmerSupply?: Array<{
    farmerId: string;
    farmerName: string | null;
    farmerPhone: string | null;
    farmName: string | null;
    farmerLocation: string | null;
    availableQtyKg: number;
    harvestQtyKg: number;
    landAssignedAcres: number;
  }>;
  allowedPackSizes?: string[];
  quantityPrices?: Record<string, number>;
};

export type BackendFarmer = {
  id: string;
  farmName: string | null;
  landSize: string;
  villageOrAddress: string;
  user: {
    name: string | null;
    phone: string;
    address: string | null;
  };
  media: Array<{ id: string; type: "IMAGE" | "VIDEO"; url: string }>;
  products: BackendProduct[];
};

export type BackendFarmerMedia = {
  id: string;
  type: "IMAGE" | "VIDEO" | null;
  url: string | null;
  key?: string | null;
};

export type BackendSignedMedia = {
  mediaId: string;
  url: string;
};

export type BackendCart = {
  id: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: string;
    product: BackendProduct;
  }>;
};

export type BackendOrderStatus =
  | "PLACED"
  | "LOCKED"
  | "HARVESTING"
  | "PACKED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED";

export type BackendOrder = {
  id: string;
  createdAt: string;
  status: BackendOrderStatus;
  totalAmount: string;
  items: Array<{
    id: string;
    quantity: string;
    price?: string;
    product?: BackendProduct;
  }>;
};

export type BackendSettings = {
  id: string;
  deliveryPrice: string;
  packagingFee: string;
  platformFee: string;
  gstPercentage: string;
  scheduledDeliveryTime: string;
  orderCutoffTime: string;
  updatedAt: string;
};

export type CreateOrderPayload = {
  cartId?: string;
  items?: { productId: string; quantity: number }[];
  deliveryDate?: string;
};

const AUTH_TOKEN_KEY = "farmes_auth_token";
const REQUEST_TIMEOUT_MS = 30000;
let authToken: string | null = null;
let sessionLoaded = false;

function getBaseUrl() {
  return (import.meta.env.VITE_API_URL || "https://farmes-backend-production.up.railway.app").replace(/\/+$/, "");
}

async function loadSessionFromStorage() {
  if (sessionLoaded) return;
  authToken = localStorage.getItem(AUTH_TOKEN_KEY) || null;
  sessionLoaded = true;
}

async function request<T>(path: string, init?: RequestInit, requireAuth = false): Promise<T> {
  if (requireAuth && !sessionLoaded) {
    await loadSessionFromStorage();
  }
  if (requireAuth && !authToken) {
    throw new Error("Please login to continue.");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${getBaseUrl()}${normalizedPath}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  const raw = await res.text();
  let payload: ApiEnvelope<T> | ApiErrorEnvelope | null = null;
  try {
    payload = JSON.parse(raw) as ApiEnvelope<T> | ApiErrorEnvelope;
  } catch {
    payload = null;
  }

  // Auto-clear stale session when the backend explicitly rejects the token
  if (res.status === 401) {
    authToken = null;
    sessionLoaded = true;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    const messageRaw = payload && "error" in payload ? payload.error?.message : null;
    const message = Array.isArray(messageRaw) ? messageRaw.join(", ") : messageRaw;
    throw new Error(message || "Session expired. Please log in again.");
  }

  if (!payload || !res.ok || !("success" in payload) || payload.success === false) {
    const messageRaw = payload && "error" in payload ? payload.error?.message : "Request failed";
    const message = Array.isArray(messageRaw) ? messageRaw.join(", ") : messageRaw;
    throw new Error(message || (raw ? raw.slice(0, 120) : "Request failed"));
  }

  return payload.data;
}

export const api = {
  ensureSessionLoaded: () => loadSessionFromStorage(),
  isSessionLoaded: () => sessionLoaded,
  hasSession: () => {
    if (!sessionLoaded) {
      authToken = localStorage.getItem(AUTH_TOKEN_KEY) || null;
      sessionLoaded = true;
    }
    return Boolean(authToken);
  },
  register: async (phone: string, name: string, password: string, address: string) => {
    const res = await request<{ accessToken: string; user: BackendUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ phone, name, password, address }),
    });
    authToken = res.accessToken;
    sessionLoaded = true;
    localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
    return res.user;
  },
  login: async (phone: string, password: string) => {
    const res = await request<{ accessToken: string; user: BackendUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    });
    authToken = res.accessToken;
    sessionLoaded = true;
    localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken);
    return res.user;
  },
  resetPassword: async (phone: string, password: string, firebaseToken?: string) => {
    return await request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ phone, password, firebaseToken }),
    });
  },
  listProducts: () => request<BackendProduct[]>("/products"),
  getSettings: () => request<BackendSettings>("/settings"),
  getProduct: (id: string) => request<BackendProduct>(`/products/${id}`),
  getFarmer: (id: string) => request<BackendFarmer>(`/farmers/${id}`),
  listFarmerMedia: (id: string) => request<BackendFarmerMedia[]>(`/farmers/${id}/media`),
  getFarmerMediaSigned: (farmerId: string) =>
    request<{ farmerId: string; items: BackendSignedMedia[] }>(`/media/farmer/${farmerId}`, undefined, true),
  getMediaSignedById: (mediaId: string) => request<{ mediaId: string; url: string }>(`/media/${mediaId}`, undefined, true),
  getCart: () => request<BackendCart>("/cart", undefined, true),
  addToCart: (productId: string, quantity = 1) =>
    request("/cart/add", { method: "POST", body: JSON.stringify({ productId, quantity }) }, true),
  removeFromCart: (productId: string, quantity = 1) =>
    request("/cart/remove", { method: "POST", body: JSON.stringify({ productId, quantity }) }, true),
  listOrders: () => request<BackendOrder[]>("/orders", undefined, true),
  createOrder: (payload: CreateOrderPayload = {}) =>
    request<BackendOrder>("/orders", { method: "POST", body: JSON.stringify(payload) }, true),
  createPayment: (orderId: string) =>
    request<{ id: string; amount: string; razorpayOrderId: string }>("/payments/create", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }, true),
  verifyPayment: (payload: { paymentId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    request("/payments/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }, true),
  getMe: () => request<BackendUser>("/users/me", undefined, true),
  updateMe: (payload: { name?: string; address?: string }) =>
    request<BackendUser>("/users/me", { method: "PATCH", body: JSON.stringify(payload) }, true),
  recordInterest: (interested: boolean) =>
    request("/interest", { method: "POST", body: JSON.stringify({ interested }) }),
  resetSession: () => {
    authToken = null;
    sessionLoaded = true;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};
