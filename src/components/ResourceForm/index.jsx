import { useState, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import axios from "axios";
import FileInput from "./FileInput";
import UserContext from "../../../contexts/UserContext";

function ResourceForm() {
  const [requiredLogoDetails, setRequiredLogoDetails] = useState({
    name: "",
    description: "",
    default: null,
  });
  const [logoImagesByMode, setLogoImagesByMode] = useState({
    darkmode: null,
    "1.5x": null,
    "2x": null,
    "3x": null,
    "4x": null,
  });
  const [previewSource, setPreviewSource] = useState(null);
  const user = useContext(UserContext);
  const { userEmail } = user;

  function handleInputChange(event) {
    const { name, value } = event.target;
    setRequiredLogoDetails(prevData => ({ ...prevData, [name]: value }));
  }

  function onDrop(acceptedFiles) {
    const file = acceptedFiles[0];

    if (file && file.type !== "image/svg+xml") {
      toast.error("Selected file is not SVG.\nPlease choose SVG file! :)");

      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };

    setRequiredLogoDetails(prevFiles => ({ ...prevFiles, default: file }));
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  function handleFileChange(event, mode) {
    if (event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    if (file && file.type !== "image/svg+xml") {
      toast.error("Selected file is not SVG.\nPlease choose SVG file! :)");

      return;
    }

    setLogoImagesByMode(prevFiles => ({ ...prevFiles, [mode]: file }));
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const date = new Date().toString();

    const postData = {
      name: `${requiredLogoDetails.name}.svg`,
      categoryId: "null",
      detail: {
        version: "1.0.0",
        uploadDate: date,
        email: userEmail,
      },
      files: [],
    };

    const modes = ["default", "darkmode", "1.5x", "2x", "3x", "4x"];

    if (requiredLogoDetails.default) {
      const defaultLogoSvg = await readFileAsText(requiredLogoDetails.default);
      postData.files.push({
        file: {
          fileName: "default",
          svgFile: defaultLogoSvg,
        },
      });
    }

    const filePromises = modes.map(async mode => {
      const file = logoImagesByMode[mode];

      if (file) {
        const svg = await readFileAsText(file);
        return {
          file: {
            fileName: mode,
            svgFile: svg,
          },
        };
      }
      return null;
    });

    const fileDetails = await Promise.all(filePromises);

    postData.files = [...postData.files, ...fileDetails.filter(Boolean)];

    try {
      const API_ENDPOINT = "http://localhost:3000/temp/endpoint/address";

      const response = await axios.post(API_ENDPOINT, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Upload successful!");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (error) {
      toast.error("Error uploading data. Please try again.");
    }
  }

  return (
    <div className="p-10 bg-stone-100 rounded-lg drop-shadow-md w-3/5">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 h-fit">
          <div>
            <h2 className="text-lg font-bold">Brand logo</h2>
            {/* eslint-disable react/jsx-props-no-spreading */}
            <div
              {...getRootProps()}
              className="border border-stone-800 rounded-md w-60 h-60"
            >
              <input {...getInputProps()} />
              {previewSource && (
                <img
                  src={previewSource}
                  alt="chosen"
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
            {/* eslint-enable react/jsx-props-no-spreading */}
            <p className="text-xs text-stone-400">
              * Please set your brand signature logo.
            </p>
          </div>
          <div className="col-span-2 flex flex-col">
            <h2 className="text-lg font-bold">Name</h2>
            <input
              name="name"
              className="items-center mb-5 border border-stone-800 rounded-md h-7 bg-transparent placeholder-stone-400 placeholder:text-xs"
              placeholder="Please write the log name of your brand"
              value={requiredLogoDetails.name}
              onChange={handleInputChange}
            />
            <h2 className="text-lg font-bold">Description</h2>
            <textarea
              name="description"
              className="flex-grow border border-stone-800 rounded-md bg-transparent placeholder-stone-400 placeholder:text-xs"
              placeholder="Please tell your team members what to pay attention to when using the brand logo."
              value={requiredLogoDetails.description}
              onChange={handleInputChange}
            />
            <p className="text-xs text-stone-400">
              * The content will be displayed on the main page.
            </p>
          </div>
        </div>
        <div className="mt-10">
          {Object.keys(logoImagesByMode).map(mode => (
            <FileInput
              key={mode}
              mode={mode}
              handleFileChange={event => handleFileChange(event, mode)}
              logoImageByMode={logoImagesByMode[mode]}
            />
          ))}
        </div>
        <button
          type="submit"
          className=" block mx-auto mt-9 bg-stone-800 w-40 h-10 text-lg font-light rounded-md text-stone-100"
        >
          Done
        </button>
      </form>
    </div>
  );
}

export default ResourceForm;
