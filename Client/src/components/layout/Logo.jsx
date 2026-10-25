import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/user/dashboard"
      className="group flex items-center gap-3 select-none"
      title="User Dashboard"
    >
      {/* Logo Image */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 opacity-0 blur-md transition duration-500 group-hover:opacity-70" />

        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500"
            alt="Album Studio"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Brand Name */}
      <div className="leading-tight">
        <h1 className="text-xl font-extrabold tracking-tight text-gray-900 transition-all duration-300 group-hover:text-purple-700">
          Album <span className="text-purple-600">Studio</span>
        </h1>

        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-gray-400">
          Your Memories
        </p>
      </div>
    </Link>
  );
};

export default Logo;