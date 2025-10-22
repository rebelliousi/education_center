import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./sections/HeroSection";
import Courses from "./sections/Courses";
import Activities from "./sections/Activities";
import Videos from "./sections/Videos";
import Teachers from "./sections/Teachers";
import Discounts from "./sections/Discount";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import AllCoursesPage from "./pages/AllCoursesPage"; // <- Tüm kurslar için ayrı sayfa

export const App = () => {
  return (
    <>
      <Navbar />
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
            <>
              <AllCoursesPage />
              <Footer />
            </>
          }
        />
        {/* ... Diğer sayfalar (isteğe bağlı) */}
      </Routes>
</>
  );
};