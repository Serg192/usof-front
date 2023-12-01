import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { theme } from "../theme";

import { SearchBar, NavDrawerComp } from "./";
import { Link } from "react-router-dom";

const navbarButtons = [
  { type: "tab", name: "Tags", link: "/" },
  { type: "tab", name: "Posts", link: "/posts" },
  { type: "tab", name: "About", link: "/" },
  { type: "btn", name: "Log in", link: "/login" },
  { type: "btn", name: "Sign up", link: "/signup" },
];

const Navbar = () => {
  const [tab, setTab] = useState(0);

  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: { md: "space-between" },
          flexDirection: { sm: "row" },
        }}
      >
        <Typography
          variant="h5"
          fontWeight={"bold"}
          sx={{
            whiteSpace: "nowrap",
            display: { sm: "block" },
            marginRight: "25px",
          }}
        >
          Stack Trace {"{ @ }"}
          {isMatch && <NavDrawerComp tabs={navbarButtons} />}
        </Typography>
        {!isMatch && (
          <Tabs
            textColor="inherit"
            sx={{ marginRight: "auto" }}
            value={tab}
            onChange={(e, val) => {
              setTab(val);
            }}
            indicatorColor="secondary"
          >
            {navbarButtons.map(
              (tab) =>
                tab.type === "tab" && (
                  <Tab
                    key={tab.name}
                    label={tab.name}
                    component={Link}
                    to={`${tab.link}`}
                  />
                )
            )}
          </Tabs>
        )}

        <SearchBar />
        {!isMatch && (
          <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
            <Link to={"/login"}>
              <Button
                color="primary"
                sx={{
                  backgroundColor: theme.palette.accent2.main,
                  "&:hover": {
                    backgroundColor: theme.palette.accent2.light,
                  },
                }}
              >
                Log in
              </Button>
            </Link>

            <Link to={"/signup"}>
              <Button
                color="inherit"
                sx={{
                  backgroundColor: theme.palette.accent.main,
                  "&:hover": {
                    backgroundColor: theme.palette.accent.light,
                  },
                }}
              >
                Sign up
              </Button>
            </Link>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
