"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleAddOrEditCategory = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", newCategory);
      if (image) formData.append("image", image);
      if (editMode) {
        await axios.put(
          `${apiUrl}/admin/grocerry/updateGroceryCategory/${selectedCategory.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          `${apiUrl}/admin/grocerry/addGroceryCategory`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding/editing category:", error);
    }
  };

  const handleDeleteCategory = async (id, file) => {
    let token = localStorage.getItem("adminToken");
    try {
      await axios.delete(
        `${apiUrl}/admin/grocerry/deleteGroceryCategory/${id}/${file}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const openModal = (category = null) => {
    setEditMode(!!category);
    setSelectedCategory(category);
    setNewCategory(category ? category.name : "");
    setImagePreview(category ? getMediaUrlPath(category.filePath) : null);
    setImage(null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Grocery Categories
            </h1>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded hover:bg-pink-700 transition-colors duration-150"
            >
              Add Category
            </button>
          </div>

          <div className="p-6">
            <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">#</th>
                  <th className="border border-gray-200 px-4 py-2">Image</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Category Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <img
                        src={getMediaUrlPath(category.filePath)}
                        alt={category.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {category.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 flex gap-2 justify-center">
                      <button
                        onClick={() => openModal(category)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCategory(category.id, category.filePath)
                        }
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {editMode ? "Edit Category" : "Add Category"}
            </h2>
            <form
              onSubmit={handleAddOrEditCategory}
              className="flex flex-col gap-6"
            >
              <input
                type="text"
                className="px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400 transition duration-200"
                placeholder="Category Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input text-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400 transition duration-200"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-36 h-36 object-cover rounded-lg mx-auto border border-gray-300"
                />
              )}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition duration-200"
                >
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
