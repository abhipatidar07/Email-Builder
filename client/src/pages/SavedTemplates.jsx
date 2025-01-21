import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import { IoMdTrash } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { IoMdRefreshCircle } from "react-icons/io";

const SavedTemplates = () => {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = () => {
    axios
      .get("https://email-builder-b1og.onrender.com/renderAndDownloadTemplate")
      .then((response) => {
        setTemplates(response.data);
        localStorage.setItem("template", JSON.stringify(response.data));
      })
      .catch((error) => console.error("Error fetching templates:", error));
  };

  useEffect(() => {
    const savedTemplates = localStorage.getItem("template");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      fetchTemplates();
    }
  }, []);

  const fetchImageAsBase64 = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      const mimeType = response.headers["content-type"];
      return `data:${mimeType};base64,${base64}`;
    } catch (error) {
      console.error("Error fetching image:", error);
      return url;
    }
  };

  const downloadTemplate = async (template) => {
    const contentWithEmbeddedImages = { ...template };

    if (template.logo) {
      contentWithEmbeddedImages.logo = await fetchImageAsBase64(template.logo);
    }
    if (template.image) {
      contentWithEmbeddedImages.image = await fetchImageAsBase64(
        template.image
      );
    }

    const htmlContent = `
      <html>
        <head>
          <title>${contentWithEmbeddedImages.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              background-color: #f9f9f9;
              color: #333;
            }
            h1 {
              font-size: 24px;
              color: #4a90e2;
            }
            h2 {
              font-size: 20px;
              color: #666;
            }
            p {
              font-size: 16px;
              margin: 10px 0;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .template-container {
              background: white;
              padding: 20px;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .template-container img:first-of-type {
              height: 100px;
              border-radius: 50%;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            footer {
              margin-top: 20px;
              font-size: 14px;
              color: #888;
              text-align: center;
            }
            @media (max-width: 768px) {
              body {
                padding: 10px;
              }
              h1 {
                font-size: 20px;
              }
              h2 {
                font-size: 18px;
              }
              p {
                font-size: 14px;
              }
              .template-container {
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="template-container">
            <img src="${contentWithEmbeddedImages.logo}" alt="Logo" />
            <h1>${contentWithEmbeddedImages.title}</h1>
            <h2>Hello ${contentWithEmbeddedImages.name}</h2>
            <div>${contentWithEmbeddedImages.content}</div>
            <img src="${contentWithEmbeddedImages.image}" alt="Template Image" />
            <footer>${contentWithEmbeddedImages.footer}</footer>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${contentWithEmbeddedImages.title}.html`;
    link.click();
  };

  const refreshTemplates = () => {
    localStorage.removeItem("template");
    fetchTemplates();
  };

  const deleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter(
      (template) => template._id !== templateId
    );
    setTemplates(updatedTemplates);

    localStorage.setItem("template", JSON.stringify(updatedTemplates));
    alert("Template deleted Successfully from Database");

    axios
      .delete(`https://email-builder-b1og.onrender.com/renderAndDownloadTemplate/${templateId}`)
      .catch((error) => console.error("Error deleting template:", error));
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h2 className="text-xl font-bold font-serif mb-6 bg-gray-200 py-2">
        Saved Templates
      </h2>
      <div className="flex flex-row gap-1 lg:text-xl text-sm justify-center mb-6"><p>Please refresh</p> <button className="border-[1px] border-gray-500 rounded-md w-[30px] hover:bg-gray-200 cursor-pointer hover:shadow-md"><IoMdRefreshCircle className="my-1 mx-auto" onClick={refreshTemplates}/></button><p> to get the latest templates!!</p></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id}
            className="bg-white shadow-md p-4 border-[1px] border-gray-300 rounded-md relative"
          >
            {/* Delete Icon */}
            <IoMdTrash
              onClick={() => deleteTemplate(template._id)}
              className="absolute top-2 right-2 text-red-500 cursor-pointer hover:text-red-700"
              size={24}
            />
            <img
              src={template.logo}
              alt="Logo"
              className="w-full h-16 object-contain mb-2"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{template.title}</h3>
              <h2 className="font-semibold">Hello {template.name}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: `
                    <p>${template.content}</p>
                    <img src="${template.image}" alt="Template Image" class="w-full mt-2 rounded-md" />
                    <footer class="mt-4 text-gray-500">${template.footer}</footer>
                  `,
                }}
              />
            </div>
            <button
              onClick={() => downloadTemplate(template)}
              className="mt-4 flex mx-auto flex-row gap-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 shadow-md hover:scale-105 transition-all duration-300"
            >
              <FaSave className="mt-1" />
              Download
            </button>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="mt-6 flex flex-row mx-auto justify-center gap-4">
        <Link to="/">
          <button className="bg-gray-600 flex flex-row gap-2 text-white py-2 px-4 lg:shadow-md hover:shadow-xl rounded-md hover:bg-gray-800 hover:scale-105 transition-all duration-300">
            <IoMdArrowRoundBack className="mt-1" />
            Back
          </button>
        </Link>
        <button
          onClick={refreshTemplates}
          className="bg-gray-600 flex lg:shadow-md hover:shadow-xl flex-row gap-2 text-white py-2 px-4 rounded-md hover:bg-gray-800 hover:scale-105 transition-all duration-300"
        >
          <LuRefreshCcw className="mt-1" />
          Refresh Templates
        </button>
      </div>
    </div>
  );
};

export default SavedTemplates;
