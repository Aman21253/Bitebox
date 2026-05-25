import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import API from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ FIXED: Wrapped in useCallback so it's stable and
  //    can safely be used inside useEffect and addToCart
  const fetchCart = useCallback(async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user || user.role !== "customer") {
        return;
      }

      const response = await API.get("/customer/cart");

      // ✅ FIXED: API returns { carts: [...] }
      // We take the first cart since one customer
      // has one active cart at a time
      const carts = response.data.carts;

      if (carts && carts.length > 0) {
        setCart(carts[0]);
      } else {
        setCart({ items: [], total_amount: 0 });
      }

    } catch (error) {
      console.error("fetchCart error:", error);
      setCart({ items: [], total_amount: 0 });
    }

  }, []);

  // Load cart on mount for customers only
  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user || user.role !== "customer") {
      return;
    }

    fetchCart();

  }, [fetchCart]);

  // ADD TO CART
  const addToCart = async (
    menu_item_id,
    variant_id = null,
    addon_ids = [],
    quantity = 1
  ) => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user || user.role !== "customer") {
        alert("Only customers can add items to cart");
        return;
      }

      // ✅ FIXED: Explicit payload with null/array safety
      const payload = {
        menu_item_id,
        variant_id: variant_id ?? null,
        addon_ids: addon_ids ?? [],
        quantity,
      };

      await API.post("/customer/cart/add", payload);

      // ✅ Refresh cart then open sidebar
      await fetchCart();

      setCartOpen(true);

    } catch (error) {

      console.error("addToCart error:", error);

      alert(
        error.response?.data?.detail ||
        "Failed to add item to cart"
      );
    }
  };

  // UPDATE QUANTITY
  const updateQuantity = async (cart_item_id, quantity) => {

    try {

      // ✅ FIXED: If quantity hits 0, remove the item instead
      if (quantity <= 0) {
        await removeItem(cart_item_id);
        return;
      }

      await API.put(
        `/customer/cart/item/${cart_item_id}`,
        { quantity }
      );

      fetchCart();

    } catch (error) {

      console.error("updateQuantity error:", error);

    }
  };

  // REMOVE ITEM
  const removeItem = async (cart_item_id) => {

    try {

      await API.delete(
        `/customer/cart/item/${cart_item_id}`
      );

      fetchCart();

    } catch (error) {

      console.error("removeItem error:", error);

    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);