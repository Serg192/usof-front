import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

const Tag = ({ title, description, used }) => {
  return (
    <Paper
      elevation={10}
      sx={{
        width: { lg: "950px", md: "800px", xs: "95%" },
        p: "10px",
        pt: "0px",
        borderRadius: "20px",
      }}
    >
      <Stack direction="column" alignItems="center">
        <Typography
          variant="h4"
          color="secondary.main"
          p="10px"
          sx={{
            width: "100%",
            backgroundColor: "primary.light",
            borderRadius: "20px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body"
          mt="10px"
          alignSelf="start"
          sx={{ fontSize: "25px", width: "100%", wordBreak: "break-all" }}
        >
          {description}
        </Typography>
        <Typography
          color="primary.light"
          variant="body2"
          sx={{
            mt: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            width: "100%",
            wordBreak: "break-all",
          }}
        >
          Used: {used} times
        </Typography>
      </Stack>
    </Paper>
  );
};

export default Tag;
