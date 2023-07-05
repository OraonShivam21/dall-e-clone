import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  // this will allow us to navigate to the home page once a new post is created to be shown on the home page.

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: ""
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  // this is gonna be used while we're making contact with the api and waiting to get back the image, and while waiting we've to show the loading icon...
  const [loading, setLoading] = useState(false);

  // function to call the backend to generate the image via openai api and send it back to the frontend
  const generateImage = async () => {
    // to check if prompt of form is given any string value or is empty
    if(form.prompt) {
      try {
        // generating the image has started so..
        setGeneratingImg(true);

        // sending data i.e. prompt to the backend
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });

        // now fetching the data back
        const data = await response.json();

        // now saving and rendering image generated
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}`});
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const handleSubmit = async (e) => {
    // prevent from automatic refreshing the page
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        await response.json();
        navigate("/");
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and generate a photo first!");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666E75] text-[14px] max-w-[500px]">Create imaginative and visually stunning images through DALL-E AI and share them with the community</p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField 
            labelName="Your name"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField 
            labelName="Prompt"
            name="prompt"
            placeholder="a stained glass window depicting a hamburger and french fries"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo? (
              <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
            ) : (
              <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain opacity-40" />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)]">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button 
            type="button" 
            onClick={generateImage}
            className="bg-green-700 text-white font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:shadow-sm hover:shadow-green-700">
              {generatingImg? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666E75] text-[14px]">Once you have created the image you want, you can share it with others in the community</p>
          <button
            type="button"
            className="mt-3 bg-[#6469FF] text-white font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center hover:rounded-xl"
            onClick={handleSubmit}>
            {loading? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;