import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BeatLoader,
  PulseLoader,
  SyncLoader,
  BarLoader,
} from "react-spinners";
import { useLoading } from "./contexts/LoadingContext";

const Layout = ({ children }) => {
  const { loading } = useLoading();
  useEffect(() => {
    Main();
  }, [])
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar />
        <div className="layout-page ">
          <Navbar />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <ToastContainer />
              {children}
            </div>
            <Footer />
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle"></div>
      </div>
      {loading && (
        <div className="loading-overlay">
          {/* <BeatLoader color="#6c5ce7" loading={loading} size={15} /> */}
          {/* <PulseLoader color="#0984e3" loading={loading} size={15} /> */}

          <SyncLoader color="var(--color-hover)" loading={loading} size={15} />


          {/* <BarLoader color="#00b894" loading={loading} width={150} /> */}
        </div>
      )}
    </div>
  );
};

export default Layout;
