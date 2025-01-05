import axios from "axios";
import { apiUrl } from "@/lib/apiUrl";

export const fetchAllProducts = async () => {
  try {
    let { data } = await axios.get(
      `${apiUrl}/admin/grocerry/get-grocery-products`
    );
    if (data.success) {
      return data.products;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};

export const fetchAllProductsWithLimit = async (limit) => {
  try {
    let { data } = await axios.get(
      `${apiUrl}/admin/grocerry/get-grocery-products?limit=${limit}`
    );
    if (data.success) {
      return data.products;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};

export const fetchSingleProduct = async (productid) => {
  try {
    let { data } = await axios.get(
      `${apiUrl}/admin/grocerry/get-grocery-products/${productid}`
    );
    if (data.success) {
      return data.products;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};

// Customer Related APIs
export const addItemToWishList = async (product) => {
  try {
    const userToken = localStorage.getItem("userToken");
    let { data } = await axios.post(
      `${apiUrl}/customerDashboard/addItemToWishList`,
      { product },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    if (data.success) {
      return data.products;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return error;
  }
};
