"use client";
import React, { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../../layout";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const Gallery = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const { setglobalState } = useContext(GlobalStateContext);
  const [showButton, setShowButton] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();
 
  useEffect(() => {
    getGallery();
  }, []);

  useEffect(() => {
    // Check navigation source from sessionStorage
    const navigationSource = sessionStorage.getItem("navigationSource");
    setShowButton(navigationSource === "create-post");
    // Optional: Clear the navigation source after checking
    // This ensures the button won't show up if user manually navigates to the page later
    sessionStorage.removeItem("navigationSource");
  }, []);

  // Get all media
  const getGallery = async () => {
    try {
      let adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`${apiUrl}/admin/post/getGallery`, {
        method: "GET",
        headers: { Authorization: "Bearer " + adminToken },
      });
      if (response.ok) {
        const data = await response.json();
        setMediaFiles(data.rows);
        // window.location.href = "/dashboard/create-post"; // Navigate to create post
      } else {
        console.error("Upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // delete single media
  const deleteSingleMedia = async (fileId, filePath, usedInArticle) => {
    try {
      let adminToken = localStorage.getItem("adminToken");
      const response = await fetch(
        `${apiUrl}/admin/post/deleteSingleMedia/${fileId}/${filePath}/${usedInArticle}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + adminToken },
        }
      );

      if (response.ok) {
        getGallery();
        // window.location.href = "/dashboard/create-post"; // Navigate to create post
      } else {
        console.error("Upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Handle file drop in drag-and-drop area
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setMediaFiles((prev) => [...prev, ...files]);
  };

  // Handle drag over effect
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  // Handle drag leave effect
  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Handle file upload from input
  const handleFileUpload = async (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);
      const formData = new FormData();
      filesArray.forEach((file) => {
        formData.append("files", file); // 'images' should match the field name used in multer
      });

      try {
        let adminToken = localStorage.getItem("adminToken");
        const response = await fetch(`${apiUrl}/admin/post/upload`, {
          method: "POST",
          body: formData,
          headers: { Authorization: "Bearer " + adminToken },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message); // Handle success response
          getGallery();
          // window.location.href = "/dashboard/create-post"; // Navigate to create post
        } else {
          console.error("Upload failed.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      return;
    }
  };

  // Handle media selection
  const handleSelectMedia = (file) => {
    setSelectedMedia((prev) => {
      if (prev.includes(file)) {
        return prev.filter((item) => item !== file);
      }
      return [...prev, file];
    });
  };

  // Handle media removal
  const handleRemoveMedia = async (fileId, filePath, usedInArticle) => {
    await deleteSingleMedia(fileId, filePath, usedInArticle);
  };

  const handleSaveSelection = async () => {
    setglobalState({ mediaItems: selectedMedia });
    let oldRoute = localStorage.getItem("oldRoute");
    router.push(`${oldRoute}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 pt-20">
      <h1 className="mb-5 text-center text-2xl font-bold text-pink-400">
        Manage Media Gallery
      </h1>

      {/* Drag-and-drop area */}
      <div
        className={`mb-5 rounded-lg border-2 border-dashed p-10 text-center transition ${
          dragOver ? "border-blue-500 bg-blue-100" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p className="mb-3 text-gray-500">Drag & drop files here or</p>
        <label
          htmlFor="file-upload"
          className="cursor-pointer rounded bg-pink-500 px-4 py-2 text-white"
        >
          Browse Files
        </label>
        <input
          id="file-upload"
          type="file"
          name="files"
          multiple
          accept="image/*,video/*" // This allows all file types
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Display uploaded media */}

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mediaFiles &&
          mediaFiles.map((file, index) => (
            <div
              key={index}
              className={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                selectedMedia.includes(file)
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              onClick={() => handleSelectMedia(file)}
            >
              {true ? (
                <img
                  src={getMediaUrlPath(file.filePath)}
                  alt="Uploaded"
                  className="h-40 w-full border-2 object-cover"
                />
              ) : (
                <video controls className="h-40 w-full border-2 object-cover">
                  <source
                    src={getMediaUrlPath(file.filePath)}
                    type={file.type}
                  />
                </video>
              )}
              {/* Selected indicator */}
              {showButton && selectedMedia.includes(file) && (
                <span className="absolute right-2 top-2 rounded-full bg-blue-500 p-1 px-3 text-white">
                  ✔
                </span>
              )}
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from selecting the file
                  handleRemoveMedia(file.id, file.filePath, file.usedInArticle);
                }}
                className="absolute bottom-2 right-2 rounded-full border bg-black p-2 text-white opacity-60 transition hover:opacity-90"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Cross-2--Streamline-Radix"
                  height="16"
                  width="16"
                >
                  <desc>Cross 2 Streamline Icon: https://streamlinehq.com</desc>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.567039999999999 4.300341333333334c0.23957333333333333 -0.23951999999999998 0.23957333333333333 -0.6278613333333334 0 -0.8673813333333332 -0.23946666666666666 -0.23951999999999998 -0.62784 -0.23951999999999998 -0.8673066666666667 0L8.000053333333334 7.132608 4.300416 3.43296c-0.23953066666666667 -0.23951999999999998 -0.627872 -0.23951999999999998 -0.867392 0 -0.23951999999999998 0.23951999999999998 -0.23951999999999998 0.6278613333333334 0 0.8673813333333332l3.699648 3.699648 -3.699648 3.6996373333333334c-0.23951999999999998 0.23957333333333333 -0.23951999999999998 0.62784 0 0.8674133333333334 0.23951999999999998 0.23946666666666666 0.6278613333333334 0.23946666666666666 0.867392 0l3.6996373333333334 -3.6996693333333335 3.69968 3.6996693333333335c0.23946666666666666 0.23946666666666666 0.62784 0.23946666666666666 0.8673066666666667 0 0.23957333333333333 -0.23957333333333333 0.23957333333333333 -0.62784 0 -0.8674133333333334L8.867434666666666 7.999989333333334l3.699605333333333 -3.699648Z"
                    fill="#ffffff"
                    stroke-width="1"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
      </div>

      {/* Save selection button */}
      {showButton && selectedMedia.length > 0 && (
        <button
          onClick={handleSaveSelection}
          className="w-full rounded bg-blue-500 py-2 text-white transition hover:bg-blue-600"
        >
          Save and Continue
        </button>
      )}
    </div>
  );
};

export default Gallery;
