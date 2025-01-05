"use client";
import Login from "@/components/modals/Login";
import { allProducts } from "@/data/products";
import { openCartModal } from "@/utlis/openCartModal";
// import { addItemToWishList } from "@/utlis/ProductActionsAPIs/ProductsBasicActionsAPIs";
import { addItemToWishList } from "../utlis/ProductActionsAPIs/ProductsBasicActionsAPIs";
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
  const [wishListlength, setWishListlength] = useState(0);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState([]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [wishlistStateTracker, setwishlistStateTracker] = useState(false);
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  useEffect(() => {
    const items = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("cartList")) ||
        "[]"
    );
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);

  useEffect(() => {
    const items = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("wishlist")) ||
        "[]"
    );
    setWishList(items);
  }, []);

  useEffect(() => {
    let userid =
      typeof window !== "undefined" && localStorage.getItem("userid");
    let usertoken =
      typeof window !== "undefined" && localStorage.getItem("userToken");
    const items = JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("wishlist")) ||
        "[]"
    );
    setWishListlength(items[userid]?.length || 0);
  }, [wishlistStateTracker]);

  const updateWishListLocalStorage = (wishList) => {
    typeof window !== "undefined" &&
      localStorage.setItem("wishlist", JSON.stringify(wishList));
  };

  const addProductToCart = (productData, id, qty) => {
    let userid =
      typeof window !== "undefined" && localStorage.getItem("userid");
    let usertoken =
      typeof window !== "undefined" && localStorage.getItem("userToken");
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
    let userid =
      typeof window !== "undefined" && localStorage.getItem("userid");
    let usertoken =
      typeof window !== "undefined" && localStorage.getItem("userToken");
    // console.log(new Error().stack);
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const addToWishlist = async (product, id) => {
    let userid =
      typeof window !== "undefined" && localStorage.getItem("userid");
    let usertoken =
      typeof window !== "undefined" && localStorage.getItem("userToken");
    setwishlistStateTracker(!wishlistStateTracker);
    if (!usertoken) {
      return triggerLoginClick();
    }

    if (!wishList) {
      let itemList = { [userid]: [product] };
      setWishList(itemList);
      updateWishListLocalStorage(itemList);
    } else if (!wishList[userid]?.some((item) => item.id === id)) {
      // Note: Invalid syntax is not iterable. So Keep the syntax correct.
      setWishList((prev) => {
        // If the wishlist already contains this user, update it
        if (prev[userid]) {
          if (!prev[userid].some((item) => item.id === id)) {
            let itemList = { ...prev, [userid]: [...prev[userid], product] };
            updateWishListLocalStorage(itemList);
            return itemList;
          } else {
            let itemList = {
              ...prev,
              [userid]: prev[userid].filter((item) => item.id !== id),
            };
            return itemList;
          }
        } else {
          // If no wishlist exists for the user, create one
          let itemList = { ...prev, [userid]: [product] };
          updateWishListLocalStorage(itemList);
          return itemList;
        }
      });

      // await addItemToWishList(product);
    } else {
      setWishList((pre) => pre && [...pre].filter((elm) => elm != id)); // Keep only the elements that are not equal to 'id(item)'
    }
  };

  const removeFromWishlist = async (id) => {
    let userid =
      typeof window !== "undefined" && localStorage.getItem("userid");
    let usertoken =
      typeof window !== "undefined" && localStorage.getItem("userToken");
    setwishlistStateTracker(!wishlistStateTracker);
    if (!userid) {
      return triggerLoginClick();
    }
    // Check if the user's wishlist exists and if the product is in the wishlist

    let itemExists = wishList[userid]?.some((val) => val.id === id);
    if (itemExists) {
      setWishList((prevWishList) => {
        let listItems = {
          ...prevWishList,
          [userid]: prevWishList[userid].filter((val) => val.id !== id),
        };
        updateWishListLocalStorage(listItems);
        return listItems;
      });
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
    let userid =
      typeof window !== "undefined" && localStorage.getItem("userid");
    let usertoken =
      typeof window !== "undefined" && localStorage.getItem("userToken");
    // Check if the user's wishlist exists and if the product is in the wishlist
    let alreadyAdded =
      wishList && wishList[userid]?.some((val) => val.id === id);

    return alreadyAdded || false; // Returns true if the product is already added, otherwise false
  };

  const isAddedtoCompareItem = (id) => {
    // console.log(new Error().stack);
    let isItemCompare = compareItem.some((item) => item.id === id);
    if (isItemCompare) {
      return true;
    }
    return false;
  };
  const triggerLoginClick = () => {
    const element = document.createElement("a");
    element.href = "#login";
    element.dataset.bsToggle = "modal";
    element.className = "nav-icon-item";
    element.innerHTML = '<i class="icon icon-account"></i>';
    document.body.appendChild(element);
    element.click(); // Programmatically trigger the click
    element.remove(); // Clean up the DOM
  };

  // u
  // useEffect(() => {
  //   localStorage.setItem("wishlist", JSON.stringify(wishList));
  // }, [wishList]);

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
    wishListlength,
  };

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
