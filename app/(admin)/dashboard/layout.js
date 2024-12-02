"use client";
import Footer from "@/components/AdminElements/Footer";
import Navbar from "@/components/AdminElements/Nabar";
import Sidebar from "@/components/AdminElements/Sidebar";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  // useEffect(() => {
  //   let token = localStorage.getItem("adminToken");
  //   if (!token) {
  //     setisAuthenticated(false);
  //     redirect("/admin");
  //   } else {
  //     setisAuthenticated(true);
  //   }
  // }, []);

  // if (!isAuthenticated) {
  //   return <p>Unauthorized access is strict! Redirecting...</p>;
  // }
  return (
    <>
      <Navbar role={"admin"} />
      <Sidebar role={"admin"} />
      {children}
      <Footer />
    </>
  );
}
