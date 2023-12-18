import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CategoryContext from "../../../contexts/CategoryContext";

function ResourceVersionList() {
  const { categoryList } = useContext(CategoryContext);
  const location = useLocation();
  const { categoryName } = location.state;
  const { resourceId } = location.state;
  const categoryId = categoryList.find(item => item.name === categoryName)._id;
  const [versionData, setVersionData] = useState([]);

  async function fetchData() {
    const response = await axios.get(
      `${
        import.meta.env.VITE_SERVER_URL
      }/categories/${categoryId}/resources/${resourceId}/versions`
    );

    setVersionData([...response.data]);
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };

    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-10 w-3/5 h-screen overflow-auto drop-shadow-lg">
      <div className=" bg-stone-100 rounded-2xl pb-10">
        {[...versionData].reverse().map((version, index) => {
          const currentVersion = version.detail.version;
          const previousVersion = versionData[index + 1]
            ? versionData[index + 1].detail.version
            : "N/A"; // If it's the last version, we set it to N/A

          return (
            <div key={version._id}>
              <div className="border-b-2 border-stone-300 pt-10 pb-5">
                <div className="px-10">
                  <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold">{`v${version.detail.version}`}</h2>
                    {index === 0 && (
                      <p className="border-2 ml-2 px-1 text-xs font-semibold border-black rounded-2xl">
                        Latest
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-semibold">Changes</p>
                  <p>{`redesign, version update ${previousVersion} -> ${currentVersion}`}</p>
                </div>
              </div>
              <div>
                <div className="px-10">
                  <h3 className="text-lg font-semibold py-3">Assets</h3>
                  <ul className="border border-black rounded-lg">
                    {version.files.map((file, fileIndex) => (
                      <li
                        key={file._id}
                        className={`px-2 py-3 text-sm ${
                          fileIndex + 1 !== version.files.length
                            ? "border-b border-black"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex">
                            <span className="material-symbols-outlined pr-3">
                              image
                            </span>
                            <button type="button">{`${file.fileName}(svg)`}</button>
                            <p className="px-2"> / </p>
                            <button type="button">{`${file.fileName}(png)`}</button>
                          </div>
                          <div>
                            <p className="">
                              {`Updated on ${formatDate(
                                version.detail.uploadDate
                              )}`}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResourceVersionList;
