import { useContextElement } from "@/context/Context";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import React, { useState } from "react";

const ProductModal = ({
  openProductModal,
  setopenProductModal,
  productData,
}) => {
  const [selectedColor, setSelectedColor] = useState("Beige");
  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const {
    quickAddItem,
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  const colors = [
    { name: "Beige", class: "bg-[#D2B48C]" },
    { name: "Black", class: "bg-black" },
    { name: "Light Blue", class: "bg-blue-200" },
    { name: "White", class: "bg-white" },
  ];

  const sizes = ["S", "M", "L", "XL"];

  if (!openProductModal) return null; // Do not render modal if it is closed
  console.log("productData", productData);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={() => setopenProductModal(false)} // Close modal on click
          className="absolute top-4 right-4 text-gray-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12
              12 12"
            />
          </svg>
        </button>
        {/* Title */}
        {/* Product Details */}
        <div className="flex items-start mb-6">
          {/* Left: Product Image */}
          <img
            src={getMediaUrlPath(productData?.img_file) || "default-image.jpg"} // Replace with actual image URL from productData
            alt={productData?.title || "Product Image"}
            className="w-24 h-24 object-cover rounded"
          />

          {/* Right: Title and Price */}
          <div className="ml-4 flex flex-col">
            <h3 className="text-lg font-semibold">
              {productData?.title || "Product Title"}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              ${productData?.price || "0.00"}
            </p>
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <p className="mb-2">Color: {selectedColor}</p>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === color.name
                    ? "border-black"
                    : "border-gray-300"
                } ${color.class}`}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <p className="mb-2">Size: {selectedSize}</p>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 flex items-center justify-center border ${
                  selectedSize === size
                    ? "bg-black text-white"
                    : "border-gray-300 text-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <p className="mb-2">Quantity</p>
          <div className="flex items-center w-32 bg-gray-100">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-xl"
            >
              -
            </button>
            <div className="flex-1 text-center">{quantity}</div>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => addProductToCart(productData, productData.id)}
            className="flex-1 bg-black text-white py-3 rounded"
          >
            Add to cart
          </button>
          <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={() => addToCompareItem(productData.id, productData)}
            className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>

        {/* Buy Now Button */}
        <button className="w-full bg-yellow-400 py-3 rounded">Buy Now</button>
      </div>
    </div>
  );
};

export default ProductModal;
