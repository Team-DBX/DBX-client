// eslint-disable-next-line react/prop-types
function CategoryBar({ categories, activeCategory, onChangeCategory }) {
  return (
    <div className="grid grid-rows-5 grid-flow-col pl-6 pr-6 w-1/5 h-full">
      <div className="row-start-2 row-span-2 border-t-2 border-stone-400">
        <ul className="mt-6">
          {/* eslint-disable-next-line react/prop-types */}
          {categories.map(category => (
            <li key={category} className="hover:bg-stone-200">
              <button
                type="button"
                className={`ml-7 mb-1 text-xl text-stone-500 cursor-default ${
                  activeCategory === category ? "font-bold text-stone-800" : ""
                }`}
                onClick={() => onChangeCategory(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryBar;
