import { IconButton, Paper, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

const PublicationControlPanel = ({ onEdit, onDelete }) => {
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
        <Tooltip title="Edit">
          <IconButton color="primary" onClick={() => onEdit()}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" onClick={() => onDelete()}>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  );
};

export default PublicationControlPanel;
