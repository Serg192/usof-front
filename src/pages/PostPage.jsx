import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetPostCommentsMutation,
  useGetPostDataMutation,
} from "../features/posts/postsApiSlice";
import {
  CommentView,
  ConfirmationDialog,
  EditComment,
  PostView,
  PublicationControlPanel,
} from "../components";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import {
  selectCurrentToken,
  selectcurrentId,
} from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { theme } from "../theme";
import { useDeleteCommentMutation } from "../features/comments/commentsApiSlice";

const PostPage = () => {
  const { post_id } = useParams();

  const [getPostData] = useGetPostDataMutation();
  const [getPostComments] = useGetPostCommentsMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [createComment, setCreateComment] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [editCommentId, setEditCommentId] = useState(undefined);
  const [currentDeleteComment, setCurrentDeleteComment] = useState();

  let loggedIn = useSelector(selectCurrentToken) != null;
  const user_id = useSelector(selectcurrentId);

  const loadPostData = async () => {
    try {
      const postData = await getPostData(post_id).unwrap();
      setPost({
        id: postData.id,
        title: postData.post_title,
        date: new Date(postData.post_publish_date).toDateString(),
        content: postData.post_content,
        userName: "PLACEHOLDER",
        userAvatar: "PLACEHOLDER",
        categories: postData.postCategories,
        userId: postData.user_id,
        likes: postData.likesCount,
        dislikes: postData.dislikesCount,
      });
    } catch (err) {}
  };

  const loadComments = async () => {
    try {
      const comments = await getPostComments(post_id).unwrap();
      setComments(comments);
    } catch (err) {}
  };

  const handleEditComment = (id) => {
    setEditCommentId(id);
    setCreateComment(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteComment = async () => {
    console.log("Delete comment: ", currentDeleteComment);

    try {
      await deleteComment(currentDeleteComment).unwrap();
    } catch (err) {}
    setCurrentDeleteComment(-1);
  };

  useEffect(() => {
    loadPostData();
    loadComments();
  }, []);

  useEffect(() => {
    if (!createComment || currentDeleteComment === -1) {
      loadComments();
    }
  }, [createComment, currentDeleteComment]);

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      mt="30px"
    >
      {showConfirm && (
        <ConfirmationDialog
          text={"Do you really want to delete this comment?"}
          onClose={() => {
            setShowConfirm(false);
            setCurrentDeleteComment(-1);
          }}
          onConfirm={() => {
            setShowConfirm(false);
            handleDeleteComment();
          }}
        />
      )}

      <PostView post={post} />

      {loggedIn && !createComment && (
        <Button
          onClick={() => setCreateComment(true)}
          sx={{
            color: "white",
            mt: "20px",
            backgroundColor: theme.palette.primary.light,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
            textTransform: "none",
            fontSize: "18px",
          }}
        >
          Add comment
        </Button>
      )}

      {createComment && (
        <EditComment
          postId={post_id}
          commentId={editCommentId}
          setCommentId={setEditCommentId}
          setShowEdit={setCreateComment}
        />
      )}

      {comments.length > 0 && (
        <Stack direction="column" spacing="50px" mt="20px">
          {comments.map((c) => (
            <Stack direction="column">
              <Box alignSelf="end">
                {user_id === c.comment_author.id && (
                  <PublicationControlPanel
                    onEdit={() => handleEditComment(c.id)}
                    onDelete={() => {
                      setShowConfirm(true);
                      setCurrentDeleteComment(c.id);
                    }}
                  />
                )}
              </Box>
              <CommentView comment={c} />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default PostPage;
