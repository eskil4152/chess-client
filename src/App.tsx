import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Play from "./pages/Play";
import Game from "./pages/Game";
import User from "./pages/User";
import GameHistory from "./pages/GameHistory";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />

        <Route path="/play" element={<Play />} />
        <Route path="/game" element={<Game />} />

        <Route path="/user" element={<User />} />
        <Route path="/game-history" element={<GameHistory />} />
      </Routes>
    </>
  );
}

export default App;
