import { MdOutlineModeEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useState, useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { editData,deleteData } from "../../utils/api";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";


function EditSubCatBox(props) {
  const [editMode, setEditMode] = useState(false);
  const [selectVal, setSelectVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    parentCatName: null,
    parentId: null,
  });
  const context = useContext(MyContext);

  useEffect(() => {
    formFields.name = props?.name;
    formFields.parentId = props?.selectedCat;
    formFields.parentCatName = props?.selectedCatName;
    setSelectVal(props?.selectedCat);
  }, []);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    const catId = selectVal;
    setSelectVal(catId);

    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    if (formFields.name === "") {
      context.openAlertbox("error", "Please enter Category Name");
      setIsLoading(false);
      return false;
    }

    editData(`/api/category/update/${props?.id}`, formFields).then((res) => {
      
      setTimeout(() => {
        setIsLoading(false);
        context?.getCat();
        context.openAlertbox("success", "Category updated successfully");
        setEditMode(false);
        context.setIsOpenFullScreen({
          open: false,
        });
      }, 1000);
    });

  };


  const handleChange = (event) => {
    setSelectVal(event.target.value);
    formFields.parentId = event.target.value;
  };


  const deleteCat=(id)=>{
    deleteData(`/api/category/delete/${id}`).then((res)=>{
      context.openAlertbox("success", "Category deleted successfully");
      context?.getCat();
    });
  }

  return (
    <form className="w-full flex items-center gap-3 p-0 px-4 " onSubmit={handleSubmit}>
      {editMode && (
        <>
          <div className="flex items-center justify-between py-2 gap-4 whitespace-nowrap overflow-x-scroll">
            <div className="w-[180px] md:w-[150px]">
              <Select
                value={selectVal}
                size="small"
                onChange={onChangeInput}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                className="w-full"
                style={{ zoom: "75%" }}
              >
                {props?.catData?.length !== 0 &&
                  props?.catData?.map((item, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={item?._id}
                        onClick={() => {
                          formFields.parentCatName = item?.name;
                        }}
                      >
                        {item?.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </div>

            <input
              type="text"
              name="name"
              value={formFields.name}
              onChange={onChangeInput}
              className="w-[150px] md:w-full h-[30px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm"
            />

            <div className="flex items-center gap-2">
              <Button
                className="btn-sml"
                type="submit"
                size="small"
                variant="contained"
              >
                {isLoading ? <CircularProgress color="inherit" /> : <>Edit</>}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setEditMode(false)

                }
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}

      {!editMode && (
        <>
          <span className="font-[500] text-[14px]">{props?.name}</span>
          <div className="flex gap-2 ml-auto items-center">
            <Button
              className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black"
              onClick={() => setEditMode(true)}
            >
              <MdOutlineModeEdit />
            </Button>
            <Button className="!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black"
              onClick={() => deleteCat(props?.id)}
            >
              <FaRegTrashAlt />
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

export default EditSubCatBox;
