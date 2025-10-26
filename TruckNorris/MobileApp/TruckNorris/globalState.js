export let userEmail = "";
export let userRole = "";
export let globalEmail = null;
export let API = `https://wolfystudios.net`;
export let activeOrg = "";

export const setUserEmail = (email) => (userEmail = email);
export const setGlobalEmail = (email) => (globalEmail = email); // ORIGINAL EMAIL
export const setUserRole = (role) => (userRole = role);

export const getUserEmail = () => userEmail;
export const getUserRole = () => userRole;
export const getActiveOrg = () => activeOrg;

export const setActiveOrg = (org) => {
  activeOrg = org;
  console.log("Active Org set to:", activeOrg);
};

/** Cart logic */
export let cart = [];

export const addToCart = ({ trackName, artistName, artworkUrl, price, modifier }) => {
  const existing = cart.find(
    (item) => item.trackName === trackName && item.artistName === artistName
  );
  console.log('PRICE: %d', price);
  console.log('MODIFIER: %d', modifier);
  const pointCost = Math.round(price * modifier); // default fallback = 100 points

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      trackName,
      artistName,
      artworkUrl,
      pointCost,
      quantity: 1
    });
  }

  console.log("Cart updated:", cart);
};

export const getCart = () => cart;

export const clearCart = () => {
  cart = [];
  console.log("Cart cleared.");
};

/** Role Fetching */
export const fetchUserRole = async () => {
  try {
    const emailToCheck = userEmail;
    if (!emailToCheck) throw new Error("User email is not set.");

    const apiUrl = `${API}/mobile/userRole?email=${encodeURIComponent(emailToCheck)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Email:", emailToCheck);
    console.log("Resp:", data);
    if (!response.ok) throw new Error(data.message || "Failed to fetch user role.");

    userRole = data.role;
    userRole = userRole.charAt(0).toLowerCase() + userRole.slice(1); // normalize to lowercase first letter
    console.log("Role:", userRole);
    return userRole;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};
