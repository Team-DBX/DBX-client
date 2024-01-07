import { useState, useContext, ChangeEvent, FormEvent } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import FileInput from "../FileInput";
import UserContext from "../../../../contexts/UserContext";
import CategoryContext from "../../../../contexts/CategoryContext";

interface RequiredLogoDetails {
  name: string;
  version: string;
  description: string;
  default: File | null;
}

interface LogoImagesByMode {
  [key: string]: File | null;
}

interface FileData {
  fileName: string | null;
  svgFile: string | null;
}

interface PostData {
  detail: {
    version: string;
    uploadDate: string;
    email: string | null;
    description: string;
  };
  files: FileData[];
}

function ResourceVersionForm() {
  const { userEmail } = useContext(UserContext);
  const { categoryList } = useContext(CategoryContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName } = location.state;
  const { resourceId } = location.state;
  const categoryId = categoryList?.find(item => item.name === categoryName)
    ?._id;
  const [previewSource, setPreviewSource] = useState<
    string | ArrayBuffer | null
  >(null);
  const [requiredLogoDetails, setRequiredLogoDetails] =
    useState<RequiredLogoDetails>({
      name: "",
      version: "",
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const MODES = ["default", "darkmode", "1.5x", "2x", "3x", "4x"];
    const date = new Date().toString();
    const postData: PostData = {
      detail: {
        version: requiredLogoDetails.version,
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

    MODES.forEach(async mode => {
      const file = logoImagesByMode[mode];

      if (file) {
        const svg = await readFileAsText(file);

        postData.files.push({
          fileName: mode,
          svgFile: svg,
        });
      }
    });

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_URL
        }/categories/${categoryId}/resources/${resourceId}/version`,
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
      navigate(`/resource-list/${categoryName}`);
    } catch (error) {
      toast.error("Error uploading data. Please try again.");
    }
  }

  return (
    <div className="p-10 bg-stone-100 rounded-lg drop-shadow-md w-3/5">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 h-fit">
          <div>
            <h2 className="text-lg font-bold">{categoryName}</h2>
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
            {/* eslint-enable react/jsx-props-no-spreading */}
            <p className="text-xs text-stone-400">
              * Please set your brand signature logo.
            </p>
          </div>
          <div className="col-span-2 flex flex-col">
            <h2 className="text-lg font-bold">Version</h2>
            <input
              name="version"
              className="items-center mb-5 border border-stone-800 rounded-md h-7 bg-transparent placeholder-stone-400 placeholder:text-xs"
              placeholder="Please write the log name of your brand"
              value={requiredLogoDetails.version}
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
          {categoryName === "BrandLogo"
            ? Object.keys(logoImagesByMode).map(mode => (
                <FileInput
                  key={mode}
                  mode={mode}
                  handleFileChange={event => handleFileChange(event, mode)}
                  logoImageByMode={logoImagesByMode[mode]}
                />
              ))
            : null}
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

export default ResourceVersionForm;
