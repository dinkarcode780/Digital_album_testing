import React from 'react'
import MainLayout from './layouts/MainLayout'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/common/ScrollToTop'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
     <ScrollToTop />
    <AppRoutes/>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        newestOnTop
        pauseOnHover
      />
    </>
  )
}

export default App