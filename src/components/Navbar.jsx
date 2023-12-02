import { useEffect, useState } from "react";
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

import { useDispatch, useSelector } from "react-redux";
import {
  logOut,
  selectCurrentToken,
  selectcurrentId,
} from "../features/auth/authSlice";

import { theme } from "../theme";

import { SearchBar, NavDrawerComp } from "./";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import { UserProfileIcon } from "./";
import { useGetUserMutation } from "../features/users/usersApiSlice";

const navbarButtons = [
  { type: "tab", name: "Tags", link: "/" },
  { type: "tab", name: "Posts", link: "/posts" },
  { type: "tab", name: "About", link: "/" },
];

const Navbar = () => {
  const [tab, setTab] = useState(0);
  const [userImage, setUserImage] = useState("");

  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  let loggedIn = useSelector(selectCurrentToken) != null;
  const userId = useSelector(selectcurrentId);

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getUser] = useGetUserMutation();

  const loadUserImage = async () => {
    const data = await getUser(userId);
    setUserImage(data.data.user_profile_picture);
  };

  useEffect(() => {
    if (loggedIn) loadUserImage();
  }, []);

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
            {!loggedIn ? (
              <>
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
              </>
            ) : (
              <Stack direction="row" spacing={5}>
                <Link to={"/"}>
                  <UserProfileIcon
                    size={40}
                    image={`http://localhost:4545/profile-images/${userImage}`}
                  />
                </Link>
                <Button
                  onClick={() => handleLogout()}
                  color="inherit"
                  sx={{
                    backgroundColor: theme.palette.accent.main,
                    "&:hover": {
                      backgroundColor: theme.palette.accent.light,
                    },
                  }}
                >
                  Log out
                </Button>
              </Stack>
            )}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
