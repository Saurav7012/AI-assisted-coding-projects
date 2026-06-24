import { useEffect, useState } from "react";
import {createRoot} from "react-dom/client"
import Crypto from "./Crypto";
import Coin from "./Coin";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router";



function App(){

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/crypto" element={<Crypto/>}></Route>
                <Route path="/crypto/:name" element={<Coin/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}








createRoot(document.getElementById("root")).render(<App/>);