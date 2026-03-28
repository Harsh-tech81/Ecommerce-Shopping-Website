import UploadBox from "../../components/UploadBox";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { IoMdClose } from "react-icons/io";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { deleteImages, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function AddHomeSlide() {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);
 const valideValue = Object.values(formFields).every((el) => el);
  const setPreviewsFunction = (previewsArr) => {
    setPreviews(previewsArr);
    formFields.images = previewsArr;
  };

  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/homeSlides/deleteImg?img=${image}`).then((res) => {
      imageArr.splice(index, 1);
      setPreviews([]);
      setTimeout(() => {
        setPreviews(imageArr);
        formFields.images = imageArr;
      }, 100);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (previews?.length === 0) {
      context.openAlertbox("error", "Please select home slide Image");
      setIsLoading(false);
      return false;
    }
    postData("/api/homeSlides/add", formFields).then((res) => {
      context.openAlertbox("success", "Home slide created successfully");
      setTimeout(() => {
        setIsLoading(false);
        context.setIsOpenFullScreen({
          open: false,
        });
      }, 500);
      setFormFields({
        images: [],
      });
      setPreviews([]);
    });
  };



  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-3 p-3 md:p-8" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
      
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {previews?.length !== 0 &&
              previews?.map((image, index) => {
                return (
                  <div className="uploadBoxWrapper relative mr-3">
                    <span
                      className="absolute w-[20px] h-[20px] rounded-full overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                      onClick={() => removeImg(image, index)}
                    >
                      <IoMdClose className="text-white text-[17px]" />
                    </span>

                    <div className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
                      <img src={image} className="w-100" />
                    </div>
                  </div>
                );
              })}

            <UploadBox
              multiple={false}
              name="images"
              url="/api/homeSlides/upload-images"
              setPreviewsFunction={setPreviewsFunction}
            />
          </div>
        </div>
        <br />
        <br /> <br />
        <div className="w-[250px]">
        <Button
            className="btn-blue w-full btn-lg flex gap-2"
            type="submit"
            disabled={!valideValue}
          >
            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              <>
                <FaCloudUploadAlt className="text-white text-[25px]" />
                Publish and View
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default AddHomeSlide;
