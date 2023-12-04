import { Avatar, Divider, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Like from "./Like";
import PublicationControlPanel from "./PublicationControlPanel";

const CommentView = ({ comment }) => {
  const { id, comment_content, comment_publish_date, comment_author } = comment;
  const { user_login, user_profile_picture, user_rating } = comment_author;

  console.log("Comment aut: ", comment_author);

  return (
    <Paper
      elevation={2}
      sx={{ width: { lg: "950px", md: "800px", xs: "95%" }, p: "10px" }}
    >
      <Stack direction="row" alignItems="center" spacing="30px">
        <Like commentId={id} />
        <Typography component="div" sx={{ fontSize: "18px", mt: "10px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {comment_content}
          </ReactMarkdown>
        </Typography>
      </Stack>
      <Divider sx={{ mt: "10px" }} />
      <Stack direction="row" mt="10px" justifyContent="space-between">
        <Typography variant="h6" color="primary.light">
          Answered: {new Date(comment_publish_date).toDateString()}
        </Typography>
        <Stack direction="row" alignItems="center" spacing="5px">
          <Avatar
            alt={`${user_login}'s avatar`}
            src={`http://localhost:4545/profile-images/${user_profile_picture}`}
            sx={{ width: "44px", height: "40px" }}
          />
          <Stack direction="column">
            <Typography variant="h6" color="primary.light">
              {user_login}
            </Typography>
            <Typography variant="h6" color="accent.main">
              {user_rating}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CommentView;
