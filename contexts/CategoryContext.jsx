import { useState, createContext } from "react";

const CategoryContext = createContext();

// eslint-disable-next-line react/prop-types
export function CategoryContextProvider({ children }) {
  const [categoryList, setCategoryList] = useState([]);

  const setInitialCategoryList = arr => {
    setCategoryList(arr);
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CategoryContext.Provider value={{ categoryList, setInitialCategoryList }}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryContext;
