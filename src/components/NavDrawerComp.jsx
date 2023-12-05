import React from "react";
import { useState } from "react";
import { Button, Drawer, IconButton, Divider, Box } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { theme } from "../theme";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentToken } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";

const tabItemStyle = (color) => {
  return {
    fontSize: "17px",
    fontWeight: "bold",
    mt: "10px",
    color,
  };
};

const NavDrawerComp = ({ tabs }) => {
  const [dOpen, setDOpen] = useState(false);
  let tabsSectionEnd = false;

  let loggedIn = useSelector(selectCurrentToken) != null;

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.log(err);
    }

    dispatch(logOut());
    navigate("/login");
  };

  return (
    <React.Fragment>
      <Drawer
        open={dOpen}
        onClose={() => setDOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 100,
          },
        }}
      >
        {tabs.map((t) => (
          <Box key={t.id}>
            <Link to={`${t.link}`}>
              <Button
                key={t.name}
                color="primary"
                sx={tabItemStyle("primary")}
                onClick={() => setDOpen(false)}
              >
                {t.name}
              </Button>
            </Link>
          </Box>
        ))}
        <Divider sx={{ mt: "40px" }} />
        {loggedIn ? (
          <Button
            onClick={() => handleLogout()}
            color="inherit"
            sx={tabItemStyle("red")}
          >
            Log out
          </Button>
        ) : (
          <>
            <Link to={"/login"}>
              <Button color="primary" sx={tabItemStyle("red")}>
                Log in
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button color="inherit" sx={tabItemStyle("red")}>
                Sign up
              </Button>
            </Link>
          </>
        )}
      </Drawer>
      <IconButton onClick={() => setDOpen(!dOpen)} color="warning">
        <MenuIcon />
      </IconButton>
    </React.Fragment>
  );
};

export default NavDrawerComp;
