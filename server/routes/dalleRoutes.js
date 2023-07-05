import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.route("/").get((req, res) => {
    res.send("Hello from DALL-E");
});

router.route("/").post(async(req, res) => {
    try {
        // getting the prompt entered on "create" page
        const { prompt } = req.body;

        // seeking response from openai api to create the image with given prompt etc.
        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json",
        });

        // storing the image responded by openai api
        const image = aiResponse.data.data[0].b64_json;

        // sending back the image in the photo variable to be send back to the front-end
        res.status(200).json({ photo: image });
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
    }
});

export default router;