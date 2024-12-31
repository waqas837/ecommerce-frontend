"use client";
import { allProducts } from "@/data/products";
import { openCartModal } from "@/utlis/openCartModal";
// import { openCart } from "@/utlis/toggleCart";
import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState([]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const addProductToCart = (productData, id, qty) => {
    // console.log(new Error().stack);
    let finditem = cartProducts.some((item) => item.id === id);
    // Check if the product with the given `id` is already in the `cartProducts` array
    if (!finditem) {
      // If the product is not in the cart, find the product details from the `allProducts` array
      const item = {
        ...productData, // Spread the product's properties into a new object
        quantity: qty ? qty : 1, // Add a `quantity` property, defaulting to 1 if `qty` is not provided
      };

      // Add the new item to the cart by updating the `cartProducts` state
      setCartProducts((pre) => [...pre, item]);

      // Open the cart modal to show the updated cart to the user
      openCartModal();

      // Optionally, another function to handle additional cart opening logic (commented out here)
      // openCart();
    }
  };

  const isAddedToCartProducts = (id) => {
    // console.log(new Error().stack);
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const addToWishlist = (product, id) => {
    // console.log(new Error().stack);
    if (!wishList.some((item) => item.id === id)) {
      setWishList((pre) => [...pre, product]);
    } else {
      setWishList((pre) => [...pre].filter((elm) => elm != id)); // Keep only the elements that are not equal to 'id(item)'
    }
  };

  const removeFromWishlist = (id) => {
    //  console.log(new Error().stack);
    let itemExists = wishList.some((val) => val.id === id);
    if (itemExists) {
      setWishList(wishList.filter((val) => val.id !== id));
    }
  };

  const addToCompareItem = (id, product) => {
    // console.log(new Error().stack);
    let finditem = compareItem.some((item) => item.id === id);
    if (!finditem) {
      setCompareItem((pre) => [...pre, product]);
    }
  };
  const removeFromCompareItem = (id) => {
    // console.log(new Error().stack);
    let itemExists = compareItem.some((val) => val.id === id);
    if (itemExists) {
      setCompareItem(compareItem.filter((val) => val.id !== id));
    }
  };
  const isAddedtoWishlist = (id) => {
    //  console.log(new Error().stack);
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  const isAddedtoCompareItem = (id) => {
    // console.log(new Error().stack);
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
  };
  
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
