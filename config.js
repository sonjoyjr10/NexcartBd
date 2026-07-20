// NEXCARTBD — API configuration
// Replace API_URL with your real backend base URL.

const API_URL = "https://script.google.com/macros/s/AKfycbwSrInmFfHanLBvaLSsBx5swYf-Fy5eau4XTKmmHP3iqz_47hHzs32V0KHe2ZKlGl5Q/exec";

const API_ACTIONS = {
  REGISTER: `${API_URL}/auth/register`,
  LOGIN: `${API_URL}/auth/login`,
  GET_PRODUCTS: `${API_URL}/products`,
  CREATE_ORDER: `${API_URL}/orders/create`
};
