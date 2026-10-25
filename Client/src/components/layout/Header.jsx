import Logo from "./Logo";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";

const Header = () => {

 const [isOpen, setIsOpen] =useState(false);   

return(

<header className="sticky top-0 bg-white shadow z-50">

<div className="max-w-7xl mx-auto h-16 px-5 flex justify-between items-center">

<Logo/>

<Navbar/>

<SearchBar/>

<div className="flex items-center gap-5">

<NotificationBell/>

<ProfileDropdown/>

<MobileMenu onClick={() => setIsOpen(true)} />

</div>

</div>
<MobileSidebar
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
</header>

)

}

export default Header;