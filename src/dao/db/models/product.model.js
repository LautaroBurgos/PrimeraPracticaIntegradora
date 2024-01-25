import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = mongoose.Schema({
    id: String,
    title: String,
    descripcion: String,
    code: Number,
    status: Boolean,
    stock: Number,
    price: Number,
    thumbnails: [Buffer],
    category: String,
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productSchema)

export default productModel