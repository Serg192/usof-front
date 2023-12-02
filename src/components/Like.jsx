import React, { useState } from "react";
import { IconButton, Typography, Stack, Badge } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Like = () => {
  const [votes, setVotes] = useState(0);

  const handleVote = (increment) => {
    setVotes((prevVotes) => prevVotes + increment);
  };

  return (
    <Stack direction="column" alignItems="center">
      <IconButton
        color="primary.light"
        sx={{
          "&:hover": {
            backgroundColor: "accent2.main",
          },
        }}
        onClick={() => handleVote(1)}
      >
        <ArrowUpwardIcon sx={{ transform: "scale(1.4)}" }} />
      </IconButton>
      <Typography variant="h5">{votes}</Typography>
      <IconButton
        color="primary.light"
        sx={{
          "&:hover": {
            backgroundColor: "accent2.main",
          },
        }}
        onClick={() => handleVote(-1)}
      >
        <ArrowDownwardIcon sx={{ transform: "scale(1.4)}" }} />
      </IconButton>
    </Stack>
  );
};

export default Like;
