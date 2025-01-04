"use client";
import React, { useEffect, useState } from "react";

const UserAccountIcon = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    // alert(token)
    if (token) {
      const storedUsername = localStorage.getItem("customerName");
      setUsername(storedUsername);
    }
  }, []);

  return (
    <li className="nav-account">
      {username ? (
        <a href="/dashboard/my-account" className="nav-icon-item">
          {username}
        </a>
      ) : (
        <a href="#login" data-bs-toggle="modal" className="nav-icon-item">
          <i className="icon icon-account" />
        </a>
      )}
    </li>
  );
};

export default UserAccountIcon;
