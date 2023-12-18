import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import CategoryBar from "./CategoryBar";
import ImageGrid from "./ImageGrid";
import ControlPanel from "./ControlPanel";
import UserContext from "../../../contexts/UserContext";
import useGetData from "../../../hooks/useGetData";
import CategoryContext from "../../../contexts/CategoryContext";

// eslint-disable-next-line react/prop-types
function ResourceList() {
  const { userEmail } = useContext(UserContext);
  const { categoryList, setInitialCategoryList } = useContext(CategoryContext);
  const { category } = useParams();
  const [resourcesUrl, setResourcesUrl] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();
  const { value, fetchError } = useGetData(
    `${import.meta.env.VITE_SERVER_URL}/categories`
  );

  if (value.data?.categories) {
    setInitialCategoryList(value.data.categories);
  } else {
    toast.error(fetchError);
  }

  const fetchData = useCallback(async () => {
    try {
      const categoryId = categoryList.find(item => item.name === category)?._id;
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/categories/${categoryId}`
      );
      setResourcesUrl(response.data.categoryList.map(item => item.svgUrl));
      setResourcesData(response.data.categoryList);
    } catch (error) {
      toast.error(
        "There was an issue loading your data. Please try again later."
      );
    }
  }, [category, categoryList]);

  useEffect(() => {
    if (categoryList.length) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, categoryList]);

  const handleCategoryChange = newCategory => {
    navigate(`/resource-list/${newCategory}`);
  };

  const handleImageSelect = async imageId => {
    setSelectedResourceId(imageId);

    if (imageId === null) {
      setSelectedImageData(null);

      return;
    }

    try {
      const categoryId = categoryList.find(item => item.name === category)?._id;
      setSelectedCategoryId(categoryId);
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_URL
        }/categories/${categoryId}/resources/${imageId}`
      );
      setSelectedImageData(response.data);
    } catch (error) {
      toast.error(
        "There was an issue loading your data. Please try again later."
      );
    }
  };

  return (
    <div className="flex w-screen h-screen">
      <CategoryBar
        categories={categoryList ? categoryList.map(item => item.name) : []}
        activeCategory={category}
        onChangeCategory={handleCategoryChange}
      />
      <ImageGrid
        svgUrl={resourcesUrl}
        data={resourcesData}
        onImageSelect={handleImageSelect}
        categoryName={category}
        fetchData={fetchData}
      />
      <ControlPanel
        email={userEmail}
        resourceData={selectedImageData}
        categoryId={selectedCategoryId}
        resourceId={selectedResourceId}
      />
    </div>
  );
}

export default ResourceList;
