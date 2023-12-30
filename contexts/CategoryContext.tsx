import { useState, createContext, ReactNode } from "react";

interface CategoryItem {
  id: string;
  name: string;
}

interface CategoryContextType {
  categories: CategoryItem[];
}

interface CategoryContextProviderProps {
  children: ReactNode;
}
const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryContextProvider({
  children,
}: CategoryContextProviderProps) {
  const [categoryList, setCategoryList] = useState<CategoryContextType | null>(
    []
  );

  const setInitialCategoryList = (arr: CategoryContextType) => {
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
