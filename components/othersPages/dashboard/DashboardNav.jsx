"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const accountLinks = [
  { href: "/dashboard/my-account", label: "Dashboard" },
  { href: "/dashboard/my-account-orders", label: "Orders" },
  { href: "/dashboard/my-account-address", label: "Addresses" },
  { href: "/dashboard/my-account-edit", label: "Account Details" },
  { href: "/dashboard/my-account-wishlist", label: "Wishlist" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const logoutCustomer = () => {
    localStorage.removeItem("userToken");
    window.location.href = "/";
  };
  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={`my-account-nav-item ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <button onClick={logoutCustomer} className="my-account-nav-item">
          Logout
        </button>
      </li>
    </ul>
  );
}
