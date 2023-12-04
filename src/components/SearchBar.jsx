import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const makeSearch = () => {
    const attr = searchValue.length ? `?search=${searchValue}` : "";
    navigate(`/posts${attr}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      makeSearch();
    }
  };
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
          width: { md: "200px", lg: "500px", sx: "100px" },
          "&:hover": {
            border: "2px solid #e3e3e3",
          },
        }}
        onKeyDown={handleKeyPress}
        onChange={(e) => setSearchValue(e.target.value)}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <IconButton
              aria-label="search"
              color="inherit"
              sx={{ p: 0 }}
              onClick={() => makeSearch()}
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
