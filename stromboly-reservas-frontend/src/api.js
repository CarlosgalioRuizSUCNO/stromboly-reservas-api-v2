import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
}
});

// ---- ROOMS ----
export const RoomsApi = {
  async list() {
    const { data } = await api.get("/rooms/");
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/rooms/", payload);
    return data;
  },
  // Úsalo solo si más adelante agregas el PUT en el backend
  async update(id, payload) {
    const { data } = await api.put(`/rooms/${id}`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/rooms/${id}`);
  },
};

// ---- CUSTOMERS ----
export const CustomersApi = {
  async list() {
    const { data } = await api.get("/customers/");
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/customers/", payload);
    return data;
  },
  // Igual que arriba, depende de que tengas PUT en el backend
  async update(id, payload) {
    const { data } = await api.put(`/customers/${id}`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/customers/${id}`);
  },
};

// ---- BOOKINGS ----
export const BookingsApi = {
  async list() {
    const { data } = await api.get("/bookings/");
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/bookings/", payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/bookings/${id}`);
  },
};