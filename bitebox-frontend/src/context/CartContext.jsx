import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(null);

  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {

    fetchCart();

  }, []);

  const fetchCart = async () => {

    try {

      const response = await API.get(
        "/customer/cart"
      );

      setCart(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  const addToCart = async (
    menu_item_id,
    variant_id = null,
    addon_ids = [],
    quantity = 1
  ) => {

    try {

      await API.post(
        "/customer/cart/add",
        {
          menu_item_id,
          variant_id,
          addon_ids,
          quantity,
        }
      );

      fetchCart();

      setCartOpen(true);

    } catch (error) {

      alert(
        error.response?.data?.detail
      );
    }
  };

  const updateQuantity = async (
    cart_item_id,
    quantity
  ) => {

    try {

      await API.put(
        `/customer/cart/item/${cart_item_id}`,
        {
          quantity,
        }
      );

      fetchCart();

    } catch (error) {

      console.log(error);

    }
  };

  const removeItem = async (
    cart_item_id
  ) => {

    try {

      await API.delete(
        `/customer/cart/item/${cart_item_id}`
      );

      fetchCart();

    } catch (error) {

      console.log(error);

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
      }}
    >

      {children}

    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);