import Pagination from "../common/Pagination";
import { collectionItems3 } from "@/data/categories";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { apiUrl } from "@/lib/apiUrl";
import { getMediaUrlPath } from "@/lib/mediaUrl";

const fetchProducts = async () => {
  try {
    let { data } = await axios.get(
      `${apiUrl}/admin/grocerry/get-grocery-products?limit=3`
    );
    if (data.success) {
      return data.products;
    }
  } catch (error) {
    console.log("error", error);
  }
};
export default async function ShopCollections() {
  const data = await fetchProducts();
  return (
    <section className="flat-spacing-1">
      <div className="container">
        <div className="tf-grid-layout lg-col-3 tf-col-2">
          {data.map((item, index) => (
            <div className="collection-item hover-img" key={index}>
              <div className="collection-inner">
                <Link
                  href={`/shop-default`}
                  className="collection-image img-style"
                >
                  <Image
                    className="lazyload"
                    data-src={item.imgSrc}
                    alt={item.alt}
                    src={getMediaUrlPath(item.img_file)}
                    width={460}
                    height={460}
                  />
                </Link>
                <div className="collection-content">
                  <Link
                    href={`/shop-default`}
                    className="tf-btn collection-title hover-icon"
                  >
                    <span>{item.title}</span>
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* pagination */}
        <ul className="tf-pagination-wrap tf-pagination-list">
          <Pagination />
        </ul>
      </div>
    </section>
  );
}
