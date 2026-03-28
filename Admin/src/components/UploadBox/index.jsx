import { FaRegImages } from "react-icons/fa";
import { uploadImages } from "../../utils/api";
import { useState, useContext } from "react";
import myContext from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

function UploadBox(props) {
  const context = useContext(myContext);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const formdata = new FormData();
  let selectedImages = [];

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      setPreviews([]);
      const files = e.target.files;
      setUploading(true);
      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpg" ||
            files[i].type === "image/jpeg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formdata.append(props?.name, file);
        } else {
          context.openAlertbox("error", "Please select a valid image file.");
          setUploading(false);
          return false;
        }
      }

      uploadImages(apiEndPoint, formdata).then((res) => {
        setUploading(false);
        props.setPreviewsFunction(res?.data?.images);
      });
    } catch (error) {
      context.openAlertbox("error", "Something went wrong.");
    }
  };

  return (
    <div className="uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative">
      {uploading ? <>
        <CircularProgress />
        <h4 className="text-center">Uploading...</h4>
        </>
      : (
        <>
          <FaRegImages className="text-[40px] opacity-35 pointer-events-none" />
          <h4 className="pointer-events-none text-[14px]">Image Upload</h4>
          <input
            type="file"
            accept="image/*"
            name="images"
            multiple={props.multiple !== undefined ? props.multiple : false}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-50"
            onChange={(e) => onChangeFile(e, props?.url)}
          />
        </>
      )}
    </div>
  );
}

export default UploadBox;
