import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">

      <FaSearch className="text-gray-500"/>

      <input
      type="text"
      placeholder="Search Album..."
      className="bg-transparent outline-none ml-2"
      />

    </div>
  );
};

export default SearchBar;