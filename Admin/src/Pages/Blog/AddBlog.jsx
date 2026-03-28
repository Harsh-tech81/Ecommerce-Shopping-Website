import { useState, useContext } from "react";
import { deleteImages } from "../../utils/api.js";
import { MyContext } from "../../App.jsx";
import { IoMdClose } from "react-icons/io";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { postData } from "../../utils/api.js";
import CircularProgress from "@mui/material/CircularProgress";
import UploadBox from "../../components/UploadBox/index.jsx";
import { useNavigate } from "react-router-dom";
import Editor from "react-simple-wysiwyg";
function AddBlog() {
  const context = useContext(MyContext);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [html, setHtml] = useState("");
  const [formFields, setFormFields] = useState({
    title: "",
    description: "",
    images: [],
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };
  const onChangeDescription = (e) => {
    setHtml(e.target.value);
    formFields.description = e.target.value;
  };
  const valideValue = Object.values(formFields).every((el) => el);

  const setPreviewsFunction = (previewsArr) => {
    setPreviews(previewsArr);
    formFields.images = previewsArr;
  };

  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/blog/deleteImg?img=${image}`).then((res) => {
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
    if (formFields.title === "") {
      context.openAlertbox("error", "Please enter Title");
      setIsLoading(false);
      return false;
    }
    if (formFields.description === "") {
      context.openAlertbox("error", "Please enter Description");
      setIsLoading(false);
      return false;
    }
    if (previews?.length === 0) {
      context.openAlertbox("error", "Please select blog Image");
      setIsLoading(false);
      return false;
    }
    postData("/api/blog/add", formFields).then((res) => {
      context.openAlertbox("success", "Blog created successfully");
      setTimeout(() => {
        setIsLoading(false);
        context.setIsOpenFullScreen({
          open: false,
        });
      }, 500);
      setFormFields({
        title: "",
        description: "",
        images: [],
      });
      setPreviews([]);
      navigate("/blog/list");
    });
  };

  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-1 md:pr-4 pt-4">
          <div className="grid grid-cols-1 mb-3">
            <div className="col w-full md:w-[25%]]">
              <h3 className="text-[14px] font-[500] mb-3 text-black">Title</h3>
              <input
                type="text"
                name="title"
                value={formFields.title}
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mb-3">
            <div className="col w-[100%]">
              <h3 className="text-[14px] font-[500] mb-3 text-black">
                Description
              </h3>
              <Editor
                value={html}
                onChange={onChangeDescription}
                containerProps={{ style: { resize: "vertical" } }}
              />
            </div>
          </div>

          <br />
          <h3 className="text-[18px] font-[500] mb-0 text-black">Images</h3>

          <br />

          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {previews?.length !== 0 &&
              previews?.map((image, index) => {
                return (
                  <div className="uploadBoxWrapper relative">
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
              multiple={true}
              name="images"
              url="/api/blog/upload-images"
              setPreviewsFunction={setPreviewsFunction}
            />
          </div>
        </div>
        <br />

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

export default AddBlog;
