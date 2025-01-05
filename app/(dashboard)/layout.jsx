"use client";
import { apiUrl } from "@/lib/apiUrl";
import axios from "axios";
import { useEffect, useState } from "react";
 

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        try {
          const { data } = await axios.get(
            `${apiUrl}/customerAuth/verifyToken`,
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );
          if (data.success) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md p-6 bg-white border border-black">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Access Restricted
          </h2>
          <p className="mt-4 text-gray-600 text-center">
            Please log in to access your customer portal.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/"
              className="px-4 py-2 text-white bg-black border shadow hover:bg-black focus:ring focus:ring-black-300"
            >
              Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div>{children}</div>
    </>
  );
}
