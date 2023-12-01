import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  Box,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const QuestionPreview = ({
  title,
  author,
  date,
  likes,
  comments,
  categories,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "50%",

        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Avatar sx={{ mr: 1 }} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {author} asked on {date}
        </Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {categories.map((category, index) => (
          <Chip
            key={index}
            label={category}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          />
        ))}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ArrowDropUpIcon sx={{ fontSize: 43 }} />
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likes} votes
        </Typography>
        <ChatBubbleOutlineIcon />

        <Typography variant="body2">{comments} Comments</Typography>
      </Box>
    </Paper>
  );
};

export default QuestionPreview;
