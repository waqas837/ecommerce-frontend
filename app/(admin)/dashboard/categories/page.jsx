"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/lib/apiUrl";
 

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        let token = localStorage.getItem("adminToken");
        try {
            const { data } = await axios.get(`${apiUrl}/admin/post/fetchAllCategories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            if (newCategory.trim()) {
                let token = localStorage.getItem("adminToken");
                const response = await axios.post(
                    `${apiUrl}/admin/post/addCategory`,
                    { name: newCategory },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCategories([...categories, response.data]);
                setNewCategory("");
                fetchCategories();
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleDeleteCategory = async (id) => {
        let token = localStorage.getItem("adminToken");
        try {
            await axios.delete(`${apiUrl}/admin/post/deleteSingleCateogry/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Categories
                        </h1>
                    </div>

                    <div className="p-6">
                        <form
                            className="flex gap-3 mb-6"
                            onSubmit={handleAddCategory}
                        >
                            <input
                                type="text"
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Add new category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                            />
                            <button
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors duration-150"
                            >
                                Add
                            </button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories && categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors duration-150"
                                >
                                    <span className="text-sm text-gray-700">
                                        {category.name}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="text-xs px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;