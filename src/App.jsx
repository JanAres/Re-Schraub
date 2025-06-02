// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import Navbar from "./components/Header.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Info from "./pages/Info.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import News from "./pages/News.jsx";
import Contact from "./pages/Contact.jsx";
import Impressum from "./pages/Impressum.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Footer from "./pages/Footer.jsx";

function App() {
    return (
        <LanguageProvider>
            {/** ScrollToTop muss hier stehen – und darf nicht außerhalb eines Routers liegen. */}
            <ScrollToTop />

            <Navbar />
            <Info />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/news" element={<News />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="/about-us" element={<AboutUs />} />
            </Routes>

            <Footer />
        </LanguageProvider>
    );
}

export default App;
