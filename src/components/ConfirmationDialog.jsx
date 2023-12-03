import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { theme } from "../theme";

const makeBtnStyle = (color, hoverColor) => {
  return {
    color: "white",
    mt: "20px",
    backgroundColor: color,
    "&:hover": {
      backgroundColor: hoverColor,
    },
    textTransform: "none",
    fontSize: "18px",
  };
};

const ConfirmationDialog = ({ text, open = () => {}, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle variant="h4" color="primary.light">
        Confirmation
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="h6" color="primary.main">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={makeBtnStyle("primary.light", "primary.main")}
          onClick={onClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          sx={makeBtnStyle("error.light", "error.main")}
          onClick={onConfirm}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
