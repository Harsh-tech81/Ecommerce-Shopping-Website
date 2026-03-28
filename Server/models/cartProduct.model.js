import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
productTitle : {
    type : String,
    required : true
},
image : {
    type : String,
    required : true
},
rating :{
    type : Number,
    required : true
},
price : {
    type : Number,
    required : true
},
oldPrice : {
    type : Number,
},
quantity : {
    type : Number,
    default : 1
},
size : {
    type :String
},
weight : {
    type : String
},
ram : {
    type : String
},
sizeOptions : {
    type : [String],
    default : []
},
ramOptions : {
    type : [String],
    default : []
},
weightOptions : {
    type : [String],
    default : []
},
discount : {
    type : Number
},
subTotal : {
    type : Number,
},
productId : {
    type : String,
    required : true
},
countInStock : {
    type : Number,
    required : true
},
userId : {
    type : String,
    required : true
},
brand : {
    type : String,
},

},{
    timestamps : true
});

const CartModel = mongoose.model("CartProduct",cartProductSchema)

export default CartModel
