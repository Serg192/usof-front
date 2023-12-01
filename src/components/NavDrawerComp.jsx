import React from "react";
import { useState } from "react";
import { Button, Drawer, IconButton, Divider } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { theme } from "../theme";
import { Link } from "react-router-dom";

const NavDrawerComp = ({ tabs }) => {
  const [dOpen, setDOpen] = useState(false);
  let tabsSectionEnd = false;

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
          <>
            {t.type === "btn" && !tabsSectionEnd && (
              <Divider sx={{ mt: "40px" }} />
            )}
            {t.type === "btn" && !tabsSectionEnd && (tabsSectionEnd = true)}
            <Link to={`${t.link}`}>
              <Button
                key={t.name}
                color="primary"
                sx={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  mt: "10px",
                  color: t.type === "tab" ? "primary" : "red",
                }}
                onClick={() => setDOpen(false)}
              >
                {t.name}
              </Button>
            </Link>
          </>
        ))}
      </Drawer>
      <IconButton onClick={() => setDOpen(!dOpen)} color="warning">
        <MenuIcon />
      </IconButton>
    </React.Fragment>
  );
};

export default NavDrawerComp;
