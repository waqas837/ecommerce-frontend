import { apiUrl } from "./apiUrl";

export const getMediaUrlPath = (path) => {
  return `${apiUrl}/images/${path}`;
};
