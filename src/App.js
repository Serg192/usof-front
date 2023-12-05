import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import { Navbar } from "./components";
import {
  Login,
  Register,
  Posts,
  AskQuestion,
  PostPage,
  User,
  Users,
  Tags,
  ResetPassword,
} from "./pages";
import RequireAuth from "./features/auth/RequireAuth";

const App = () => (
  <div>
    <BrowserRouter>
      <Box>
        <Navbar />
        <Routes>
          <Route index element={<Posts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:post_id" element={<PostPage />} />
          <Route path="/user/:userId" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/passwordReset" element={<ResetPassword />} />

          <Route element={<RequireAuth />}>
            <Route path="/question/:question_id" element={<AskQuestion />} />
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  </div>
);

export default App;
