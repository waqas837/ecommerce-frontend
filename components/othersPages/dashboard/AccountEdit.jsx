"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "@/lib/apiUrl";
import toast, { Toaster } from "react-hot-toast";

export default function AccountEdit() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Fetch user data on component mount
    const fetchData = async () => {
      const userToken = localStorage.getItem("userToken");
      try {
        const { data } = await axios.get(
          `${apiUrl}/customerAuth/get-customer-profile`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        setFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          email: data.data.email || "",
          currentPassword: "", // Leave blank for security reasons
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem("userToken");
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      const { data } = await axios.put(
        `${apiUrl}/customerAuth/update-customer-profile`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      console.log("DATA:", data);
      if (data.success) {
        toast.success("Data updated successfully");
      }
      console.log("DATA updated successfully:", data);
    } catch (error) {
      console.error("Error updating   data:", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="my-account-content account-edit">
        <form onSubmit={handleSubmit} className="" id="form-password-change">
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="property1"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property1"
            >
              First name
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="property2"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property2"
            >
              Last name
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="email"
              id="property3"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property3"
            >
              Email
            </label>
          </div>
          <h6 className="mb_20">Password Change</h6>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="property4"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property4"
            >
              Current password
            </label>
          </div>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="property5"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property5"
            >
              New password
            </label>
          </div>
          <div className="tf-field style-1 mb_30">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="password"
              id="property6"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <label
              className="tf-field-label fw-4 text_black-2"
              htmlFor="property6"
            >
              Confirm password
            </label>
          </div>
          <div className="mb_20">
            <button
              type="submit"
              className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
