import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-140px)]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;