import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// get all post
router.route("/").get(async(req, res) => {
    try {
        // getting all the posts from Post
        const posts = await Post.find({});

        // sending all the posts to the frontend side to be shown on the page
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: true, message: error });
    }
});

// create a post
router.route("/").post(async(req, res) => {
    try {
        // first retrieve data from frontend
        const { name, prompt, photo } = req.body;

        // creating a photo url to store the newly created photo on the cloudinary database
        const photoUrl = await cloudinary.uploader.upload(photo);

        // now creating a new post to add the photo to mongodb database with the photo field provided as link to the stored photo in cloudinary database
        const newPhoto = await Post.create({
            name, prompt, photo: photoUrl.url,
        });

        // sending all the data to the database with res.status
        res.status(200).json({ success: true, data: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
});

export default router;