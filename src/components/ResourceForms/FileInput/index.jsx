import { useRef } from "react";

// eslint-disable-next-line react/prop-types
function FileInput({ mode, handleFileChange, logoImageByMode }) {
  const fileInputRef = useRef(null);

  return (
    <div className="flex col-span-3 mt-3">
      <h2 className="pr-10 w-40 text-right">{mode}</h2>
      <div className="flex justify-between flex-grow col-span-2 border border-stone-800 rounded-md h-7">
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={event => {
            handleFileChange(event, mode);
          }}
        />
        <div
          className={`flex items-center ml-2 ${
            logoImageByMode ? `text-xs text-black` : `text-xs text-stone-400`
          }`}
        >
          {/* eslint-disable react/prop-types */}
          {logoImageByMode
            ? logoImageByMode.name
            : "No files have been selected yet. *Please only upload SVG files!"}
          {/* eslint-enable react/prop-types */}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="px-1 bg-stone-800 text-sm font-light text-stone-100"
        >
          Choose your file
        </button>
      </div>
    </div>
  );
}

export default FileInput;
