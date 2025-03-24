import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import GuidedMeditation from "./components/GuidedMeditation";
import QuietConnect from "./components/QuietConnect";
import Chat from "./components/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meditation" element={<GuidedMeditation />} />
        <Route path="/quietconnect" element={<QuietConnect />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
