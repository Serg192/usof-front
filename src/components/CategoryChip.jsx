import React from "react";
import { Chip } from "@mui/material";
import { theme } from "../theme";

const CategoryChip = ({ name }) => {
  return (
    <Chip
      label={name}
      style={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary.main,
        margin: "4px",
        fontSize: "19px",
        fontWeight: "bold",
      }}
    />
  );
};

export default CategoryChip;
