import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa6";
import { FaUnderline } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";

const EmailEditor = () => {
  const [template, setTemplate] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeField, setActiveField] = useState("content");
  const [click,setClick] = useState(false);
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    color: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/getEmailLayout")
      .then((response) => {
        setTemplate(response.data);
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching template:", error);
      });
  }, []);

  const handleChange = (field, value) => {
    setTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const saveTemplate = () => {
    axios
      .post("http://localhost:5000/uploadEmailConfig", template)
      .then(() => {
        alert("Template saved to database successfully!");
      })
      .catch((error) => {
        console.error("Error saving template:", error);
      });
  };

  const toggleFormatting = (type, value = null) => {
    setFormatting((prev) => {
      const updatedFormatting = { ...prev };
      if (type === "color") {
        updatedFormatting.color = value === prev.color ? "" : value;
      } else {
        updatedFormatting[type] = !prev[type];
      }
      return updatedFormatting;
    });
  };

  const applyFormattingStyles = (field) => {
    const styles = {};
    if (field === activeField) {
      if (formatting.bold) styles.fontWeight = "bold";
      if (formatting.italic) styles.fontStyle = "italic";
      if (formatting.underline) styles.textDecoration = "underline";
      if (formatting.color) styles.color = formatting.color;
    }
    return styles;
  };

  if (loading) {
    toast.success("Loading");
    return <p className="text-center mt-10">Loading template...</p>;
  }
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          "http://localhost:5000/uploadImage",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const imageUrl = response.data.url;
        handleChange(field, imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="container overflow-x-hidden  ">
      <div className="flex flex-row w-screen justify-between px-2 py-2 mb-2 bg-gray-300">
        <p className=" text-2xl font-bold font-serif">Email Builder</p>
        <Link to="/saved-templates">
          <button className="bg-gray-600 flex lg:shadow-md hover:shadow-xl lg:text-sm lg:mr-6 text-xs flex-row gap-2 text-white py-2 px-4 rounded-md hover:bg-gray-800 hover:scale-105 transition-all duration-300">
            <FaSave className="mt-[4px]" />
            Saved Templates
          </button>
        </Link>
      </div>
      <div className="flex flex-col mx-5 md:flex-row gap-8 my-10">
        {/* Editor */}
        <div className="flex flex-col lg:w-[400px] w-full lg:mx-0 mx-auto bg-gray-100 p-6 shadow-lg border-[1px] border-gray-500 rounded-md">
          <h2 className="text-xl font-bold mb-4">Edit Email Template</h2>
          <div className="space-y-4">
            <div className=" flex flex-col gap-2 rounded-md bg-gray-200 border-[1px] border-gray-300   shadow-md  px-3 py-5">
              <p className=" font-semibold text-start">Title</p>
              <input
                type="text"
                className="w-full p-2 border rounded-md shadow-sm"
                value={template.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onFocus={() => setActiveField("title")}
                placeholder="Title"
                style={applyFormattingStyles("title")}
              />
            </div>

            <div className="flex flex-col gap-2 shadow-md bg-gray-50 border-[1px] border-gray-300 rounded-md px-3 py-5">
              <p className=" font-semibold text-start">Logo</p>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded-md shadow-sm bg-white"
                onChange={(e) => handleImageUpload(e, "logo")}
                placeholder="Logo"
              />
            </div>

            <div className=" flex flex-col gap-2 shadow-md bg-gray-200 border-[1px] border-gray-300 px-3 py-5 rounded-md">
              <p className=" font-semibold text-start">Name</p>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={template.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onFocus={() => setActiveField("name")}
                placeholder="Name"
                style={applyFormattingStyles("name")}
              />
            </div>
            <div className=" flex flex-col gap-2 bg-gray-50 border-[1px] border-gray-300 rounded-md shadow-md px-3 py-5">
              <p className=" font-semibold text-start">Content</p>
              <textarea
                className="w-full p-2 border rounded-md shadow-sm"
                value={template.content}
                onChange={(e) => handleChange("content", e.target.value)}
                onFocus={() => setActiveField("content")}
                placeholder="Content"
                style={applyFormattingStyles("content")}
                rows="4"
              ></textarea>
              <div className="flex flex-col text-start  gap-2">
                <div className=" flex flex-row gap-2">
                  <button
                    onClick={() => toggleFormatting("bold")}
                    className={`p-2 border hover:shadow-md hover:bg-gray-200 rounded-md ${
                      formatting.bold ? "bg-gray-300" : ""
                    }`}
                  >
                    <FaBold />
                  </button>
                  <button
                    onClick={() => toggleFormatting("italic")}
                    className={`p-2 border hover:shadow-md  hover:bg-gray-200 rounded-md ${
                      formatting.italic ? "bg-gray-300" : ""
                    }`}
                  >
                    <FaItalic />
                  </button>
                  <button
                    onClick={() => toggleFormatting("underline")}
                    className={`p-2 border  hover:bg-gray-200 hover:shadow-md rounded-md ${
                      formatting.underline ? "bg-gray-300" : ""
                    }`}
                  >
                    <FaUnderline />
                  </button>
                </div>
                <hr className=" w-350px h-[1px]  bg-gray-500 my-2" />
                <div className=" flex flex-col gap-2">
                  <p className="font-semibold">Choose Color</p>
                  <div>
                    {[
                      "red",
                      "skyblue",
                      "orange",
                      "gray-400",
                      "black",
                      "blue",
                      "green",
                      "yellow",
                      "purple",
                      "gray",
                      "brown",
                      "blue",
                      "pink",
                    ].map((color, index) => (
                      <button
                        key={index}
                        className="p-2 w-6 h-6 rounded-md border-[1px] border-gray mx-1"
                        style={{ backgroundColor: color }}
                        onClick={() => toggleFormatting("color", color)}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-2 bg-gray-200 px-2 py-3 rounded-md shadow-md border-[1px] border-gray-300">
              <p className=" font-semibold text-start">Image</p>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded-md bg-gray-50 shadow-sm"
                onChange={(e) => handleImageUpload(e, "image")}
                placeholder="Image"
              />
            </div>

            <div className=" flex  flex-col gap-2  bg-gray-50 mb-4 px-2 py-3 rounded-md shadow-md border-[1px] border-gray-300">
              <p className=" font-semibold text-start">Footer</p>
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-5"
                value={template.footer}
                onChange={(e) => handleChange("footer", e.target.value)}
                placeholder="Footer"
              />
            </div>

            <Link className="mt-10" to="/saved-templates">
              <button
                onClick={saveTemplate}
                className="w-full bg-gray-500 mt-5 text-white py-2 rounded-md hover:bg-gray-700 hover:scale-105 transition-all duration-300 shadow-md"
              >
                Save Template
              </button>
            </Link>
          </div>
        </div>

        {/* Preview */}
        {click ? ( <div className="flex-1 bg-gray-100 p-6 shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Preview</h2>
          <div className="space-y-4 border p-4 rounded-md bg-white shadow-sm">
            <div className="text-center">
              <img
                src={template.logo}
                alt="Logo"
                className="mx-auto max-w-full rounded-lg  h-[100px] object-contain"
              />
              <h1
                className="text-2xl font-semibold mt-4"
                style={applyFormattingStyles("title")}
              >
                {template.title}
              </h1>
              <h2
                className="text-lg font-semibold mt-4"
                style={applyFormattingStyles("name")}
              >
                {template.name}
              </h2>
              <p className="mt-4" style={applyFormattingStyles("content")}>
                {template.content}
              </p>
              <img
                src={template.image}
                alt="Image"
                className="mx-auto mt-4 max-w-full rounded-md"
              />
              <footer className="mt-6 text-sm text-gray-500">
                {template.footer}
              </footer>
            </div>
          </div>
        </div>) : (
          <div className="flex flex-col mx-auto gap-8 text-center">
            <p className="lg:text-3xl text-xl text-gray-700">Click here to get the sample email template!!</p>
            <button 
            onClick={()=>setClick(true)}
            className=" bg-gray-600 text-white px-5 py-2 max-w-max mx-auto rounded-md shadow-md hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              Get Template
            </button>
          </div>
        )}
       
      </div>
    </div>
  );
};

export default EmailEditor;
