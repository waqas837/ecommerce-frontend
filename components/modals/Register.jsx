"use client";
import React, { useState } from "react";
import { apiUrl } from "@/lib/apiUrl";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Register() {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const signupUser = async (e) => {
    toast.loading("Processing!");
    e.preventDefault();
    // if (!recaptchaToken) {
    //   toast.dismiss();
    //   toast.error("Please complete the reCAPTCHA.");
    //   return;
    // }
    try {
      let resp = await axios.post(`${apiUrl}/customerAuth/signup`, {
        ...data,
        // recaptchaToken,
      });
      let userData = resp.data;
      if (userData.status === "userExists") {
        toast.dismiss();
        toast.error("This email is already registered!");
        return;
      }
      if (userData.status === "confirmEmail") {
        toast.dismiss();
        toast.success("Account created successfully.Please confirm you email!");
        return;
      }
      console.log("res", userData);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <>
      <Toaster />
      <div
        className="modal modalCentered fade form-sign-in modal-part-content"
        id="register"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="header">
              <div className="demo-title">Register</div>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="tf-login-form">
              <form onSubmit={signupUser} className="">
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    required
                    name="firstName"
                    value={data.firstName}
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                  />
                  <label className="tf-field-label" htmlFor="">
                    First name
                  </label>
                </div>
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="text"
                    required
                    name="lastName"
                    value={data.lastName}
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                  />
                  <label className="tf-field-label" htmlFor="">
                    Last name
                  </label>
                </div>
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="email"
                    autoComplete="abc@xyz.com"
                    required
                    name="email"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                  />
                  <label className="tf-field-label" htmlFor="">
                    Email *
                  </label>
                </div>
                <div className="tf-field style-1">
                  <input
                    className="tf-field-input tf-input"
                    placeholder=" "
                    type="password"
                    required
                    name="password"
                    value={data.password}
                    onChange={(e) =>
                      setData({ ...data, [e.target.name]: e.target.value })
                    }
                    autoComplete="current-password"
                  />
                  <label className="tf-field-label" htmlFor="">
                    Password *
                  </label>
                </div>
                <div className="bottom">
                  <div className="w-100">
                    <button
                      type="submit"
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    >
                      Register
                    </button>
                  </div>
                  <div className="w-100">
                    <a
                      href="#login"
                      data-bs-toggle="modal"
                      className="btn-link fw-6 w-100 link"
                    >
                      Already have an account? Log in here
                      <i className="icon icon-arrow1-top-left" />
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
