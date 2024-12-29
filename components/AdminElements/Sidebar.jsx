import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const router = useRouter();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const logout = (role) => {
    if (role === "admin") {
      localStorage.removeItem("adminToken");
      router.push("/admin");
      return;
    }
    if (role === "superAdmin") {
      localStorage.removeItem("superAdminToken");
      router.push("/admin-super");
      return;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const LinkClick = (link) => {
    setIsOpen(false);
    localStorage.setItem("oldRoute", link);
  };
  const SidebarRoleBased = {
    admin: [
      {
        name: "Dashboard",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        ),
        link: "/dashboard/home",
      },

      {
        name: "Analytics",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            style={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
        ),
        link: "/dashboard/analytics",
      },
      
      {
        name: "Create Post",
        icon: (
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            id="Content-Pen-Write--Streamline-Ultimate"
            height="24"
            width="24"
          >
            <desc>
              Content Pen Write Streamline Icon: https://streamlinehq.com
            </desc>
            <path
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M22.588 4.59101c0.422 -0.42196 0.659 -0.99426 0.659 -1.591 0 -0.59674 -0.237 -1.16904 -0.659 -1.591C22.166 0.987054 21.5937 0.75 20.997 0.75s-1.169 0.237054 -1.591 0.65901L8.14 12.675l3.182 3.182L22.588 4.59101Z"
              stroke-width="1.5"
            ></path>
            <path
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.14 12.6751 -1.393 4.575 4.575 -1.393m6.959 -13.32304 3.182 3.182M3.747 18.7501H3c-0.59674 0 -1.16903 0.237 -1.59099 0.659C0.987053 19.831 0.75 20.4033 0.75 21.0001c0 0.5967 0.237053 1.169 0.65901 1.5909 0.42196 0.422 0.99425 0.6591 1.59099 0.6591h15.75"
              stroke-width="1.5"
            ></path>
          </svg>
        ),
        link: "/dashboard/create-post",
      },

      {
        name: "Grocery Categories",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
        ),
        link: "/dashboard/grocery-categories",
      },

      {
        name: "Grocery Management",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            style={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 6h.008v.008H6V6Z"
            />
          </svg>
        ),
        link: "/dashboard/products",
      },

      {
        name: "Categories",
        icon: (
          <svg
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
            id="Categories--Streamline-Carbon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.5 -0.5 16 16"
            height="16"
            width="16"
          >
            <desc>Categories Streamline Icon: https://streamlinehq.com</desc>
            <defs></defs>
            <title>categories</title>
            <path
              d="m3.1687499999999997 2.8125 0.2109375 0.4171875L3.6374999999999997 3.75H5.625v2.34375H1.875V2.8125h1.29375m0.290625 -0.9375H1.40625a0.46875 0.46875 0 0 0 -0.46875 0.46875v4.21875a0.46875 0.46875 0 0 0 0.46875 0.46875h4.6875a0.46875 0.46875 0 0 0 0.46875 -0.46875V3.28125a0.46875 0.46875 0 0 0 -0.46875 -0.46875H4.21875l-0.33749999999999997 -0.6796875a0.46875 0.46875 0 0 0 -0.421875 -0.2578125Z"
              stroke-width="1"
            ></path>
            <path
              d="m10.668750000000001 2.8125 0.2109375 0.4171875 0.2578125 0.5203125000000001H13.125v2.34375h-3.75V2.8125h1.29375m0.290625 -0.9375H8.90625a0.46875 0.46875 0 0 0 -0.46875 0.46875v4.21875a0.46875 0.46875 0 0 0 0.46875 0.46875h4.6875a0.46875 0.46875 0 0 0 0.46875 -0.46875V3.28125a0.46875 0.46875 0 0 0 -0.46875 -0.46875h-1.875l-0.33749999999999997 -0.6796875a0.46875 0.46875 0 0 0 -0.421875 -0.2578125Z"
              stroke-width="1"
            ></path>
            <path
              d="m3.1687499999999997 8.90625 0.2109375 0.4171875 0.2578125 0.5203125000000001H5.625v2.34375H1.875v-3.28125h1.29375m0.290625 -0.9375H1.40625a0.46875 0.46875 0 0 0 -0.46875 0.46875v4.21875a0.46875 0.46875 0 0 0 0.46875 0.46875h4.6875a0.46875 0.46875 0 0 0 0.46875 -0.46875v-3.28125a0.46875 0.46875 0 0 0 -0.46875 -0.46875H4.21875l-0.33749999999999997 -0.6796875a0.46875 0.46875 0 0 0 -0.421875 -0.2578125Z"
              stroke-width="1"
            ></path>
            <path
              d="m10.668750000000001 8.90625 0.2109375 0.4171875 0.2578125 0.5203125000000001H13.125v2.34375h-3.75v-3.28125h1.29375m0.290625 -0.9375H8.90625a0.46875 0.46875 0 0 0 -0.46875 0.46875v4.21875a0.46875 0.46875 0 0 0 0.46875 0.46875h4.6875a0.46875 0.46875 0 0 0 0.46875 -0.46875v-3.28125a0.46875 0.46875 0 0 0 -0.46875 -0.46875h-1.875l-0.33749999999999997 -0.6796875a0.46875 0.46875 0 0 0 -0.421875 -0.2578125Z"
              stroke-width="1"
            ></path>
            <path
              id="_Transparent_Rectangle_"
              d="M0 0h15v15H0Z"
              fill="none"
              stroke-width="1"
            ></path>
          </svg>
        ),
        link: "/dashboard/categories",
      },

      {
        name: "Active Posts",
        icon: (
          <svg
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            id="Newspapers--Streamline-Guidance-Free"
            height="24"
            width="24"
          >
            <desc>Newspapers Streamline Icon: https://streamlinehq.com</desc>
            <path
              stroke="#000000"
              d="M18.91 20c0.276 -1.823 0.59 -4.637 0.59 -8 0 -6 -1 -10.25 -1 -10.25l-0.05 -0.25H1.5v0.25S2.5 6 2.5 12s-1 10.25 -1 10.25v0.25h19.95l0.05 -0.25s1 -4.25 1 -10.25c0 -3.07 -0.262 -5.681 -0.517 -7.5H19m-2.685 12h-11m-0.332 -12a54.458 54.458 0 0 1 0.496 9h11a54.453 54.453 0 0 0 -0.496 -9h-11Z"
              stroke-width="1"
            ></path>
          </svg>
        ),
        link: "/dashboard/posts",
      },

      {
        name: "Drafts Posts",
        icon: (
          <svg
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
            id="Synchronize-Warning--Streamline-Core"
            height="14"
            width="14"
          >
            <desc>
              Synchronize Warning Streamline Icon: https://streamlinehq.com
            </desc>
            <g id="synchronize-warning--arrow-fail-notification-sync-warning-failure-synchronize-error">
              <path
                id="Vector"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m11 9 2 -0.5 0.5 2"
                stroke-width="1"
              ></path>
              <path
                id="Vector_2"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 8.5c-0.4252 1.27038 -1.227 2.3813 -2.2987 3.1851 -1.07174 0.8038 -2.36269 1.2624 -3.70131 1.3149 -1.23189 0.0002 -2.43399 -0.3787 -3.44302 -1.0854 -1.00903 -0.7067 -1.77609 -1.7068 -2.19698 -2.8646"
                stroke-width="1"
              ></path>
              <path
                id="Vector_3"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m3 5 -2 0.5 -0.5 -2"
                stroke-width="1"
              ></path>
              <path
                id="Vector_4"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M1 5.5c0.44757 -1.25647 1.25528 -2.35329 2.32232 -3.15358C4.38936 1.54614 5.66847 1.07785 7 1c1.23789 0.00348 2.4444 0.38976 3.4541 1.10588C11.4639 2.822 12.2274 3.8329 12.64 5"
                stroke-width="1"
              ></path>
              <path
                id="Vector_5"
                stroke="#000000"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 3.5v4"
                stroke-width="1"
              ></path>
              <g id="Group 2626">
                <path
                  id="Vector_6"
                  stroke="#000000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7 10.25c-0.13807 0 -0.25 -0.1119 -0.25 -0.25 0 -0.13807 0.11193 -0.25 0.25 -0.25"
                  stroke-width="1"
                ></path>
                <path
                  id="Vector_7"
                  stroke="#000000"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7 10.25c0.13807 0 0.25 -0.1119 0.25 -0.25 0 -0.13807 -0.11193 -0.25 -0.25 -0.25"
                  stroke-width="1"
                ></path>
              </g>
            </g>
          </svg>
        ),
        link: "/dashboard/draft-posts",
      },

      {
        name: "Schedule Posts",
        icon: (
          <svg
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.5 -0.5 16 16"
            fill="#000000"
            id="Timer--Streamline-Phosphor"
            height="16"
            width="16"
          >
            <desc>Timer Streamline Icon: https://streamlinehq.com</desc>
            <path
              d="M7.5 2.25C2.650259765625 2.25 -0.380830078125 7.5 2.044037109375 11.700000000000001c2.424873046875 4.2 8.487052734375 4.2 10.91192578125 0 0.5529375 -0.9577207031249999 0.844037109375 -2.044119140625 0.844037109375 -3.15C13.796021484375 5.072255859375001 10.977744140625 2.253978515625 7.5 2.25Zm0 11.55c-4.041451171875001 0 -6.567357421875 -4.375001953125 -4.546634765625 -7.875 2.0207285156249997 -3.499998046875 7.072541015625 -3.499998046875 9.09326953125 0 0.46078125 0.798099609375 0.703365234375 1.7034316406249999 0.703365234375 2.625 -0.0032578125 2.898146484375 -2.3518535156250002 5.2467421875 -5.25 5.25Zm2.9964375000000003 -8.2464375c0.20530078125 0.205072265625 0.20530078125 0.537802734375 0 0.742875l-2.625 2.625c-0.285931640625 0.285931640625 -0.774169921875 0.15510937500000002 -0.878830078125 -0.23548242187500001 -0.048574218749999995 -0.181271484375 0.003251953125 -0.374689453125 0.135955078125 -0.5073925781249999l2.625 -2.625c0.205072265625 -0.20530078125 0.537802734375 -0.20530078125 0.742875 0ZM5.3999999999999995 0.6749999999999999c0 -0.289951171875 0.235048828125 -0.525 0.525 -0.525h3.15c0.40414453125 0 0.6567363281249999 0.437501953125 0.45466406249999997 0.7875 -0.09378515625 0.16243359375000002 -0.26709960937500005 0.2625 -0.45466406249999997 0.2625h-3.15c-0.289951171875 0 -0.525 -0.235048828125 -0.525 -0.525Z"
              stroke-width="1"
            ></path>
          </svg>
        ),
        link: "/dashboard/schedule-posts",
      },

      {
        name: "Comments",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        ),
        link: "/dashboard/comments-moderation",
      },

      {
        name: "Settings",
        icon: (
          <svg
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            id="Settings--Streamline-Guidance-Free"
            height="24"
            width="24"
          >
            <desc>Settings Streamline Icon: https://streamlinehq.com</desc>
            <path
              stroke="#000000"
              d="m10.5 1.5 -0.181 0.543a7 7 0 0 1 -0.716 1.514 4.632 4.632 0 0 1 -3.717 2.146 6.998 6.998 0 0 1 -1.668 -0.137l-0.561 -0.115 -1.5 2.598 0.38 0.429c0.374 0.422 0.693 0.884 0.953 1.376a4.632 4.632 0 0 1 0 4.292 7 7 0 0 1 -0.953 1.376l-0.38 0.429 1.5 2.598 0.56 -0.115a6.997 6.997 0 0 1 1.67 -0.137 4.632 4.632 0 0 1 3.716 2.146c0.296 0.47 0.537 0.979 0.716 1.514l0.181 0.543h3l0.181 -0.543c0.179 -0.536 0.42 -1.043 0.716 -1.514a4.632 4.632 0 0 1 3.717 -2.146 6.996 6.996 0 0 1 1.668 0.137l0.561 0.115 1.5 -2.598 -0.38 -0.429a7.007 7.007 0 0 1 -0.953 -1.376 4.632 4.632 0 0 1 0 -4.292c0.26 -0.492 0.579 -0.954 0.953 -1.376l0.38 -0.429 -1.5 -2.598 -0.56 0.115a6.999 6.999 0 0 1 -1.67 0.137 4.632 4.632 0 0 1 -3.716 -2.146 6.997 6.997 0 0 1 -0.716 -1.514L13.5 1.5h-3Z"
              stroke-width="1"
            ></path>
            <path
              stroke="#000000"
              d="M15.502 12a3.502 3.502 0 1 1 -7.004 0 3.502 3.502 0 0 1 7.004 0Z"
              stroke-width="1"
            ></path>
          </svg>
        ),
        link: "/dashboard/settings",
      },
      {
        name: "Business Link",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
            />
          </svg>
        ),
        link: "/dashboard/linkbusiness",
      },
      {
        name: "Gallery",
        icon: (
          <svg
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
            viewBox="-0.5 -0.5 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            id="Gallery--Streamline-Solar-Broken"
            height="16"
            width="16"
          >
            <desc>Gallery Streamline Icon: https://streamlinehq.com</desc>
            <path
              stroke="#000000"
              d="M8.75 5a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0 -2.5 0"
              stroke-width="1"
            ></path>
            <path
              d="m1.25 7.8125625 1.09474375 -0.957875c0.56954375 -0.4983125 1.4279312499999999 -0.46975 1.9630625 0.065375l2.68106875 2.6810625c0.4295 0.4295625 1.1056249999999999 0.48812500000000003 1.602625 0.1388125l0.186375 -0.13093749999999998c0.715125 -0.502625 1.6826875 -0.44437499999999996 2.3324375 0.140375L13.125 11.5625625"
              stroke="#000000"
              stroke-linecap="round"
              stroke-width="1"
            ></path>
            <path
              d="M13.75 7.5c0 2.94625 0 4.4194375 -0.9153125 5.3346875C11.9194375 13.75 10.44625 13.75 7.5 13.75c-2.94628125 0 -4.41941875 0 -5.33470625 -0.9153125C1.25 11.9194375 1.25 10.44625 1.25 7.5c0 -2.94628125 0 -4.41941875 0.91529375 -5.33470625C3.0805812500000003 1.25 4.55371875 1.25 7.5 1.25c2.94625 0 4.4194375 0 5.3346875 0.91529375 0.608625 0.6085875000000001 0.8125625000000001 1.4638 0.880875 2.83470625"
              stroke="#000000"
              stroke-linecap="round"
              stroke-width="1"
            ></path>
          </svg>
        ),
        link: "/dashboard/gallery",
      },

      {
        name: "Trash",
        icon: (
          <svg
            style={{
              height: "1.5rem", // equivalent to h-6
              width: "1.5rem", // equivalent to w-6
            }}
            viewBox="-0.5 -0.5 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            id="Trash--Streamline-Iconoir"
            height="16"
            width="16"
          >
            <desc>Trash Streamline Icon: https://streamlinehq.com</desc>
            <path
              d="m12.96975 5.4488125 -1.3639999999999999 7.75775c-0.1149375 0.6538125 -0.6829375 1.130625 -1.34675 1.130625H4.7410000000000005c-0.663875 0 -1.2318125 -0.47681250000000003 -1.34675 -1.130625L2.03025 5.4488125"
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
            ></path>
            <path
              d="M13.653500000000001 3.3976875h-3.8459375000000002m-8.461062499999999 0h3.8459375000000002m0 0V2.03025c0 -0.75525 0.61225 -1.3674374999999999 1.3674374999999999 -1.3674374999999999h1.88025c0.75525 0 1.3674374999999999 0.6121875 1.3674374999999999 1.3674374999999999v1.3674374999999999m-4.615125 0h4.615125"
              stroke="#000000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
            ></path>
          </svg>
        ),
        link: "/dashboard/trash",
      },
    ],
  };

  return (
    <div
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 50,
        width: "16rem",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out",
        background:
          role === "superAdmin"
            ? "linear-gradient(to bottom right, #60a5fa, #6b21a8, #9333ea)"
            : "linear-gradient(to bottom right, #eff6ff, #e0f2fe, #f3e8ff)",
        color: role === "superAdmin" ? "white" : "#1f2937",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRight:
            role === "superAdmin"
              ? "1px solid rgba(55, 65, 81, 0.7)"
              : "1px solid #e0f2fe",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Fixed Header */}
        <div style={{ flexShrink: 0, padding: "2rem 1.5rem" }}>
          <h2
            style={{
              fontSize: "1.875rem",
              fontWeight: "600",
              background:
                role === "superAdmin"
                  ? "linear-gradient(to right, white, #fbbf24, #facc15)"
                  : "linear-gradient(to right, #ec4899, #db2777)", // Pink colors

              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {role === "superAdmin" ? "Super Admin" : "Admin Panel"}
          </h2>
        </div>

        {/* Scrollable Navigation */}
        <div
          className="scrollAreaAdmin"
          style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin" }}
        >
          <nav style={{ paddingLeft: "0.75rem", paddingRight: "0.75rem" }}>
            {SidebarRoleBased[role].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className={`mb-2 flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 
                  ${"transform text-gray-600 hover:scale-105 hover:bg-white hover:bg-opacity-70 hover:text-pink-600 hover:shadow-md"}`}
                onClick={() => LinkClick(item.link)}
              >
                {item.icon}
                <span style={{ fontWeight: "500" }}>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Fixed Footer */}
        <div
          style={{
            flexShrink: 0,
            borderTop:
              role === "superAdmin"
                ? "1px solid rgba(55, 65, 81, 0.5)"
                : "1px solid #e0f2fe",
            padding: "1.5rem",
          }}
        >
          <button
            onClick={() => logout(role)}
            style={{
              width: "100%",
              padding: "0.75rem 1.5rem",
              borderRadius: "1rem",
              background: "linear-gradient(to right, #ec4899, #db2777)", // Pink gradient
              color: "white",
              transition: "all 0.2s",
              border: "none",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "absolute",
          right: "-3rem",
          top: "1rem",
          padding: "0.75rem",
          borderRadius: "1.25rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor:
            role === "superAdmin"
              ? "rgba(129, 58, 252, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
          color: role === "superAdmin" ? "white" : "#ec4899", // Pink color
          transition: "all 0.2s",
          border: "none",
        }}
      >
        <svg
          style={{
            height: "1.5rem",
            width: "1.5rem",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>
    </div>
  );
};

export default Sidebar;
