import React from "react";
import { Stack, Avatar, Typography, Rating, Box } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const UserProfileIcon = ({ image, name, rating, size }) => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{
        "&:hover": {
          transform: "scale(1.1)",
        },
        border: "2px solid gray",
        borderRadius: "50px",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Avatar src={image} alt={name} sx={{ width: size, height: size }} />
      {name && (
        <Typography variant="h6" color="primary.light" mt={1} fontWeight="bold">
          {name}
        </Typography>
      )}
      {rating !== undefined && (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            color="primary.light"
            sx={{ fontWeight: "bold" }}
          >
            {rating}
          </Typography>
          <EmojiEventsIcon sx={{ ml: 0.5, color: "#FFD700", fontSize: 26 }} />
        </Box>
      )}
    </Stack>
  );
};

export default UserProfileIcon;
