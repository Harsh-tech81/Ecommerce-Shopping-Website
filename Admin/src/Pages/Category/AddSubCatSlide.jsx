import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { postData } from "../../utils/api.js";
import CircularProgress from "@mui/material/CircularProgress";

function AddSubCatSlide() {
  const [productCat, setProductCat] = useState("");
  const [productCat2, setProductCat2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const context = useContext(MyContext);
  const [formFields, setFormFields] = useState({
    name: "",
    parentCatName: null,
    parentId: null,
  });
  const navigate = useNavigate();
  const [formFields2, setFormFields2] = useState({
        name: "",
    parentCatName: null,
    parentId: null,
  });

  const handleChangeCat = (event) => {
    setProductCat(event.target.value);
    formFields.parentId = event.target.value;
  };
  const handleChangeCat2 = (event) => {
    setProductCat2(event.target.value);
    formFields2.parentId = event.target.value;
  };
  const selectedCatFun = (catName) => {
    formFields.parentCatName = catName;
  };
  const selectedCatFun2 = (catName) => {
    formFields2.parentCatName = catName;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };
  
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormFields2(() => {
      return {
        ...formFields2,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formFields.name === "") {
      context.openAlertbox("error", "Please enter Sub Category Name");
      setIsLoading(false);
      return false;
    }
    if (productCat === "") {
      context.openAlertbox("error", "Please select Parent category");
      setIsLoading(false);
      return false;
    }
    postData("/api/category/create", formFields).then((res) => {
      context.openAlertbox("success", "Sub Category created successfully");
      setTimeout(() => {
        setIsLoading(false);
        context.setIsOpenFullScreen({
          open: false,
        });
        context?.getCat();
        navigate("/subcategory/list")
      }, 2500);
    });
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    setIsLoading2(true);
    if (formFields2.name === "") {
      context.openAlertbox("error", "Please enter Sub Category Name");
      setIsLoading2(false);
      return false;
    }
    if (productCat2 === "") {
      context.openAlertbox("error", "Please select Parent category");
      setIsLoading2(false);
      return false;
    }
    postData("/api/category/create", formFields2).then((res) => {
      context.openAlertbox("success", "Sub Category created successfully");
      setTimeout(() => {
        setIsLoading2(false);
        context.setIsOpenFullScreen({
          open: false,
        });
        context?.getCat();
      }, 2500);
    });
  };

  return (
    <section className="p-5 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-10">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <h3 className="font-[600]">Add Sub Category</h3>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-1 mb-3 gap-5">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Category
              </h3>
              <Select
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                size="small"
                value={productCat}
                label="Product Category"
                onChange={handleChangeCat}
              >
                {context?.catData?.length !== 0 &&
                  context?.catData?.map((item, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={item?._id}
                        onClick={() => selectedCatFun(item?.name)}
                      >
                        {item?.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Sub Category Name
              </h3>
              <input
                type="text"
                name="name"
                value={formFields.name}
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
          </div>
        </div>
        <br />

        <div className="w-[250px]">
          <Button className="btn-blue w-full btn-lg flex gap-2" type="submit">
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

      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit2}>
        <h3 className="font-[600]">Add Third Level Category</h3>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-1 mb-3 gap-5">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Category
              </h3>
              <Select
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                size="small"
                value={productCat2}
                label="Product Category"
                onChange={handleChangeCat2}
              >
                {context?.catData?.length !== 0 &&
                  context?.catData?.map((item, index) => {
                    return (
                      item?.children?.length !== 0 &&
                      item?.children?.map((item2, index2) => {
                        return (
                          <MenuItem
                            key={index2}
                            value={item2?._id}
                            onClick={() => selectedCatFun2(item2?.name)}
                          >
                            {item2?.name}
                          </MenuItem>
                        );
                      })
                    );
                  })}
              </Select>
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Sub Category Name
              </h3>
              <input
                type="text"
                name="name"
                value={formFields2.name}
                onChange={handleChange2}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
          </div>
        </div>
        <br />

        <div className="w-[250px]">
          <Button className="btn-blue w-full btn-lg flex gap-2" type="submit">
            {isLoading2 ? (
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

export default AddSubCatSlide;
