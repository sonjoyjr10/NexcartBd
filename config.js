// NEXCARTBD — API configuration
// This is your Google Apps Script Web App URL. Apps Script only has ONE
// endpoint (ending in /exec) — it does NOT support extra path segments like
// /auth/login. Instead, every request goes to this same URL, and an "action"
// field inside the request body tells the backend what to do.

const API_URL = "https://script.google.com/macros/s/AKfycby0TRknlK8NebkjS2x-tdPnNJ0Tl-8eE2j5an2jIpjUH2qIXZbnJzMcVUQ18hbmlChk/exec";

const API_ACTIONS = {
  REGISTER: "register",
  LOGIN: "login",
  GET_PRODUCTS: "getProducts",
  CREATE_ORDER: "createOrder",
  TRACK_ORDER: "trackOrder"
};
