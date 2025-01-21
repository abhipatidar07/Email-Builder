// import React, { useState } from 'react';
import Home from "./pages/Home";
import "./App.css";
import SavedTemplates from "./pages/SavedTemplates";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saved-templates" element={<SavedTemplates />} />
        
      </Routes>
    </div>
  );
}

export default App;
