/**
 * Global utility to check if a URL is a video or image
 */
export const isMediaType = {
  video: (url) => {
    if (!url || typeof url !== "string") return false;

    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.pathname.includes("video") ||
        parsedUrl.pathname.includes("watch") ||
        parsedUrl.href.includes("youtube") ||
        parsedUrl.href.includes("vimeo") ||
        /\.(mp4|webm|ogg|mov)(\?.*)?$/.test(parsedUrl.pathname)
      );
    } catch {
      return (
        url.includes("video") ||
        url.includes("watch") ||
        url.includes("youtube") ||
        url.includes("vimeo")
      );
    }
  },

  image: (url) => {
    if (!url || typeof url !== "string") return false;

    try {
      const parsedUrl = new URL(url);
      return (
        parsedUrl.pathname.includes("image") ||
        parsedUrl.pathname.includes("photo") ||
        /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/.test(parsedUrl.pathname)
      );
    } catch {
      return url.includes("image") || url.includes("photo");
    }
  },
};
