import { NavLink } from "react-router-dom";

const Navbar = () => {
  const menus = [
    {
      name: "Home",
      path: "/user/dashboard",
    },
    {
      name: "Studios",
      path: "/studios",
      isHighlight: true,
    },
    {
      name: "Albums",
      path: "/albums",
    },
    {
      name: "Services",
      path: "/services",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/support",
    },
    {
      name: "Favorites",
      path: "/favorites",
    },
    {
      name: "Book Now",
      path: "/book",
    },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">
      {menus.map((menu, index) => {
        if (menu.isHighlight) {
          return (
            <NavLink
              key={index}
              to={menu.path}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all duration-200"
                  : "flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200/70 transition-all duration-200 hover:scale-[1.02]"
              }
            >
              <span>✨</span>
              <span>Studios</span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={index}
            to={menu.path}
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 font-bold transition-colors"
                : "text-gray-600 hover:text-purple-600 transition-colors"
            }
          >
            {menu.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navbar;
