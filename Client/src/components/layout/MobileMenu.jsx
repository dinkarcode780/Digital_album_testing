import { FaBars } from "react-icons/fa";

const MobileMenu = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden"
    >
      <FaBars size={24} />
    </button>
  );
};

export default MobileMenu;