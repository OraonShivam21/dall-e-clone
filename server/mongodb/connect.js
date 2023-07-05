import mongoose from "mongoose";

const connectDB = (url) => {
    // to enable the search functionality
    mongoose.set("strictQuery", true);

    // to connect the mongoose database
    mongoose.connect(url)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error(err));
};

export default connectDB;