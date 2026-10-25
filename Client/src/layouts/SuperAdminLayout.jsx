import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "../components/layout/superadmin/SuperAdminSidebar";
import SuperAdminMobileSidebar from "../components/layout/superadmin/SuperAdminMobileSidebar";
import SuperAdminHeader from "../components/layout/superadmin/SuperAdminHeader";
import AdminFooter from "../components/layout/admin/AdminFooter";

const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50/70">

      {/* Desktop Sidebar */}

      <div className="hidden lg:block">
        <SuperAdminSidebar />
      </div>

      {/* Mobile Sidebar */}

      <SuperAdminMobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right Section */}

      <div className="flex-1 flex flex-col min-w-0 lg:ml-72">

        <SuperAdminHeader
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}

        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <Outlet />
        </main>

        <AdminFooter />

      </div>

    </div>
  );
};

export default SuperAdminLayout;
