import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Hero from "./sections/HeroSection";
import Courses from "./sections/Courses";
import Activities from "./sections/Activities";
import Videos from "./sections/Videos";
import Teachers from "./sections/Teachers";
import Discounts from "./sections/Discount";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

// Lazy loaded pages
const AllCoursesPage = lazy(() => import("./pages/AllCoursesPage"));
const AllVideosPage = lazy(() => import("./pages/AllVideosPage"));
const AllTeachersPage = lazy(() => import("./pages/AllTeachersPage"));
const BannerDetailPage = lazy(() => import("./pages/BannerDetail"));

// Basit bir center spinner
function CenterSpinner() {
  return (
    <div className="flex items-center justify-center w-full py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
}

export const App = () => {
  return (
    <>
     
      <Routes>
        {/* Ana sayfa */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Courses />
              <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100">
                <Activities />
                <Videos />
              </div>
              <Teachers />
              <Discounts />
              <Contact />
              <Footer />
            </>
          }
        />
        {/* Tüm Kurslar sayfası */}
        <Route
          path="/courses"
          element={
            <Suspense fallback={<CenterSpinner />}>
              <AllCoursesPage />
              <Footer />
            </Suspense>
          }
        />
        {/* Tüm Videolar sayfası */}
        <Route
          path="/videos"
          element={
            <Suspense fallback={<CenterSpinner />}>
              <AllVideosPage />
              <Footer />
            </Suspense>
          }
        />
        {/* Tüm Öğretmenler sayfası */}
        <Route
          path="/teachers"
          element={
            <Suspense fallback={<CenterSpinner />}>
              <AllTeachersPage />
              <Footer />
            </Suspense>
          }
        />
        {/* Banner Detay Sayfası */}
        <Route
          path="/banner/:id"
          element={
            <Suspense fallback={<CenterSpinner />}>
              <BannerDetailPage />
              <Footer />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
};