"use client";
export const dynamic = "force-dynamic";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import dynamicc from "next/dynamic";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { GlobalStateContext } from "@/app/(admin)/layout";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import { isMediaType } from "@/lib/checkMediaTypes";

// Dynamically import the Editor component with SSR disabled
const Editor = dynamicc(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

const EditPostPage = () => {
  const params = useParams();
  const router = useRouter();
  let pathName = usePathname();
  const slug = params.slug;
  let { globalState, setglobalState } = useContext(GlobalStateContext);
  console.log("globalState", globalState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [ReadTime, setReadTime] = useState(0);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    twitterTitle: "",
    twitterDescription: "",
    structuredData: "",
  });

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setMounted(true);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const adminToken = localStorage.getItem("adminToken");
        const response = await fetch(
          `${apiUrl}/admin/post/getSinglePost/${slug}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        const data = await response.json();

        if (data.success) {
          const post = data.post;
          setTitle(post.title);
          setDescription(post.description);
          setKeywords(post.keywords || "");
          setAuthor(post.author || "");
          setReadTime(post.ReadTime || 0);

          // Set media items in global state
          if (post.filePath && globalState.mediaItems.length === 0) {
            const mediaItems = post.filePath.map((path, index) => ({
              id: post.fileIds ? JSON.parse(post.fileIds)[index] : index,
              filePath: path,
            }));
            setglobalState({
              ...globalState,
              mediaItems: mediaItems,
            });
          }

          // Convert HTML content to EditorState
          if (post.content) {
            const blocksFromHTML = convertFromHTML(post.content);
            const contentState = ContentState.createFromBlockArray(
              blocksFromHTML.contentBlocks,
              blocksFromHTML.entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Error loading post");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const handleRemoveMedia = (id) => {
    setglobalState({
      ...globalState,
      mediaItems: globalState.mediaItems.filter((val) => val.id !== id),
    });
  };

  const onEditorStateChange = useCallback(
    (newEditorState) => {
      if (mounted) {
        setEditorState(newEditorState);
      }
    },
    [mounted]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Updating post...");

    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      toast.dismiss();
      toast.error("Please Write Content!");
      return;
    }

    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const updateData = {
      title,
      description,
      keywords,
      author,
      ReadTime,
      filePath: globalState.mediaItems.map((val) => val.filePath),
      fileIds: globalState.mediaItems.map((val) => val.id),
      content,
    };

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${apiUrl}/admin/post/updatePost/${slug}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: {
          Authorization: "Bearer " + adminToken,
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (responseData?.error?.includes("Duplicate entry")) {
        toast.dismiss();
        toast.error("Please use a unique Post title");
        return;
      }

      toast.dismiss();
      toast.success("Post Updated Successfully");
      router.push("/dashboard/posts");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update post");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-10 mx-auto bg-gray-100 rounded-lg shadow-lg pt-25">
      <Toaster />
      <h2 className="font-bold mb-10 text-blue-500 text-center underline underline-offset-4">
        Edit Post
      </h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Title */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className={`w-full p-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="description"
          >
            Meta Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description"
            className={`w-full p-2 border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
            required
          />
        </div>

        {/* Keywords */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="keywords"
          >
            Focus Keywords
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter post keywords"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="author"
          >
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author's name"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Read Time */}
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            htmlFor="time"
          >
            Estimated Read Time (In Mins)
          </label>
          <input
            id="time"
            type="number"
            value={ReadTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="Enter Estimated Read Time"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* File Upload */}
        <div className="mt-6">
          <p className="text-gray-700 font-semibold text-lg mb-2">
            Choose media from gallery
          </p>
          <Link
            href="/dashboard/gallery"
            onClick={() => localStorage.setItem("oldRoute", pathName)}
            className="inline-block bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Gallery
          </Link>
        </div>

        {/* Display selected media */}
        {globalState &&
        globalState.mediaItems &&
        globalState.mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            {globalState.mediaItems.map((mediaUrl, index) => (
              <div
                key={index}
                className="relative border-2 rounded-lg overflow-hidden"
              >
                {isMediaType.video(mediaUrl) ? (
                  <video controls className="w-full h-40 object-cover">
                    <source src={mediaUrl.filePath} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={getMediaUrlPath(mediaUrl.filePath)}
                    alt={`Selected media ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(mediaUrl.id)}
                  className="absolute bottom-2 p-2 opacity-60 hover:opacity-90 right-2 bg-black text-white rounded-full border transition"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="16"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.567039999999999 4.300341333333334c0.23957333333333333 -0.23951999999999998 0.23957333333333333 -0.6278613333333334 0 -0.8673813333333332 -0.23946666666666666 -0.23951999999999998 -0.62784 -0.23951999999999998 -0.8673066666666667 0L8.000053333333334 7.132608 4.300416 3.43296c-0.23953066666666667 -0.23951999999999998 -0.627872 -0.23951999999999998 -0.867392 0 -0.23951999999999998 0.23951999999999998 -0.23951999999999998 0.6278613333333334 0 0.8673813333333332l3.699648 3.699648 -3.699648 3.6996373333333334c-0.23951999999999998 0.23957333333333333 -0.23951999999999998 0.62784 0 0.8674133333333334 0.23951999999999998 0.23946666666666666 0.6278613333333334 0.23946666666666666 0.867392 0l3.6996373333333334 -3.6996693333333335 3.69968 3.6996693333333335c0.23946666666666666 0.23946666666666666 0.62784 0.23946666666666666 0.8673066666666667 0 0.23957333333333333 -0.23957333333333333 0.23957333333333333 -0.62784 0 -0.8674133333333334L8.867434666666666 7.999989333333334l3.699605333333333 -3.699648Z"
                      fill="#ffffff"
                      strokeWidth="1"
                    ></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-5">
            No media selected. Please select from the gallery.
          </p>
        )}

        {/* Content Editor */}
        {mounted && (
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">
              Content
            </label>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              editorStyle={{
                height: 300,
                borderRadius: 0,
                border: "1px solid black",
              }}
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "fontSize",
                  "list",
                  "textAlign",
                  "colorPicker",
                  "link",
                  "embedded",
                  "emoji",
                  "image",
                  "remove",
                  "history",
                ],
                inline: {
                  inDropdown: false,
                  options: ["bold", "italic", "underline", "strikethrough"],
                },
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
