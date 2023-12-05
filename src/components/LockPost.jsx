import { IconButton, Paper, Tooltip } from "@mui/material";
import React from "react";

import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const LockPost = ({ isActive, onActiveClicked, onLockCliked }) => {
  const onBtnClick = isActive
    ? () => {
        onActiveClicked();
      }
    : () => {
        onLockCliked();
      };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      <div style={{ marginTop: "16px" }}>
        <Tooltip title={isActive ? "Lock" : "Unlock"}>
          <IconButton onClick={() => onBtnClick()}>
            {isActive ? (
              <LockOpenIcon sx={{ color: "green" }} />
            ) : (
              <LockIcon sx={{ color: "error.main" }} />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  );
};

export default LockPost;
