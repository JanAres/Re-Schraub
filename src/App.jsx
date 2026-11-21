import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import useIsMobile from "./components/useIsMobile";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Info from "./pages/Info";
import AboutUs from "./pages/AboutUs";
import Products from "./pages/Products";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Newsletter from "./Newsletter.jsx";
import Impressum from "./pages/Impressum";
import Footer from "./pages/Footer";

function AppContent() {
    const isMobile = useIsMobile(900);
    const location = useLocation();

    const isAboutPage =
        location.pathname === "/" || location.pathname === "/about-us";

    return (
        <div className={`app-container${isAboutPage ? " app-container--about" : ""}`}>
            <Navbar animateBuild={isAboutPage} />
            <ScrollToTop />

            {!isMobile && !isAboutPage && <Info />}

            <main className="app-main">
                <Routes>
                    <Route path="/" element={<AboutUs footer={<Footer />} companyCard={!isMobile ? <Info /> : null} />} />
                    <Route path="/about-us" element={<AboutUs footer={<Footer />} companyCard={!isMobile ? <Info /> : null} />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/impressum" element={<Impressum />} />
                </Routes>
            </main>

            {!isAboutPage && <Footer />}
        </div>
    );
}

function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;