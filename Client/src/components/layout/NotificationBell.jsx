import { IoNotificationsOutline } from "react-icons/io5";

const NotificationBell = () => {
  return (
    <button className="relative">
      <IoNotificationsOutline size={25} />

      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
        3
      </span>
    </button>
  );
};

export default NotificationBell;
