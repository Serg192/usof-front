import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import { Navbar } from "./components";
import {
  Home,
  Login,
  Register,
  Posts,
  AskQuestion,
  PostPage,
  User,
  Users,
} from "./pages";
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
          <Route path="/posts/:post_id" element={<PostPage />} />
          <Route path="/user/:userId" element={<User />} />
          <Route path="/users" element={<Users />} />

          <Route element={<RequireAuth />}>
            <Route path="/protected" element={<ProtectedWelcome />} />
            <Route path="/newQuestion" element={<AskQuestion />} />
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  </div>
);

export default App;
