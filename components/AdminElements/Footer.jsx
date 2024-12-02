import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#1F2937", // Equivalent to Tailwind's bg-gray-800
        padding: "0.25rem 0", // Equivalent to py-1
        color: "#FFFFFF", // Equivalent to text-white
      }}
    >
      <div
        style={{
          maxWidth: "1200px", // Equivalent to container mx-auto
          margin: "0 auto",
          padding: "0 1rem", // Equivalent to px-4
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              margin: "0 auto",
              textAlign: "center",
              fontSize: "0.875rem", // Equivalent to text-sm
            }}
          >
            © {currentYear} MyAdmin Panel
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
