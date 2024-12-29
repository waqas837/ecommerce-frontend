"use client";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      let { data } = await axios.get(
        `${apiUrl}/admin/grocerry/get-grocery-products`
      );
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/admin/grocerry/getGroceryCategory`
      );
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching getGroceryCategory:", error);
    }
  };

  const units = [
    "grams (g)",
    "kilograms (kg)",
    "ounces (oz)",
    "pounds (lb)",
    "milliliters (ml)",
    "liters (L)",
    "pieces (pcs)",
    "packets (pkt)",
  ];

  const handleAdd = async (e) => {
    try {
      e.preventDefault();
      toast.loading();
      let formdata = new FormData();
      formdata.append("title", newProduct.name);
      formdata.append("category_id", newProduct.category_id);
      formdata.append("description", newProduct.description);
      formdata.append("category", newProduct.category);
      formdata.append("price", newProduct.price);
      formdata.append("quantity", newProduct.quantity);
      formdata.append("unit", newProduct.unit ? newProduct.unit : "grams (g)");
      formdata.append("image", newProduct.image);
      const adminToken = localStorage.getItem("adminToken");
      let { data } = await axios.post(
        `${apiUrl}/admin/grocerry/create-product`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (data.success) {
        fetchProducts();
        toast.dismiss();
        toast.success("Grocery Product Added");
      }
      setNewProduct({
        name: "",
        price: "",
        quantity: "",
        unit: units[0],
        category: "",
        description: "",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Internel server error");
      console.log("error", error);
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    setProducts(
      products.map((p) => (p.id === editProduct.id ? editProduct : p))
    );
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id, file) => {
    try {
      let { data } = await axios.delete(
        `${apiUrl}/admin/grocerry/delete-grocery-products/${id}/${file}`
      );
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <Toaster />
      <div className="flex justify-between items-center pt-12">
        <h2 className="text-2xl font-bold">Grocery Management</h2>
        <button
          className="bg-pink-400 text-white px-5 py-2 rounded hover:bg-pink-500 transition-colors"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-5">
          <thead>
            <tr>
              <th className="bg-pink-400 text-white p-3 text-left">Name</th>
              <th className="bg-pink-400 text-white p-3 text-left">Image</th>
              <th className="bg-pink-400 text-white p-3 text-left">Price</th>
              <th className="bg-pink-400 text-white p-3 text-left">Category</th>
              <th className="bg-pink-400 text-white p-3 text-left">Quantity</th>
              <th className="bg-pink-400 text-white p-3 text-left">Units</th>
              <th className="bg-pink-400 text-white p-3 text-left">
                Description
              </th>
              <th className="bg-pink-400 text-white p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200">
                <td className="p-3">{product.title}</td>
                <td className="p-3">${product.price}</td>
                <td className="p-3">
                  <img
                    src={getMediaUrlPath(product.filePath)}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                </td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.quantity}</td>
                <td className="p-3">{product.unit}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3">
                  <button
                    className="bg-pink-400 text-white px-3 py-1 rounded mr-2 hover:bg-pink-500 transition-colors"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    onClick={() => handleDelete(product.id, product.filePath)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto pt-24 pb-24">
          <div className="bg-white p-6 rounded-lg w-96">
            <form onSubmit={handleAdd} className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Add New Product</h3>
              <div>
                <label className="block mb-1">Name:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Price:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="number"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Quantity:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="number"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Unit:</label>
                <select
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  value={newProduct?.unit}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, unit: e.target.value })
                  }
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Category:</label>
                <select
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  value={newProduct.category}
                  onChange={(e) => {
                    const selectedOption = e.target.selectedOptions[0];
                    setNewProduct({
                      ...newProduct,
                      category: selectedOption.value,
                      category_id: selectedOption.dataset.id,
                    });
                  }}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories &&
                    categories.map((val) => (
                      <option key={val.name} value={val.name} data-id={val.id}>
                        {val.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Category Image:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description:</label>
                <textarea
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto pt-24 pb-24">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Edit Product</h3>

              <div>
                <label className="block mb-1">Name:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="text"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">Price:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="number"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">Quantity:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="number"
                  value={editProduct.quantity}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, quantity: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">Unit:</label>
                <select
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, unit: e.target.value })
                  }
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Category:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="text"
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, category: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">Category Image:</label>
                <input
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.files[0] })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Description:</label>
                <textarea
                  className="w-full p-2 border rounded focus:outline-none focus:border-pink-400"
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-500 transition-colors"
                  onClick={handleUpdate}
                >
                  Update
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
