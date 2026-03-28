import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import ProductZoom from "../../components/ProductZoom";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState, useContext } from "react";
import { useRef } from "react";
import ProductsSlider from "../../components/ProductsSlider";
import ProductDetailsComponent from "../../components/ProductDetails";
import { fetchDataFromApi } from "../../utils/api";
import Reviews from "./reviews";
import { MyContext } from "../../App";

function ProductDetails() {
  const context = useContext(MyContext);
  const [activeTab, setActiveTab] = useState(0);
  const [productDetails, setProductDetails] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const { id } = useParams();
  const reviewsSection = useRef();
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    fetchDataFromApi(`/api/user/getReview?productId=${id}`).then((res) => {
      if (res?.error === false) {
        setReviewCount(res?.reviews?.length || 0);
      }
    });
  }, [reviewCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      if (res?.error === false) {
        setProductDetails(res?.product);
        fetchDataFromApi(
          `/api/product/getProdBySubCatId/${res?.product?.subCatId}`,
        ).then((res) => {
          if (res?.error === false) {
            const filteredProducts = res?.products?.filter((item) => item._id !== id);
            setRelatedProducts(filteredProducts || []);
          }
        });

        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      }
    });
  }, [id]);

  const goToReviews = () => {
    window.scrollTo({
      top: reviewsSection?.current.offsetTop - 170,
      behavior: "smooth",
    });
    setActiveTab(1);
  };

  return (
    <>

      <section
        className="bg-white"
        style={{ paddingTop: "16px", paddingBottom: "16px" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="container flex items-center" style={{ flexDirection: context?.isLarge ? "row" : "column", gap: context?.isLarge ? "32px" : "20px" }}>
              <div className="productZoomContainer" style={{ width: context?.isLarge ? "40%" : "100%" }}>
                <ProductZoom images={productDetails?.images} />
              </div>

              <div
                className="productContent"
                style={{ width: context?.isLarge ? "60%" : "100%", paddingRight: "15px", paddingLeft: context?.isLarge ? "40px" : "0px" }}
              >
                <ProductDetailsComponent
                  item={productDetails}
                  reviewCount={reviewCount}
                  goToReviews={goToReviews}
                />
              </div>
            </div>

            <div className="container" style={{ paddingTop: "20px" }}>
              <div
                className="flex items-center gap-8"
                style={{ marginBottom: "20px" }}
              >
                <span
                  className={`link text-[17px] cursor-pointer font-[500] ${
                    activeTab === 0 && "text-[#ff5252]"
                  }`}
                  onClick={() => setActiveTab(0)}
                >
                  Description
                </span>

                <span
                  className={`link text-[17px] cursor-pointer font-[500] ${
                    activeTab === 1 && "text-[#ff5252]"
                  }`}
                  onClick={() => setActiveTab(1)}
                  ref={reviewsSection}
                >
                  Reviews ({reviewCount})
                </span>
              </div>

              {activeTab === 0 && (
                <div
                  className="shadow-md w-full rounded-md"
                  style={{ padding: context?.isLarge ? "20px 40px" : "15px" }}
                >
                  {productDetails?.description}
                </div>
              )}

              {activeTab === 1 && (
                <div
                  className="shadow-md rounded-md"
                  style={{ padding: context?.isLarge ? "20px 40px" : "15px", width: context?.isLarge ? "80%" : "100%" }}
                >
                  {productDetails?._id && (
                    <Reviews
                      productId={productDetails?._id}
                      setReviewCount={setReviewCount}
                    />
                  )}
                </div>
              )}
            </div>

            {relatedProducts?.length !== 0 && (
              <div className="container" style={{ marginTop: "30px" }}>
                <h2 className="text-[20px] font-[600]">Related Products</h2>
                <ProductsSlider items={6} data={relatedProducts} />
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default ProductDetails;
