import {
  useState,
  useMemo,
  createContext,
  ReactNode,
  useCallback,
} from "react";

interface CategoryItem {
  id: string;
  name: string;
}

interface CategoryContextType {
  categoryList: CategoryItem[] | null;
  setInitialCategoryList: (data: CategoryItem[]) => void;
}

interface CategoryContextProviderProps {
  children: ReactNode;
}
const CategoryContext = createContext<CategoryContextType | null>(null);

export function CategoryContextProvider({
  children,
}: CategoryContextProviderProps) {
  const [categoryList, setCategoryList] = useState<CategoryItem[] | null>([]);

  const setInitialCategoryList = useCallback((data: CategoryItem[]) => {
    setCategoryList(data);
  }, []);
  const value = useMemo(
    () => ({
      categoryList,
      setInitialCategoryList,
    }),
    [categoryList, setInitialCategoryList]
  );
  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export default CategoryContext;
