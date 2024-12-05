"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
 import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const PostDetailsPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const adminToken = localStorage.getItem("adminToken");
        const { data } = await axios.get(
          `${apiUrl}/admin/post/getSinglePost/${slug}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        if (data.success) {
          setPost(data.post);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostDetails();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Post not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 pt-20">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        ← Back to Posts
      </button>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {post.filePath.map((filePath, index) => (
            <img
              key={index} // Use index as key (consider using a unique identifier if available)
              src={getMediaUrlPath(filePath)}
              alt={post.title}
              className="mb-6 h-[400px] w-full rounded-lg object-cover"
            />
          ))}
        </div>

        <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>

        <div className="mb-6">
          <span className="text-sm text-gray-500">
            Posted on {new Date(post.date_created_in).toLocaleDateString()}
          </span>
        </div>

        <div>
          <p className="text-gray-700">{post.description}</p>

          {post.content && (
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="mt-6 whitespace-pre-wrap text-gray-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
