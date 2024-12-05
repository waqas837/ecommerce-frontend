"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import axios from "axios";
import { Trash, Edit2 } from "lucide-react";
 import Link from "next/link";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const PostTrash = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter(); // Initialize the router

  // Function to fetch posts from the backend
  const fetchPosts = async () => {
    try {
      let adminToken = localStorage.getItem("adminToken");
      const { data } = await axios.get(
        `${apiUrl}/admin/post/getAlldeletedPosts`,
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
      await axios.delete(`${apiUrl}/admin/post/delete-post-permenent/${slug}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      }); // Adjust the URL based on your API
      setPosts(posts.filter((post) => post.slug !== slug)); // Remove the deleted post from state
    } catch (error) {
      console.error(`Error deleting post with slug ${slug}:`, error);
    }
  };

  const handleRecover = async (slug) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.put(`${apiUrl}/admin/post/recover-post/${slug}`, null, {
        // Use null for the data parameter
        headers: { Authorization: `Bearer ${adminToken}` },
      }); // Adjust the URL based on your API
      setPosts(posts.filter((post) => post.slug !== slug)); // Remove the deleted post from state
    } catch (error) {
      console.error(`Error recovering post with slug ${slug}:`, error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when component mounts
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6 pt-20">
      <h1 className="mb-6 text-center text-3xl font-bold text-pink-400">Deleted Posts</h1>
      <div className="bg-red-100 text-red-800 rounded-full px-4 py-2 text-sm font-semibold mb-2">
        Note: Posts deleted from the trash will be permanently removed and
        cannot be recovered.
      </div>
      {posts.length === 0 && (
        <div className="flex justify-center items-center space-x-3 text-center mt-30 m-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            id="Bin--Streamline-Cyber"
            height="24"
            width="24"
          >
            <desc>Bin Streamline Icon: https://streamlinehq.com</desc>
            <path
              stroke="#092f63"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              d="M21 23.5h-5l-1.5 -7h8l-1.5 7Z"
              stroke-width="1"
            ></path>
            <path
              stroke="#092f63"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              d="M3.5 11.5v12L7 17l3.5 6.5v-12L16 9 7 7.5l-4.5 1 -2 6.5 3 -2.5"
              stroke-width="1"
            ></path>
            <path
              stroke="#092f63"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              d="M9.5 5 7 6.5 4.5 5V2L7 0.5 9.5 2v3Z"
              stroke-width="1"
            ></path>
            <path
              stroke="#092f63"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m17 11.995 0.505 0.505 -0.505 0.505"
              stroke-width="1"
            ></path>
            <path
              stroke="#092f63"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m17.0001 11.995 -0.505 0.505 0.505 0.505"
              stroke-width="1"
            ></path>
            <path
              stroke="#092f63"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m20.5 9.995 0.505 0.504 -0.505 0.505"
              stroke-width="1"
            ></path>
            <path
              stroke="#092f63"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m20.5001 9.995 -0.505 0.504 0.505 0.505"
              stroke-width="1"
            ></path>
          </svg>
          <span>Trash is empty.</span>
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
                  src={getMediaUrlPath(post.filePath[0])}
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
                  onClick={() => handleRecover(post.slug)} // Call hasdf
                  className="flex items-center justify-center rounded-full bg-gray-200 p-2 transition-colors duration-200 hover:bg-blue-500 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6 w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PostTrash;
