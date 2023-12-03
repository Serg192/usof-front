import React from "react";
import { Chip } from "@mui/material";
import { theme } from "../theme";

const CategoryChip = ({ name, size = "19px" }) => {
  return (
    <Chip
      label={name}
      style={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        margin: "4px",
        fontSize: size,
        fontWeight: "bold",
      }}
    />
  );
};

export default CategoryChip;
