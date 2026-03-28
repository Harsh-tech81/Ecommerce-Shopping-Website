import { useContext, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import { Rating } from "@mui/material";
import { Button } from "@mui/material";
import UploadBox from "../../components/UploadBox";
import { IoMdClose } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import "react-lazy-load-image-component/src/effects/blur.css";
import { MyContext } from "../../App";
import { deleteImages, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

function AddProduct() {

  const [previews, setPreviews] = useState([]);
    const [productCat, setProductCat] = useState("");
  const [productCatSub, setProductCatSub] = useState("");
  const [productCatThird, setProductCatThird] = useState("");
  const [productFeatured, setProductFeatured] = useState("");
  const [productRams, setProductRams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productWeight, setProductWeight] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    name: "",
    images: [],
    brand: "",
    price: "",
    oldPrice: "",
    description: "",
    catName: "",
    catId: "",
    category:"",
    subCatId: "",
    subCat: "",
    discount: "",
    thirdsubCat: "",
    thirdsubCatId: "",
    countInStock: "",
    isFeatured: false,
    rating: "",
    productRam: [],
    productWeight: [],
    size: [],
  });

  const handleChangeSize = (event) => {
    const {
      target: { value },
    } = event;
    setProductSize(typeof value === "string" ? value.split(",") : value);
    formFields.size = value;
  };
  const handleChangeWeight = (event) => {
    const {
      target: { value },
    } = event;
    setProductWeight(typeof value === "string" ? value.split(",") : value);
    formFields.productWeight = value;
  };

  const handleChangeRams = (event) => {
    const {
      target: { value },
    } = event;
    setProductRams(typeof value === "string" ? value.split(",") : value);
    formFields.productRam = value;
  };

  const onChangeRating = (event) => {
    setFormFields((prev) => ({
      ...prev,
      rating: event.target.value,
    }));
  };

  const handleChangeCatFeatured = (event) => {
    setProductFeatured(event.target.value);
    formFields.isFeatured = event.target.value;
  };

  const handleChangeCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId = event.target.value;
    formFields.category=event.target.value;
  };
  const selectCatByName = (name) => {
    formFields.catName = name;
  };
  const handleChangeCatSub = (event) => {
    setProductCatSub(event.target.value);
    formFields.subCatId = event.target.value;
  };
  const selectSubCatByName = (name) => {
    formFields.subCat = name;
  };

  const handleChangeCatThirdLevel = (event) => {
    setProductCatThird(event.target.value);
    formFields.thirdsubCatId = event.target.value;
  };

  const selectThirdCatByName = (name) => {
    formFields.thirdsubCat = name;
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

  const setPreviewsFunction = (previewsArr) => {
    setPreviews(previewsArr);
    formFields.images = previewsArr;
  };

  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews;
    deleteImages(`/api/category/deleteImg?img=${image}`).then((res) => {
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
    postData("/api/product/create", formFields).then((res) => {
      if (res?.error === false) {
        context.openAlertbox("success", res?.message);
        setFormFields({
          name: "",
          images: [],
          brand: "",
          price: "",
          oldPrice: "",
          description: "",
          catName: "",
          category : "",
          catId: "",
          subCatId: "",
          subCat: "",
          discount: "",
          thirdsubCat: "",
          thirdsubCatId: "",
          countInStock: "",
          isFeatured: false,
          rating: "",
          productRam: [],
          productWeight: [],
          size: [],
        });
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreen({
            open: false,
          });
        }, 500);
        navigate("/products");
      }else{
        setIsLoading(false);
          context.openAlertbox("error", res?.message);
      }
    });
  };
  return (
    <section className="p-5 bg-gray-50">
      <form className="form py-1 p-1 md:p-8 md:py-1" onSubmit={handleSubmit}>
        <div className="scroll max-h-[72vh] overflow-y-scroll pr-1 md:pr-4 pt-4">
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Name
              </h3>
              <input
                type="text"
                value={formFields.name}
                name="name"
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 mb-3">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Description
              </h3>
              <textarea
                type="text"
                value={formFields.description}
                name="description"
                onChange={handleChange}
                className="w-full h-[140px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-3 gap-4">
            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Category
              </h3>
              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  className="w-full"
                  size="small"
                  value={productCat}
                  label="Product Category"
                  onChange={handleChangeCat}
                >
                  {context?.catData?.map((cat, index) => {
                    return (
                      <MenuItem
                        value={cat?._id}
                        onClick={() => selectCatByName(cat?.name)}
                      >
                        {cat?.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Sub Category
              </h3>

              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  className="w-full"
                  size="small"
                  value={productCatSub}
                  label="Product Sub Category"
                  onChange={handleChangeCatSub}
                >
                  {context?.catData?.map((cat, index) => {
                    return (
                      cat?.children?.length !== 0 &&
                      cat?.children?.map((subCat, index_) => {
                        return (
                          <MenuItem
                            value={subCat?._id}
                            onClick={() => selectSubCatByName(subCat?.name)}
                          >
                            {subCat?.name}
                          </MenuItem>
                        );
                      })
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Third Level Category
              </h3>

              {context?.catData?.length !== 0 && (
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  className="w-full"
                  size="small"
                  value={productCatThird}
                  label="Product Third Level Category"
                  onChange={handleChangeCatThirdLevel}
                >
                  {context?.catData?.map((cat, index) => {
                    return (
                      cat?.children?.length !== 0 &&
                      cat?.children?.map((subCat) => {
                        return (
                          subCat?.children?.length !== 0 &&
                          subCat?.children?.map((thirdLevelCat, index) => {
                            return (
                              <MenuItem
                                value={thirdLevelCat?._id}
                                key={index}
                                onClick={() =>
                                  selectThirdCatByName(thirdLevelCat?.name)
                                }
                              >
                                {thirdLevelCat?.name}
                              </MenuItem>
                            );
                          })
                        );
                      })
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Price
              </h3>
              <input
                type="number"
                value={formFields.price}
                name="price"
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Old Price
              </h3>
              <input
                type="number"
                value={formFields.oldPrice}
                name="oldPrice"
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Is Featured?
              </h3>
              <Select
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                size="small"
                value={productFeatured}
                label="Product Featured"
                onChange={handleChangeCatFeatured}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Stock
              </h3>
              <input
                type="number"
                value={formFields.countInStock}
                name="countInStock"
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Brand
              </h3>
              <input
                type="text"
                value={formFields.brand}
                name="brand"
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
              />
            </div>
               <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product RAMS
              </h3>
              <Select
                multiple
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                size="small"
                value={productRams}
                name="rams"
                onChange={handleChangeRams}
                label="Product RAMS"
              >
                <MenuItem value={"4GB"}>4GB</MenuItem>
                 <MenuItem value={"6GB"}>6GB</MenuItem>
                <MenuItem value={"8GB"}>8GB</MenuItem>
                <MenuItem value={"16GB"}>16GB</MenuItem>
              </Select>
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Weight
              </h3>
              <Select
                multiple
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                size="small"
                value={productWeight}
                name="weight"
                onChange={handleChangeWeight}
                label="Product Weight"
              >
                <MenuItem value={"2KG"}>2KG</MenuItem>
                <MenuItem value={"4KG"}>4KG</MenuItem>
                <MenuItem value={"6KG"}>6KG</MenuItem>
                <MenuItem value={"8KG"}>8KG</MenuItem>
              </Select>
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Size
              </h3>
              <Select
                multiple
                labelId="demo-simple-select-label"
                id="productCatDrop"
                className="w-full"
                size="small"
                value={productSize}
                label="Product Size"
                onChange={handleChangeSize}
              >
                <MenuItem value={"S"}>S</MenuItem>
                <MenuItem value={"M"}>M</MenuItem>
                <MenuItem value={"L"}>L</MenuItem>
                <MenuItem value={"XL"}>XL</MenuItem>
                <MenuItem value={"XXL"}>XXL</MenuItem>
              </Select>
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Discount
              </h3>
              <input
                type="number"
                value={formFields.discount}
                name="discount"
                onChange={handleChange}
                className="w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm "
              />
            </div>

            <div className="col">
              <h3 className="text-[14px] font-[500] mb-1 text-black">
                Product Rating
              </h3>
              <Rating
                name="half-rating"
                defaultValue={1}
                precision={0.5}
                onChange={onChangeRating}
              />
            </div>
          </div>
         

          <div className="col w-full p-5 px-0">
            <h3 className="font-[700] text-[18px] mb-3">Media & Images</h3>

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
                url="/api/product/upload-images"
                setPreviewsFunction={setPreviewsFunction}
              />
            </div>
          </div>
        </div>

        <hr />
        <br />
        <Button
          className="btn-blue w-full btn-lg flex gap-2"
          type="submit"
    
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
      </form>
    </section>
  );
}

export default AddProduct;
