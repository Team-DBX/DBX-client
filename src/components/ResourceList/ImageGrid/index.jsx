import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import axios from "axios";
import UserContext from "../../../../contexts/UserContext";

// eslint-disable-next-line react/prop-types
function ImageGrid({ svgUrl, data, onImageSelect, categoryName, fetchData }) {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { isAdmin, categoriesId } = user;
  const gridRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const categoryId = categoriesId.find(item => item.name === categoryName)?._id;

  function handleOpenModal(img, id) {
    setModalContent(img);
    setShowModal(true);
    onImageSelect(id);
    setCurrentId(id);
  }

  function handleCloseModal() {
    setShowModal(false);
    onImageSelect(null);
  }

  function navigateToResourceVersionForm(id) {
    navigate("/new-resource-version-form", {
      state: { resourceId: id, categoryName },
    });
  }

  function navigateToResourceForm() {
    navigate("/new-resource-form", {
      state: { categoryName },
    });
  }

  function navigateToResourceVersions() {
    navigate("/resource-version-list", {
      state: { resourceId: currentId, categoryName },
    });
  }

  async function resourceDelete(id) {
    const response = await axios.delete(
      `${
        import.meta.env.VITE_SERVER_URL
      }/categories/${categoryId}/resources/${id}`
    );

    if (response.data.result === "OK") {
      fetchData();
    }
  }

  return (
    <div className="relative w-3/5 p-10 overflow-auto h-screen" ref={gridRef}>
      {showModal &&
        createPortal(
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-1/2 bg-stone-100 p-5 rounded-xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute left-0 top-0 m-5 py-0.5 px-3 bg-stone-800 rounded-full text-sm text-stone-100 font-normal"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  // eslint-disable-next-line react/prop-types
                  navigateToResourceVersions()
                }
                className="absolute right-0 bottom-0 m-5 py-0.5 px-3 bg-stone-800 rounded-full text-sm text-stone-100 font-semibold"
              >
                Previous version &gt;
              </button>
              <img src={modalContent} alt="" />
            </div>
          </div>,
          gridRef.current
        )}
      <div className="grid grid-cols-4 gap-4">
        {/* eslint-disable-next-line react/prop-types, array-callback-return */}
        {svgUrl.map((url, index) => {
          // eslint-disable-next-line no-useless-escape
          const key = url.match(/\"(.+?)\"/)[1];

          return (
            <div key={key} className="relative bg-stone-100 rounded-xl">
              <img
                src={url}
                alt=""
                // eslint-disable-next-line react/prop-types
                onClick={() => handleOpenModal(url, data[index].id)}
              />
              {isAdmin && (
                <div className="absolute flex justify-between left-0 right-0 bottom-0 w-4/6 m-auto text-xs pb-2 text-stone-100 font-normal">
                  <button
                    type="button"
                    onClick={() =>
                      // eslint-disable-next-line react/prop-types
                      navigateToResourceVersionForm(data[index].id)
                    }
                    className="px-2 py-0.5 rounded-md bg-stone-800"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      // eslint-disable-next-line react/prop-types
                      resourceDelete(data[index].id)
                    }
                    className="px-2 py-0.5 rounded-md bg-stone-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
        <div className="relative bg-stone-100 rounded-xl">
          <img src="/asset/blank_square.svg" alt="" />
          <button
            type="button"
            onClick={() => navigateToResourceForm()}
            className="absolute left-0 right-0 top-0 bottom-0 w-4/5 h-4/5 m-auto bg-white backdrop-filter rounded-xl p-1 text-5xl font-light text-stone-700 transform transition duration-500 hover:scale-105"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageGrid;
