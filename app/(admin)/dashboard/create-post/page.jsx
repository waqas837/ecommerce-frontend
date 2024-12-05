"use client";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { GlobalStateContext } from "../../layout";
 import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { appendPostToSitemap } from "@/lib/update-sitemap";
import slugify from "slugify";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import { isMediaType } from "@/lib/checkMediaTypes";
 // Dynamically import the Editor component with SSR disabled
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [ReadTime, setReadTime] = useState(0);
  const [postType, setPostType] = useState("instant");
  const [scheduleDate, setScheduleDate] = useState("");
  const [articleContent, setArticleContent] = useState(""); // To hold the article text
  const [keywordDensity, setKeywordDensity] = useState({}); // To hold keyword density results
  const router = useRouter();
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
  let { globalState, setglobalState } = useContext(GlobalStateContext);
  let pathName = usePathname();
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
    if (title && description && articleContent) {
      calculateKeywordDensity();
    }
  }, [title, description, articleContent]);
  const calculateKeywordDensity = () => {
    // Normalize text by converting to lowercase and removing punctuation
    const normalizeText = (text) =>
      text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");

    // Get words from title and description
    const titleWords = normalizeText(title).split(" ");
    const descriptionWords = normalizeText(description).split(" ");

    // Combine and find common words
    const commonWords = titleWords.filter((word) =>
      descriptionWords.includes(word)
    );

    // Create a frequency map for the article content
    const wordsInArticle = normalizeText(articleContent).split(" ");
    const wordCount = wordsInArticle.length;
    const frequencyMap = {};

    commonWords.forEach((word) => {
      frequencyMap[word] = 0; // Initialize count for each common word
    });

    wordsInArticle.forEach((word) => {
      if (frequencyMap[word] !== undefined) {
        frequencyMap[word]++; // Increment count if the word is in common words
      }
    });

    // Calculate density and update state
    const densityMap = {};
    for (const word in frequencyMap) {
      densityMap[word] = ((frequencyMap[word] / wordCount) * 100).toFixed(2); // Percentage
    }

    setKeywordDensity(densityMap);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    let token = localStorage.getItem("adminToken");
    try {
      const { data } = await axios.get(
        `${apiUrl}/admin/post/fetchAllCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openPreviewModal = () => {
    setShowPreviewModal(true);
  };

  // Handle media removal
  const handleRemoveMedia = (id) => {
    setglobalState({
      mediaItems: globalState.mediaItems.filter((val) => {
        return val.id !== id;
      }),
    });
  };

  const onEditorStateChange = useCallback(
    (newEditorState) => {
      if (mounted) {
        setEditorState(newEditorState);
        const content = newEditorState.getCurrentContent().getPlainText();
        setArticleContent(content); // Update the article content state
      }
    },
    [mounted]
  );
  const submitPost = async (e) => {
    e.preventDefault();
    toast.loading("Post creating...");
    // Prevent default form submission behavior
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      toast.dismiss();
      toast.error("Please Write Content!");
      // Proceed with form submission
      return;
    }
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const newPostData = {
      title,
      description,
      keywords,
      author,
      ReadTime,
      filePath: globalState.mediaItems.map((val) => val.filePath),
      fileIds: globalState.mediaItems.map((val) => val.id),
      content,
      category,
      postType,
      scheduleDate,
    };
    let slug = slugify(title, { lower: true, strict: true });
    let date_created_in = new Date().toISOString();
    await appendPostToSitemap({
      slug,
      title,
      content,
      date_created_in,
    });
    try {
      let adminToken = localStorage.getItem("adminToken");
      // function to create a post
      let response = await fetch(`${apiUrl}/admin/post/create-post`, {
        method: "POST",
        body: JSON.stringify(newPostData),
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
      toast.success("Post Created");
      router.push("/dashboard/posts");
    } catch (error) {
      toast.dismiss();
      toast.error("Post failed to create");
      console.error("Error:", error);
    }
  };

  const gotoGallery = () => {
    sessionStorage.setItem("navigationSource", "create-post");
    router.push("/dashboard/gallery");
  };

  return (
    <div className="mx-auto rounded-lg bg-gray-100 p-10 pt-25 shadow-lg">
      <Toaster />
      <h2 className="mb-10 text-center font-bold text-pink-500 underline underline-offset-4">
        Create a New Post
      </h2>
      <form
        onSubmit={submitPost}
        encType="multipart/form-data"
        className="mx-auto max-w-4xl space-y-8 p-6"
      >
        {/* File Upload */}
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <p className="text-lg font-medium text-gray-700">
            Select Media/Images for Article.
          </p>
          <button
            type="button"
            onClick={() => gotoGallery()}
            className="inline-block rounded-lg bg-pink-500 px-4 py-2 font-medium text-white transition hover:bg-pink-600"
          >
            Go to Gallery
          </button>
        </div>
        {/* Display selected media */}
        {globalState && globalState.mediaItems.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {globalState.mediaItems.map((mediaUrl, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border-2"
              >
                {isMediaType.video(mediaUrl) ? (
                  <video controls className="h-40 w-full object-cover">
                    <source src={mediaUrl.filePath} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={getMediaUrlPath(mediaUrl.filePath)}
                    alt={`Selected media ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(mediaUrl.id)}
                  className="absolute right-2 top-2 rounded-full bg-black p-1.5 text-white opacity-60 transition hover:opacity-90"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M12.57 4.3a.61.61 0 0 0 0-.87.61.61 0 0 0-.87 0L8 7.13 4.3 3.43a.61.61 0 0 0-.87 0 .61.61 0 0 0 0 .87L7.13 8l-3.7 3.7a.61.61 0 0 0 0 .87.61.61 0 0 0 .87 0L8 8.87l3.7 3.7a.61.61 0 0 0 .87 0 .61.61 0 0 0 0-.87L8.87 8l3.7-3.7z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-center text-gray-500">
            No media selected. Please select from the gallery.
          </p>
        )}

        {/* Title */}
        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm font-medium text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className={`w-full rounded-lg border p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label
            className="text-sm font-medium text-gray-700"
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
            className={`w-full rounded-lg border p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1">
          <label
            className="text-sm font-medium text-gray-700"
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
            className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>
        {/* Category Select Box */}
        <div className="space-y-1">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            value={category} // Make sure to have a state variable named `category`
            onChange={(e) => setCategory(e.target.value)} // Use setCategory to update state
            className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {" "}
                {/* Use a unique key */}
                {cat.name}{" "}
                {/* Assuming the category object has a `name` property */}
              </option>
            ))}
          </select>
        </div>
        {/* Author */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author's name"
            className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>

        {/* Read Time */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="time">
            Estimated Read Time (In Mins)
          </label>
          <input
            id="time"
            type="number"
            value={ReadTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="Enter Estimated Read Time"
            className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            required
          />
        </div>

        {/* Content Editor */}
        {mounted && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <Editor
              editorState={editorState}
              onEditorStateChange={onEditorStateChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              editorStyle={{
                height: 300,
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "0.75rem",
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

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Keyword Density:
          </h3>
          <ul className="space-y-1">
            {Object.entries(keywordDensity).map(([word, density]) => (
              <li
                key={word}
                className="flex justify-between p-2 bg-gray-100 rounded-md"
              >
                <span className="text-gray-700">{word}</span>
                <span
                  className={`text-gray-600 ${
                    density > 2 ? "text-red-600" : ""
                  }`}
                >
                  {density}%
                </span>
              </li>
            ))}
          </ul>
          {Object.values(keywordDensity).some((density) => density > 2) && (
            <p className="text-red-600 mt-2">
              {Object.entries(keywordDensity).some(([, density]) => density > 2)
                ? "Too Much"
                : "Good"}
            </p>
          )}
        </div>

        {/* Post Type Selection */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Post Type
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            >
              <option value="instant">Instant Post</option>
              <option value="draft">Save as Draft</option>
              <option value="schedule">Schedule Post</option>
            </select>
          </div>

          {postType === "schedule" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Schedule Date and Time
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 shadow-sm transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={openPreviewModal}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition duration-200 hover:bg-green-600"
        >
          <span>Preview</span>
        </button>
        {/* Submit Button */}
        <button
          type="submit"
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
          <span>
            {postType === "draft"
              ? "Save as Draft"
              : postType === "schedule"
              ? "Schedule Post"
              : "Publish Now"}
          </span>
        </button>
      </form>
      {showPreviewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPreviewModal(false)}
          />

          <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 my-6 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Preview Your Post
              </h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Preview Tabs */}
            <div className="flex gap-4 px-6 py-3 border-b bg-white">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Google Search
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Social Media
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Search Result Preview */}
              <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <span className="text-xs text-gray-600 font-medium">
                    Google Search Result
                  </span>
                </div>

                <div className="text-sm text-emerald-700">
                  www.yourdomain.com › blog ›{" "}
                  {title.toLowerCase().replace(/\s+/g, "-")}
                </div>

                <h4 className="text-xl text-blue-600 hover:underline cursor-pointer">
                  {title}
                </h4>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {description}
                </p>
              </div>

              {/* Social Media Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <span className="text-xs text-gray-600 font-medium">
                      Social Media Card
                    </span>
                  </div>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      /* Toggle media selection */
                    }}
                  >
                    Change Image
                  </button>
                </div>

                {/* Social Card */}
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  {/* Featured Image Area */}
                  <div className="relative aspect-[1200/630] bg-gray-100">
                    {globalState && globalState.mediaItems.length > 0 ? (
                      <div className="absolute inset-0">
                        {globalState.mediaItems.map((mediaUrl, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-200
                                                                   'opacity-100' }`}
                          >
                            {isMediaType.video(mediaUrl) ? (
                              <video
                                className="h-full w-full object-cover"
                                controls={false}
                                autoPlay
                                muted
                                loop
                              >
                                <source
                                  src={mediaUrl.filePath}
                                  type="video/mp4"
                                />
                              </video>
                            ) : (
                              <img
                                src={getMediaUrlPath(mediaUrl.filePath)}
                                alt={`Preview ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-8 h-8 mx-auto mb-2 text-gray-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                            />
                          </svg>
                          <p className="text-sm text-gray-500">Add media</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                      <span className="text-xs text-gray-600">
                        yourdomain.com
                      </span>
                    </div>

                    <h4 className="font-bold text-gray-800 mb-2 text-lg">
                      {title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {description}
                    </p>

                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>1.2K Likes</span>
                      <span>234 Comments</span>
                      <span>89 Shares</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Recommended image size: 1200 x 630 pixels
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
