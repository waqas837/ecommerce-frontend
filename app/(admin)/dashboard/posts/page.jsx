"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import axios from "axios";
import { Trash, Edit2 } from "lucide-react";
 import Link from "next/link";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter(); // Initialize the router
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [categoryar, setCategoryar] = useState([]);
  const [statusar, setStatusar] = useState([]);
  const [authorar, setAuthorar] = useState([]);
  const [datear, setDatear] = useState([]);

  // Function to fetch posts from the backend
  const fetchPosts = async (filter, filterType) => {
    try {
      let adminToken = localStorage.getItem("adminToken");
      let type = "instant";
      const { data } = await axios.get(
        `${apiUrl}/admin/post/getAllposts/${type}?filterType=${filterType}&filter=${filter}`,
        { headers: { Authorization: "Bearer " + adminToken } }
      ); // Adjust the URL based on your API
      console.log("data", data);
      if (data.success) {
        setPosts(data.rows);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Function to delete a post
  const handleDelete = async (slug) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.delete(`${apiUrl}/admin/post/delete-post/${slug}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      }); // Adjust the URL based on your API
      setPosts(posts.filter((post) => post.slug !== slug)); // Remove the deleted post from state
    } catch (error) {
      console.error(`Error deleting post with slug ${slug}:`, error);
    }
  };

  // Function to navigate to the edit page
  const handleEdit = (slug) => {
    router.push(`/dashboard/edit-post/${slug}`); // Navigate to the edit page (adjust the path as needed)
  };
  const categoriesFilter = async (e) => {
    setCategory(e.target.value);
    await fetchPosts(e.target.value, "category");
  };
  const statusFilter = async (e) => {
    setStatus(e.target.value);
    await fetchPosts(e.target.value, "status");
  };
  const authorFilter = async (e) => {
    setAuthor(e.target.value);
    await fetchPosts(e.target.value, "author");
  };
  const dateFilter = async (e) => {
    setDate(e.target.value);
    await fetchPosts(e.target.value, "date");
  };

  const fetchCatsAuthorsDates = async () => {
    try {
      let adminToken = localStorage.getItem("adminToken");
      let type = "instant";
      const { data } = await axios.get(
        `${apiUrl}/admin/post/getCatsAuthorsAndDates`,
        { headers: { Authorization: "Bearer " + adminToken } }
      ); // Adjust the URL based on your API

      if (data.success) {
        console.log("categories", data.categories);
        setCategoryar(data.categories);
        console.log("authors", data.authors);
        setAuthorar(data.authors);
        setDatear(data.dates);
        console.log("dates", data.dates);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchCatsAuthorsDates();
      await fetchPosts(null, "all");
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6 pt-20">
      <h1 className="mb-6 text-center text-3xl font-bold">Blog Posts</h1>
      <div className="my-5">
        <div className="filters space-x-3">
          <select onChange={(e) => categoriesFilter(e)} value={category}>
            <option value="">Categories</option>
            {categoryar &&
              categoryar.map((val) => (
                <option value={val.name}>{val.name}</option>
              ))}
            {/* Add more categories as needed */}
          </select>

          <select onChange={(e) => statusFilter(e)} value={status}>
            <option value="">Status</option>
            <option value="instant">Published</option>
            <option value="draft">Draft</option>
            {/* Add more statuses as needed */}
          </select>

          <select onChange={(e) => authorFilter(e)} value={author}>
            <option value="">Authors</option>
            {authorar &&
              authorar.map((val) => (
                <option value={val.name}>{val.name}</option>
              ))}
            {/* Add more authors as needed */}
          </select>

          <input type="date" onChange={(e) => dateFilter(e)} value={date} />
        </div>
      </div>
      {posts?.length === 0 && (
        <div className="m-auto mt-30 flex items-center justify-center space-x-3 text-center">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
            id="New-Folder--Streamline-Flex"
            height="14"
            width="14"
          >
            <desc>New Folder Streamline Icon: https://streamlinehq.com</desc>
            <g id="new-folder--empty-folder">
              <path
                id="Subtract"
                fill="#d7e0ff"
                d="M6.3308 1.68814c-0.13828 -0.3734 -0.4849 -0.63009 -0.88267 -0.64819C4.01145 0.974562 3.14465 0.992082 1.9919 1.07324c-0.48162 0.03391 -0.86456 0.41351 -0.91967 0.89316C0.73486 4.90279 0.622932 7.84939 0.974376 10.7925c0.119254 0.9987 0.937034 1.7246 1.915354 1.8311 2.76247 0.3008 5.48523 0.2931 8.24757 -0.0076 0.9599 -0.1045 1.7305 -0.8647 1.845 -1.8235 0.2172 -1.81895 0.2751 -3.68351 0.1399 -5.97063 -0.056 -0.94753 -0.799 -1.71004 -1.745 -1.78836 -1.3445 -0.1113 -2.27895 -0.11768 -3.93138 -0.15264 -0.40948 -0.00867 -0.77231 -0.26734 -0.91455 -0.65142l-0.20047 -0.54131Z"
                stroke-width="1"
              ></path>
              <path
                id="Subtract_2"
                stroke="#4147d5"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.33085 1.68814c-0.13829 -0.3734 -0.4849 -0.63009 -0.88267 -0.64819C4.01149 0.974562 3.1447 0.992082 1.99195 1.07324c-0.48162 0.03391 -0.86456 0.41351 -0.91967 0.89316C0.734905 4.90279 0.622978 7.84939 0.974421 10.7925c0.119259 0.9987 0.937029 1.7246 1.915349 1.8311 2.76248 0.3008 5.48524 0.2931 8.24753 -0.0076 0.96 -0.1045 1.7306 -0.8647 1.8451 -1.8235 0.2172 -1.81895 0.2751 -3.68351 0.1399 -5.97063 -0.0561 -0.94753 -0.7991 -1.71004 -1.745 -1.78836 -1.3445 -0.1113 -2.279 -0.11768 -3.93143 -0.15264 -0.40948 -0.00867 -0.77232 -0.26734 -0.91456 -0.65142l-0.20046 -0.54131Z"
                stroke-width="1"
              ></path>
            </g>
          </svg>
          <span>No Posts yet.</span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts &&
          posts.map((post) => (
            <div
              key={post.id}
              className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-shadow duration-200 hover:shadow-lg"
            >
              <Link href={`/dashboard/${post.slug}`}>
                <img
                  // src={getMediaUrlPath(post.filePath[0])}
                  src={
                    post.filePath?.length > 0
                      ? getMediaUrlPath(post.filePath[0])
                      : "/default-image.jpg"
                  }
                  alt={post.title}
                  className="mb-4 h-40 w-full rounded-md object-cover"
                />
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                <p className="mb-4 text-gray-700">{post.description}</p>
                <span className="text-sm text-gray-500">
                  {new Date(post.date_created_in).toLocaleDateString()}
                </span>
              </Link>

              {/* Action buttons */}
              <div className="absolute right-2 top-2 flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="flex items-center justify-center rounded-full bg-gray-200 p-2 transition-colors duration-200 hover:bg-red-500"
                >
                  <Trash size={20} className="text-gray-600 hover:text-white" />
                </button>
                <button
                  onClick={() => handleEdit(post.slug)} // Call handleEdit function
                  className="flex items-center justify-center rounded-full bg-gray-200 p-2 transition-colors duration-200 hover:bg-blue-500"
                >
                  <Edit2 size={20} className="text-gray-600 hover:text-white" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Posts;
