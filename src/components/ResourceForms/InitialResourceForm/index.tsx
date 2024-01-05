import { useState, useContext, ChangeEvent, FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FileInput from "../FileInput/index";
import UserContext from "../../../../contexts/UserContext";
import InitialContext from "../../../../contexts/CategoryContext";

interface FileData {
  fileName: string | null;
  svgFile: string | null;
}

interface PostData {
  name: string;
  detail: {
    version: string;
    uploadDate: string;
    email: string | null;
    description: string;
  };
  files: FileData[];
}

interface InitialRequiredLogoDetails {
  name: string;
  description: string;
  default: File | null;
}

interface LogoImagesByMode {
  darkmode: File | null;
  "1.5x": File | null;
  "2x": File | null;
  "3x": File | null;
  "4x": File | null;
}

function ResourceForm() {
  const { userEmail } = useContext(UserContext);
  const { categoryList } = useContext(InitialContext);
  const navigate = useNavigate();
  const brandLogoCategory = categoryList?.find(
    category => category.name === "BrandLogo"
  );
  const brandLogoCategoryId = brandLogoCategory ? brandLogoCategory._id : null;
  const [previewSource, setPreviewSource] = useState<
    string | ArrayBuffer | null
  >(null);
  const [requiredLogoDetails, setRequiredLogoDetails] =
    useState<InitialRequiredLogoDetails>({
      name: "",
      description: "",
      default: null,
    });
  const [logoImagesByMode, setLogoImagesByMode] = useState<LogoImagesByMode>({
    darkmode: null,
    "1.5x": null,
    "2x": null,
    "3x": null,
    "4x": null,
  });

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setRequiredLogoDetails(prevData => ({ ...prevData, [name]: value }));
  }

  function onDrop(acceptedFiles: File[]) {
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

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    mode: string
  ) {
    if (event.target.files) {
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
  }

  function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        const result = event?.target?.result;

        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("File could not be read"));
        }
      };

      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const MODES = ["default", "darkmode", "1.5x", "2x", "3x", "4x"];
    const date = new Date().toString();
    const postData: PostData = {
      name: `${requiredLogoDetails.name}`,
      detail: {
        version: "1.0.0",
        uploadDate: date,
        email: userEmail,
        description: requiredLogoDetails.description,
      },
      files: [],
    };

    if (requiredLogoDetails.default) {
      const defaultLogoSvg = await readFileAsText(requiredLogoDetails.default);

      postData.files.push({
        fileName: "default",
        svgFile: defaultLogoSvg,
      });
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const mode of MODES) {
      const file = logoImagesByMode[mode as keyof LogoImagesByMode];

      if (file) {
        // eslint-disable-next-line no-await-in-loop
        const svg = await readFileAsText(file);

        postData.files.push({
          fileName: mode,
          svgFile: svg,
        });
      }
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/categories/${brandLogoCategoryId}/resource`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 201) {
        toast.error("Upload failed. Please try again.");

        return;
      }

      toast.success("Upload successful!");
      navigate(`/resource-list/BrandLogo`);
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
              {typeof previewSource === "string" && (
                <img
                  src={previewSource}
                  alt="chosen"
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
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
              mode={mode}
              handleFileChange={event => handleFileChange(event, mode)}
              logoImageByMode={logoImagesByMode[mode as keyof LogoImagesByMode]}
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
