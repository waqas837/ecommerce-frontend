"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { apiUrl } from "@/lib/apiUrl";
import axios from "axios";
import { getMediaUrlPath } from "@/lib/mediaUrl";
import { collections } from "@/data/categories";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/admin/grocerry/getGroceryCategory`
      );
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching getGroceryCategory:", error);
    }
  };

  return (
    <section className="flat-spacing-4 flat-categorie">
      <div className="container-full">
        <div className="flat-title-v2">
          <div className="box-sw-navigation">
            <div className="nav-sw nav-next-slider snbp1 nav-next-collection snbp107">
              <span className="icon icon-arrow-left" />
            </div>
            <div className="nav-sw nav-prev-slider snbn1 nav-prev-collection snbn107">
              <span className="icon icon-arrow-right" />
            </div>
          </div>
          <span
            className="text-3 fw-7 text-uppercase title wow fadeInUp"
            data-wow-delay="0s"
          >
            SHOP BY CATEGORIES
          </span>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8 col-md-8">
            <Swiper
              dir="ltr"
              className="swiper tf-sw-collection"
              spaceBetween={15}
              modules={[Navigation]}
              navigation={{
                prevEl: ".snbp107",
                nextEl: ".snbn107",
              }}
              breakpoints={{
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                640: {
                  slidesPerView: 2,
                },
              }}
            >
              {categories.map((item, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <div className="collection-item style-left hover-img">
                    <div className="collection-inner">
                      <Link
                        href={`/shop-default/${item.id}`}
                        className="collection-image img-style"
                      >
                        <img
                          className="lazyload w-36 h-36 rounded hover:rounded-lg"
                          data-src={item.imgSrc}
                          alt={item.altText}
                          src={getMediaUrlPath(item.filePath)}
                          style={{ width: "300px", height: "300px" }}
                        />
                      </Link>
                      <div className="collection-content">
                        <Link
                          href={`/shop-default/${item.id}`}
                          className="tf-btn collection-title hover-icon fs-15"
                        >
                          <span>{item.name}</span>
                          <i className="icon icon-arrow1-top-left" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="col-xl-3 col-lg-4 col-md-4">
            <div className="discovery-new-item">
              <h5>Discovery all new items</h5>
              <Link href={`/shop-collection-list`}>
                <i className="icon-arrow1-top-left" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
