import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/App.css";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Index from "./pages/Index";
import Play from "./pages/games/Play";
import Game from "./pages/games/Game";
import User from "./pages/user/User";
import GameHistory from "./pages/user/GameHistory";
import Header from "./components/Header";
import LockedRoute from "./components/LockedRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<LockedRoute />}>
          <Route path="/" element={<Index />} />

          <Route path="/play" element={<Play />} />
          <Route path="/game" element={<Game />} />

          <Route path="/user" element={<User />} />
          <Route path="/game-history" element={<GameHistory />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
