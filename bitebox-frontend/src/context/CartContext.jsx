import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({
  children,
}) => {

  const [cart, setCart] =
    useState(null);

  const [cartOpen, setCartOpen] =
    useState(false);

  // LOAD CART ONLY FOR CUSTOMER

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      !user ||
      user.role !== "customer"
    ) {
      return;
    }

    fetchCart();

  }, []);

  // FETCH CART

  const fetchCart = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (
        !user ||
        user.role !== "customer"
      ) {
        return;
      }

      const response = await API.get(
        "/customer/cart"
      );

      setCart(response.data);

    } catch (error) {

      console.log(error);

    }
  };

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

      if (
        !user ||
        user.role !== "customer"
      ) {

        alert(
          "Only customers can add items to cart"
        );

        return;
      }

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
        error.response?.data?.detail ||
        "Failed to add item"
      );
    }
  };

  // UPDATE QUANTITY

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

  // REMOVE ITEM

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