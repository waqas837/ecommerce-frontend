"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Home,
  FileText,
  PlusCircle,
  Settings,
  Users,
  Database,
  BarChart,
  Bell,
} from "lucide-react";

const Navbar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const navRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define menu items based on role
  const menuItems =
    role === "superAdmin"
      ? [
          { name: "Dashboard", href: "/dashboard", icon: Home },
          { name: "Admin Management", href: "/admins", icon: Users },
          { name: "Analytics", href: "/analytics", icon: BarChart },
          { name: "System Logs", href: "/logs", icon: Database },
          { name: "Settings", href: "/settings", icon: Settings },
        ]
      : [
          { name: "Dashboard", href: "/dashboard", icon: Home },
          { name: "Posts", href: "/posts", icon: FileText },
          { name: "Create Post", href: "/create-post", icon: PlusCircle },
          { name: "Settings", href: "/settings", icon: Settings },
        ];

  const roleGradient =
    role === "superAdmin"
      ? "linear-gradient(to right, #9333EA, #4F46E5)" // Purple gradient for superAdmin
      : "linear-gradient(to right, #EC4899, #F472B6)"; // Pink gradient for regular admin (light pink to deeper pink)

  const hoverBackground =
    role === "superAdmin"
      ? "rgba(237, 233, 254, 1)" // Light purple hover for superAdmin
      : "rgba(252, 165, 165, 1)"; // Light pink hover for regular admin

  return (
    <nav
      style={{
        position: "fixed",
        zIndex: 10,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(10px)",
      }}
      ref={navRef}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4rem",
        }}
      >
        {/* Logo and Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              background: roleGradient,
            }}
          >
            <Shield
              style={{ height: "1.5rem", width: "1.5rem", color: "white" }}
            />
          </div>
          <span
            style={{
              background: roleGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.125rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {role === "superAdmin"
              ? "Executive Control Hub"
              : "Admin Dashboard"}
          </span>
        </div>

        {/* Desktop Menu */}
        <div style={{ display: "none" }} className="md:block">
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#4B5563",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "background-color 0.15s ease-in-out",
                  textDecoration: "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverBackground)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <item.icon style={{ height: "1rem", width: "1rem" }} />
                <span>{item.name}</span>
              </a>
            ))}
            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                style={{
                  padding: "0.5rem",
                  borderRadius: "50%",
                  color: "#4B5563",
                  backgroundColor: "transparent",
                  transition: "background-color 0.15s ease-in-out",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverBackground)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Bell style={{ height: "1.25rem", width: "1.25rem" }} />
                {notifications > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      transform: "translate(50%, -50%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "1.25rem",
                      width: "1.25rem",
                      borderRadius: "50%",
                      backgroundColor: "#EF4444",
                      color: "white",
                      fontSize: "0.75rem",
                    }}
                  >
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div
          style={{ display: "flex", alignItems: "center" }}
          className="md:hidden"
        >
          <button
            onClick={toggleMenu}
            style={{
              padding: "0.5rem",
              borderRadius: "0.375rem",
              color: "#9CA3AF",
              backgroundColor: "transparent",
              transition: "background-color 0.15s ease-in-out",
              border: "none",
            }}
          >
            {isOpen ? (
              <svg
                style={{ height: "1.5rem", width: "1.5rem" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                style={{ height: "1.5rem", width: "1.5rem" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          style={{
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              padding: "0.5rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#4B5563",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "background-color 0.15s ease-in-out",
                  textDecoration: "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverBackground)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                onClick={closeMenu}
              >
                <item.icon style={{ height: "1rem", width: "1rem" }} />
                <span>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
