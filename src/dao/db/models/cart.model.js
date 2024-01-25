import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  id: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',  
      },
      quantity: Number,
    },
  ],
});

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;