import React, { useEffect, useState } from "react";
import { IconButton, Typography, Stack, Badge } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  useCreateLikeUnderPostMutation,
  useDeletePostLikeMutation,
  useGetPostLikesMutation,
} from "../features/posts/postsApiSlice";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectcurrentId,
} from "../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateLikeUnderCommentMutation,
  useDeleteLikeUnderCommentMutation,
  useGetCommentLikesMutation,
} from "../features/comments/commentsApiSlice";

const Like = ({ postId, commentId }) => {
  const [popularity, setPopularity] = useState(0);
  const [hasLikeFromThisUser, setHasLikeFromThisUser] = useState(false);
  const [currentLikeType, setCurrentLikeType] = useState(false);
  const [getPostLikes] = useGetPostLikesMutation();
  const [createLikeUnderPost] = useCreateLikeUnderPostMutation();
  const [deletePostLike] = useDeletePostLikeMutation();
  const [getCommentLikes] = useGetCommentLikesMutation();
  const [createLikeUnderComment] = useCreateLikeUnderCommentMutation();
  const [deleteLikeUnderComment] = useDeleteLikeUnderCommentMutation();

  const isLoggedIn = useSelector(selectCurrentToken) != null;
  const userID = useSelector(selectcurrentId);
  const navigation = useNavigate();

  const handleCommentLikes = async (type) => {
    if (hasLikeFromThisUser && currentLikeType === type) {
      try {
        await deleteLikeUnderComment(commentId).unwrap();
      } catch (err) {}
      setHasLikeFromThisUser(false);
    } else {
      try {
        await createLikeUnderComment({
          commentId,
          payload: { type: type.toString() },
        }).unwrap();
      } catch (err) {}
    }
    loadLikesData();
  };

  const handlePostLikes = async (type) => {
    if (hasLikeFromThisUser && currentLikeType === type) {
      try {
        await deletePostLike(postId).unwrap();
      } catch (err) {}

      setHasLikeFromThisUser(false);
    } else {
      try {
        await createLikeUnderPost({
          postId,
          payload: { type: type.toString() },
        }).unwrap();

        // loadLikesUnderPost();
      } catch (err) {}
    }
    //loadLikesUnderPost();
    loadLikesData();
  };

  const handleLikeCreation = async (type) => {
    if (!isLoggedIn) {
      navigation("/login");
    } else {
      if (postId) handlePostLikes(type);
      if (commentId) handleCommentLikes(type);
    }
  };

  const loadLikesData = async () => {
    try {
      const likesData = postId
        ? await getPostLikes(postId).unwrap()
        : await getCommentLikes(commentId).unwrap();
      let likes = 0;
      let dislikes = 0;

      likesData.forEach((like) => {
        if (like.like_type) likes++;
        else dislikes++;
        if (like.user_id === userID) {
          setHasLikeFromThisUser(true);
          setCurrentLikeType(like.like_type);
        }
      });

      setPopularity(likes - dislikes);
    } catch (err) {}
  };

  useEffect(() => {
    loadLikesData();
  }, [postId, commentId]);

  return (
    <Stack direction="column" alignItems="center">
      <IconButton
        color={
          hasLikeFromThisUser && currentLikeType ? "info" : "primary.light"
        }
        sx={{
          "&:hover": {
            backgroundColor: "accent2.main",
          },
        }}
        onClick={() => handleLikeCreation(true)}
      >
        <ArrowUpwardIcon sx={{ transform: "scale(1.4)}" }} />
      </IconButton>
      <Typography variant="h5">{popularity}</Typography>
      <IconButton
        color={
          hasLikeFromThisUser && !currentLikeType ? "error" : "primary.light"
        }
        sx={{
          "&:hover": {
            backgroundColor: "accent2.main",
          },
        }}
        onClick={() => handleLikeCreation(false)}
      >
        <ArrowDownwardIcon sx={{ transform: "scale(1.4)}" }} />
      </IconButton>
    </Stack>
  );
};

export default Like;
