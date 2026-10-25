import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/layout/admin/Adminsidebar";
import AdminMobileSidebar from "../components/layout/admin/AdminMobileSidebar";
import AdminHeader from "../components/layout/admin/AdminHeader";
import AdminFooter from "../components/layout/admin/AdminFooter";

const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="flex min-h-screen bg-gray-100">
      

      {/* Desktop Sidebar */}

      {/* <AdminSidebar />
       */}
        <div className="hidden lg:block">
    <AdminSidebar />
  </div>

      {/* Mobile Sidebar */}

      <AdminMobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right */}

      {/* <div className="flex-1 flex flex-col lg:ml-72"> */}
       <div className="flex-1 flex flex-col min-w-0 lg:ml-72">


        <AdminHeader
          setSidebarOpen={setSidebarOpen}
        />

        {/* <main className="flex-1 p-6"> */}
            <main className="flex-1 p-4 md:p-6 overflow-x-auto">


          <Outlet />

        </main>

        <AdminFooter />

      </div>

    </div>

  );

};

export default AdminLayout;