import { Button, Paper, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../theme";
import { useCreatePostCommentMutation } from "../features/posts/postsApiSlice";
import { useNavigate } from "react-router-dom";
import {
  useGetCommentMutation,
  useUpdateCommentMutation,
} from "../features/comments/commentsApiSlice";

const btnStyle = {
  color: "white",
  mt: "20px",
  backgroundColor: theme.palette.primary.light,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  textTransform: "none",
  fontSize: "18px",
};

const EditComment = ({ postId, setShowEdit, commentId, setCommentId }) => {
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommenError] = useState(false);

  const [createComment] = useCreatePostCommentMutation();
  const [getComment] = useGetCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const handleAddComment = async () => {
    if (commentText.length < 16) {
      setCommenError(true);
    } else {
      if (!commentId) {
        try {
          await createComment({ postId, commentText }).unwrap();
        } catch (err) {}
      } else {
        try {
          await updateComment({ commentId, commentText }).unwrap();
        } catch (err) {}
      }
      setShowEdit(false);
      setCommentId(undefined);
    }
  };

  const handleLoadCommentData = async () => {
    try {
      const commentData = await getComment(commentId);
      setCommentText(commentData.data.comment_content);
      console.log("IT IS EDIT: ", commentText);
    } catch (err) {}
  };
  useEffect(() => {
    if (commentId) {
      handleLoadCommentData();
    }
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        width: { lg: "950px", md: "800px", xs: "95%" },
        mt: "20px",
        p: "10px",
      }}
    >
      <TextField
        label="Comment"
        variant="outlined"
        multiline
        rows={8}
        fullWidth
        margin="normal"
        onChange={(e) => setCommentText(e.target.value)}
        value={commentText}
        InputProps={{ style: { fontSize: "20px" } }}
        error={commentError}
        helperText={
          commentError && "Comment should have at least 16 characters"
        }
        onFocus={() => setCommenError(false)}
      />
      <Stack direction="row" spacing="30px" justifyContent="center" mt="10px">
        <Button sx={btnStyle} onClick={() => handleAddComment()}>
          Save
        </Button>
        <Button
          sx={btnStyle}
          onClick={() => {
            setShowEdit(false);
            setCommentId(undefined);
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Paper>
  );
};

export default EditComment;
