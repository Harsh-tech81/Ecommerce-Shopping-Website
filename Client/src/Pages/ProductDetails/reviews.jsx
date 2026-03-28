import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";

function Reviews({ productId,setReviewCount }) {
  const [reviews, setReviews] = useState({
    rating: 1,
    review: "",
  });
  const [reviewsData, setReviewsData] = useState([]);
  const context = useContext(MyContext);
  const userDetails = context?.userDetails;

  const onChangeInput = (e) => {
    setReviews((prev) => ({
      ...prev,
      review: e.target.value,
    }));
  };

  const addReviews = (e) => {
    e.preventDefault();

    if (!userDetails?._id) {
      context.openAlertbox("error", "Please login to add a review");
      return;
    }

    const payload = {
      image: userDetails?.avatar || "",
      userName: userDetails?.name || "",
      userId: userDetails?._id || "",
      productId,
      rating: reviews?.rating || 1,
      review: reviews?.review || "",
    };

    postData("/api/user/addReview", payload).then((res) => {
      if (res?.error === false) {
        context.openAlertbox(
          "success",
          res?.message || "Review added successfully",
        );
        setReviews((prev) => ({
          ...prev,
          review: "",
          rating: 1,
        }));
        getReviews();
        setReviewCount((prev) => prev + 1);
      } else {
        context.openAlertbox("error", "You have not login");
      }
    });
  };
  const getReviews = useCallback(() => {
    if (!productId) {
      setReviewsData([]);
      return;
    }

    fetchDataFromApi(`/api/user/getReview?productId=${productId}`).then(
      (res) => {
        if (res?.error === false) {
          const fetchedReviews = res?.reviews || [];
          setReviewsData(fetchedReviews);
        } else {
          setReviewsData([]);
        }
      },
    );
  }, [productId]);

  useEffect(() => {
    getReviews();
  }, [getReviews]);

  return (
    <div className="w-full productReviews" style={{ padding: context?.isLarge ? "20px 40px" : "10px" }}>
      <h2 className="text-[20px]">Customer questions & answers</h2>
      {reviewsData?.length !== 0 && (
        <div
          className="reviewScroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden"
          style={{ marginTop: "10px" }}
        >
          {reviewsData?.map((item, index) => (
            <div
              className="review w-full flex items-center justify-between border-b border-gray-300"
              style={{ padding: "20px 10px", marginTop: "1px" }}
              key={item?._id || index}
            >
              <div className="info flex items-center gap-3" style={{ width: context?.isLarge ? "60%" : "100%", flexDirection: context?.isLarge ? "row" : "column", alignItems: context?.isLarge ? "center" : "flex-start" }}>
                <div
                  className="img overflow-hidden rounded-full"
                  style={{ marginRight: context?.isLarge ? "20px" : "10px", width: context?.isLarge ? "80px" : "50px", height: context?.isLarge ? "80px" : "50px" }}
                >
                  <img
                    src={item?.image || "/profile.png"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-[80%]">
                  <h4 className="text-[15px] font-[500]">
                    {item?.userName || "User"}
                  </h4>
                  <h5
                    className="text-[12px] font-[100] text-gray-600"
                    style={{ marginBottom: "0px" }}
                  >
                    {item?.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </h5>
                  <p style={{ marginBottom: "0px", marginTop: "10px" }}>
                    {item?.review || "No review available."}
                  </p>
                </div>
              </div>
              <Rating name="size-small" readOnly value={item?.rating || 1} />
            </div>
          ))}
        </div>
      )}

      <br />

      <div
        className="reviewForm bg-[#fafafa] rounded-md"
        style={{ padding: "20px" }}
      >
        <h2 className="text-[18px]">Add a review</h2>
        <form
          className="w-full"
          style={{ marginTop: "15px" }}
          onSubmit={addReviews}
        >
          <TextField
            id="outlined-multiline-flexible"
            label="Write a review..."
            rows={5}
            onChange={onChangeInput}
            name="review"
            className="w-full"
            multiline
            value={reviews?.review || ""}
          />
          <br />
          <br />
          <Rating
            name="size-small"
            value={reviews?.rating || 1}
            onChange={(event, newValue) => {
              setReviews((prev) => ({
                ...prev,
                rating: newValue || 1,
              }));
            }}
          />
          <div className="flex items-center" style={{ marginTop: "10px" }}>
            <Button type="submit" className="btn-org">
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Reviews;
