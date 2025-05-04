import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Navbar from "./Navbar";
import About from "./About";
import Contact from "./Contact";

function Main() {

    return (
        <>
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Navbar />
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Main;

