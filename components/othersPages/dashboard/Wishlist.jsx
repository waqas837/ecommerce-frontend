"use client";

import { ProductCardWishlist } from "@/components/shopCards/ProductCardWishlist";
import { useContextElement } from "@/context/Context";
import { allProducts } from "@/data/products";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Wishlist() {
  const { wishList } = useContextElement();
  const [wishListItems, setWishListItems] = useState([]);
  let userid = localStorage.getItem("userid");
  useEffect(() => {
    if (wishList) {
      setWishListItems(wishList);
    }
  }, [wishList]);
  return (
    <div className="my-account-content account-wishlist">
      <div className="grid-layout wrapper-shop" data-grid="grid-3">
        {/* card product 1 */}
        {wishListItems[userid]?.map((elm, i) => (
          <ProductCardWishlist product={elm} key={i} />
        ))}
      </div>
      {!wishListItems[userid]?.length && (
        <>
          <div
            className="row align-items-center w-100"
            style={{ rowGap: "20px" }}
          >
            <div className="col-lg-3 col-md-6 fs-18">
              Your wishlist is empty
            </div>
            <div className="col-lg-3  col-md-6">
              <Link
                href={`/`}
                className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
              >
                Explore Products!
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
