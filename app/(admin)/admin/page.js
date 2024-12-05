"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import { apiUrl } from "@/lib/apiUrl";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Processing");
      let { data } = await axios.post(`${apiUrl}/admin/signin`, {
        email,
        password,
      });
      if (data.message === "confirmEmail") {
        toast.dismiss();
        toast("Verify it's you! Please check your email.");
      } else if (data.message === "successLogin") {
        toast.dismiss();
        toast.success("You are logged in.");
        localStorage.setItem("adminToken", data.token);
        router.push("/dashboard/home");
      } else if (data.message === "Wrong Credentials!") {
        toast.dismiss();
        toast.error("Wrong Credentials!");
      }
    } catch (error) {
      toast.error("Internal server error.");
      // toast.dismiss();
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #fbc2eb, #f9e5bc, #ffffff);",
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div>
            <h2
              style={{
                marginTop: "16px",
                textAlign: "center",
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1f2937",
              }}
            >
              Admin Login
            </h2>
            <p
              style={{
                marginTop: "8px",
                textAlign: "center",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Enter your credentials to access the admin panel
            </p>
          </div>
          <form style={{ marginTop: "24px" }} onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="email-address" style={{ display: "none" }}>
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "12px",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                  size={20}
                />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 10px 10px 40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1f2937",
                  }}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" style={{ display: "none" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "12px",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                  size={20}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 10px 10px 40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#1f2937",
                  }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#d6336c", // Dark pink
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#b82d5b")
                } // Slightly darker pink on hover
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#d6336c")
                } // Reset to dark pink
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
