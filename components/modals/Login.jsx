"use client";
import { apiUrl } from "@/lib/apiUrl";
import axios from "axios";
// import { Modal } from "bootstrap";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const modalRef = useRef(null);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const signin = async (e) => {
    toast.loading("Processing!");
    e.preventDefault();
    try {
      let resp = await axios.post(`${apiUrl}/customerAuth/signin`, data);
      let userData = resp.data;
      // console.log("userData>>>>", userData.userDetails);
      if (userData.status === "userExists") {
        toast.dismiss();
        toast.success("You are LoggedIn!");
        // console.log("userData.token", userData.token)
        localStorage.setItem("userToken", userData.token); // Store token
        localStorage.setItem("customerName", userData.userDetails.username); // Store token
        localStorage.setItem("userid", userData.userDetails.id); // Store token
        // Close the modal programmatically
        router.push("/dashboard/my-account");
        // const modalElement = modalRef.current;
        // const bootstrapModal = Modal.getInstance(modalElement);
        // if (bootstrapModal) {
        //   bootstrapModal.hide();
        // }
      }
      if (userData.status === "emailNotConfirmed") {
        toast.dismiss();
        toast.success("Your are already registered.Please confirm you email!");
        return;
      }
      if (userData.status === "unauthorized") {
        toast.dismiss();
        toast.error("Please ensure correct email and password.");
        return;
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Internal server error!");
      console.log("Error", error);
    }
  };

  return (
    <div
      ref={modalRef}
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="login"
    >
      <Toaster />
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Log in</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form onSubmit={signin} className="" acceptCharset="utf-8">
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                  autoComplete="abc@xyz.com"
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
                  name="password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                />
                <label className="tf-field-label" htmlFor="">
                  Password *
                </label>
              </div>
              <div>
                <a
                  href="#forgotPassword"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    Log in
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#register"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    New customer? Create your account
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
