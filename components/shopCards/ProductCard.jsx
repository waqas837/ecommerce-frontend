"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import ProductModal from "../MyModals/ProductModal";
// import { fetchSingleProduct } from "@/utlis/ProductActionsAPIs/ProductsBasicActionsAPIs";

export const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  const [openProductModal, setopenProductModal] = useState(false);
  const { setQuickViewItem } = useContextElement();
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromWishlist,
  } = useContextElement();
  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  //  This is modal to show Product Details only
  const addProductModal = async (product) => {
    // const data = await fetchSingleProduct(productId);
    // console.log("data got for single Product", data);
    setQuickAddItem(product[0]);
    setopenProductModal(!openProductModal);
  };

  return (
    <div>
      {openProductModal && (
        <ProductModal
          openProductModal={openProductModal}
          setopenProductModal={setopenProductModal}
          productData={product}
        />
      )}
      <div className="card-product fl-item" key={product.id}>
        <div className="card-product-wrapper">
          <Link href={`/product-detail/${product.id}`} className="product-img">
            <Image
              className="lazyload img-product"
              data-src={
                product.img_hover_file
                  ? getMediaUrlPath(product.img_hover_file)
                  : getMediaUrlPath(product.img_file)
              }
              src={
                product.img_hover_file
                  ? getMediaUrlPath(product.img_hover_file)
                  : getMediaUrlPath(product.img_file)
              }
              alt="image-product"
              width={720}
              height={1005}
              style={{ width: "250px", height: "150px" }}
            />
            <Image
              className="lazyload img-hover"
              data-src={
                product.img_hover_file
                  ? getMediaUrlPath(product.img_hover_file)
                  : getMediaUrlPath(product.img_file)
              }
              src={
                product.img_file
                  ? getMediaUrlPath(product.img_file)
                  : getMediaUrlPath(product.img_hover_file)
              }
              alt="image-product"
              width={720}
              height={1005}
            />
          </Link>
          <div className="list-product-btn">
            <a
              href="#quick_add"
              onClick={() => setQuickAddItem(product)}
              data-bs-toggle="modal"
              className="box-icon bg_white quick-add tf-btn-loading"
            >
              <span className="icon icon-bag" />
              <span className="tooltip">Quick Add</span>
            </a>
            <a
              onClick={() => {
                isAddedtoWishlist(product.id)
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product, product.id);
              }}
              className="box-icon bg_white wishlist btn-icon-action"
            >
              <span
                className={`icon icon-heart ${
                  isAddedtoWishlist(product.id) ? "added" : ""
                }`}
              />
              <span className="tooltip">
                {isAddedtoWishlist(product.id)
                  ? "Already Wishlisted"
                  : "Add to Wishlist"}
              </span>
              <span className="icon icon-delete" />
            </a>
            <a
              href="#compare"
              data-bs-toggle="offcanvas"
              aria-controls="offcanvasLeft"
              onClick={() => addToCompareItem(product.id, product)}
              className="box-icon bg_white compare btn-icon-action"
            >
              <span
                className={`icon icon-compare ${
                  isAddedtoCompareItem(product.id) ? "added" : ""
                }`}
              />
              <span className="tooltip">
                {isAddedtoCompareItem(product.id)
                  ? "Already Compared"
                  : "Add to Compare"}
              </span>
              <span className="icon icon-check" />
            </a>
            <a
              href="#quick_view"
              onClick={() => setQuickViewItem(product)}
              data-bs-toggle="modal"
              className="box-icon bg_white quickview tf-btn-loading"
            >
              <span className="icon icon-view" />
              <span className="tooltip">Quick View</span>
            </a>
          </div>
          {product.countdown && (
            <div className="countdown-box">
              <div className="js-countdown">
                <CountdownComponent />
              </div>
            </div>
          )}
          {/* {product.sizes && (
            <div className="size-list">
              {product.sizes.map((size) => (
                <span key={size}>{size}</span>
              ))}
            </div>
          )} */}
        </div>
        <div className="card-product-info">
          <Link href={`/product-detail/${product.id}`} className="title link">
            {product.title}
          </Link>
          {/* <span className="price">${product.price.toFixed(2)}</span> */}
          {/* {product.colors && (
            <ul className="list-color-product">
              {product.colors.map((color) => (
                <li
                  className={`list-color-item color-swatch ${
                    currentImage == color.imgSrc ? "active" : ""
                  } `}
                  key={color.name}
                  onMouseOver={() => setCurrentImage(color.imgSrc)}
                >
                  <span className="tooltip">{color.name}</span>
                  <span className={`swatch-value ${color.colorClass}`} />
                  <Image
                    className="lazyload"
                    data-src={color.imgSrc}
                    src={color.imgSrc}
                    alt="image-product"
                    width={720}
                    height={1005}
                  />
                </li>
              ))}
            </ul>
          )} */}
        </div>
      </div>
    </div>
  );
};
