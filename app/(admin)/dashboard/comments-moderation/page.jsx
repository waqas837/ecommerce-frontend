"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { apiUrl } from "@/lib/apiUrl";

const CommentsModeration = () => {
  const [commentsData, setCommentsData] = useState([]);

  const fetchComments = () => {
    const adminToken = localStorage.getItem("adminToken");
    axios
      .get(`${apiUrl}/admin/post/getComments`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })
      .then((response) => setCommentsData(response.data.commentsWithUsers))
      .catch((error) => console.error("Error fetching comments:", error));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Approve a comment
  const handleApprove = async (commentId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      let { data } = await axios.post(
        `${apiUrl}/admin/post/comments/approve/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (data.success) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  // Disapprove a comment
  const handleDisapprove = async (commentId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      let { data } = await axios.post(
        `${apiUrl}/admin/post/comments/disapprove/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (data.success) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error disapproving comment:", error);
    }
  };

  // deleteComment a comment
  const deleteComment = async (commentId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      let { data } = await axios.delete(
        `${apiUrl}/admin/post/comments/deletecomment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (data.success) {
        fetchComments(); // Refresh the comments after deletion
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="pt-20 p-5">
      <h2 className="text-center my-5 text-2xl font-semibold text-pink-500">
        Comments Moderation
      </h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b">Blog Title</th>
              <th className="py-3 px-6 border-b">Username</th>{" "}
              {/* New column for Username */}
              <th className="py-3 px-6 border-b">Comment</th>
              <th className="py-3 px-6 border-b">Status</th>
              <th className="py-3 px-6 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {commentsData.map((comment) => (
              <tr key={comment.commentid} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 border-b">
                  <Link
                    className="text-blue-500 underline"
                    target="_blank"
                    href={`/blog/${comment.blogslug}`}
                  >
                    {comment.blogTitle}
                  </Link>
                </td>
                <td className="py-3 px-6 border-b">{comment.username}</td>{" "}
                {/* Displaying the username */}
                <td className="py-3 px-6 border-b">{comment.comment}</td>
                <td className="py-3 px-6 border-b">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold ${
                      comment.approve === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {comment.approve === 0 ? "Unapproved" : "Approved"}
                  </span>
                </td>
                <td className="py-3 px-6 border-b flex gap-2">
                  {comment.approve === 0 ? (
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                      onClick={() => handleApprove(comment.commentid)}
                      disabled={comment.status === "approved"}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                      onClick={() => handleDisapprove(comment.commentid)}
                      disabled={comment.status === "disapproved"}
                    >
                      Disapprove
                    </button>
                  )}
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                    onClick={() => deleteComment(comment.commentid)}
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
  );
};

export default CommentsModeration;
