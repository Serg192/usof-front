import React from "react";
import { Stack, Avatar, Typography, Rating } from "@mui/material";

const UserProfileIcon = ({ image, name, rating, size }) => {
  return (
    <Stack
      direction="column"
      alignItems="center"
      sx={{
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      <Avatar src={image} alt={name} sx={{ width: size, height: size }} />
      {name && (
        <Typography variant="subtitle1" mt={1}>
          {name}
        </Typography>
      )}
      {rating && (
        <Rating
          name="user-rating"
          value={rating}
          readOnly
          size="small"
          sx={{ mt: 1 }}
        />
      )}
    </Stack>
  );
};

export default UserProfileIcon;
