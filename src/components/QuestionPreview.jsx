import React from "react";
import { Link } from "react-router-dom";
import { Paper, Typography, Avatar, Box, Divider, Stack } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CategoryChip from "./CategoryChip";

const QuestionPreview = ({
  title,
  author,
  author_img,
  date,
  likes,
  categories,
  postId,
}) => {
  // Define the route path based on postId
  const routePath = `/posts/${postId}`;

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
      <Link to={`/posts/${postId}`}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar
            src={`http://localhost:4545/profile-images/${author_img}`}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {author} asked on {date}
          </Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Stack direction="row" width="100%" alignItems="center" flexWrap="wrap">
          {categories.map((cat, index) => (
            <CategoryChip key={index} name={cat.category_title} size="15px" />
          ))}
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArrowDropUpIcon sx={{ fontSize: 43 }} />
          <Typography variant="body2" sx={{ mr: 2 }}>
            {likes} popularity
          </Typography>
        </Box>
      </Link>
    </Paper>
  );
};

export default QuestionPreview;
