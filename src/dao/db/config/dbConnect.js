import mongoose from "mongoose";

const dbConnect = async() => {
    const dbUrl = "mongodb+srv://laburgos:1234@ecommerce.78y27gs.mongodb.net/?retryWrites=true&w=majority";

    mongoose.connect(dbUrl)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.error("Error connecting to database:", error);
    });
}

export default dbConnect;