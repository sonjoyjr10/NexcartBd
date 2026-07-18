// FILE: config.js
// NEXCARTBD — API configuration
// Replace API_URL with your real backend base URL.

const API_URL = "https://api.nexcartbd.com";

const API_ACTIONS = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  GET_PRODUCTS: `${API_URL}/products`,
  CREATE_ORDER: `${API_URL}/orders/create`
};
