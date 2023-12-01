import React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
  return (
    <div>
      <TextField
        className="text"
        placeholder="Search..."
        variant="standard"
        size="small"
        sx={{
          backgroundColor: "white",
          borderRadius: "20px",
          border: "2px solid #e3e3e3",
          boxShadow: "none",
          p: "1px 10px",
          width: { md: "200px", lg: "600px", sx: "100px" },
          "&:hover": {
            border: "2px solid #e3e3e3",
          },
        }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <IconButton
              aria-label="search"
              color="inherit"
              sx={{ p: 0 }}
              onClick={() => {
                // Handle search button click event
                console.log("Search button clicked!");
              }}
            >
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
