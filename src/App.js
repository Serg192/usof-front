import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import { Navbar } from "./components";
import { Home, Login, Register, Posts } from "./pages";
import { theme } from "./theme";
import RequireAuth from "./features/auth/RequireAuth";
import ProtectedWelcome from "./features/auth/ProtectedWelcome";

const App = () => (
  <div>
    <BrowserRouter>
      <Box>
        <Navbar />
        <Routes>
          <Route path="/" exact_element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/posts" element={<Posts />} />

          <Route element={<RequireAuth />}>
            <Route path="/protected" element={<ProtectedWelcome />} />
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  </div>
);

export default App;
