import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const StackTraceAd = ({ height, width }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        height,
        width,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack direction="column" alignItems="flex-start" spacing={3}>
        <Typography variant="h4">Join the Stack Trace community</Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <QuestionAnswerIcon color="info" sx={{ fontSize: 40 }} />
          <Typography variant="h5">Ask questions</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <SwapVertIcon color="info" sx={{ fontSize: 43 }} />
          <Typography variant="h5">Vote for the best answers</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <EmojiEventsIcon color="info" sx={{ fontSize: 40 }} />
          <Typography variant="h5">Earn reputation</Typography>
        </Stack>
        <Typography variant="h5">More features coming soon</Typography>
      </Stack>
    </Paper>
  );
};

export default StackTraceAd;
