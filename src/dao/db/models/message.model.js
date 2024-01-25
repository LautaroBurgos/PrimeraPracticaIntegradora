import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    user: String,
    message: String
});

export const userModel = mongoose.model(messages, messageSchema)