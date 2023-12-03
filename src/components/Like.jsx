import React, { useEffect, useState } from "react";
import { IconButton, Typography, Stack, Badge } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  useCreateLikeUnderPostMutation,
  useGetPostLikesMutation,
} from "../features/posts/postsApiSlice";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectcurrentId,
} from "../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";

const Like = ({ postId }) => {
  console.log("LIKE: ", postId);
  const [popularity, setPopularity] = useState(0);
  const [hasLikeFromThisUser, setHasLikeFromThisUser] = useState(false);
  const [currentLikeType, setCurrentLikeType] = useState(false);
  const [getPostLikes] = useGetPostLikesMutation();
  const [createLikeUnderPost] = useCreateLikeUnderPostMutation();

  const isLoggedIn = useSelector(selectCurrentToken) != null;
  const userID = useSelector(selectcurrentId);
  const navigation = useNavigate();
  const handleLikeCreation = async (type) => {
    console.log("like creation: ", type);
    if (!isLoggedIn) {
      navigation("/login");
    }
    try {
      await createLikeUnderPost({
        postId,
        payload: { type: type.toString() },
      }).unwrap();

      loadLikesUnderPost();
    } catch (err) {}
  };

  const loadLikesUnderPost = async () => {
    try {
      const postLikesData = await getPostLikes(postId).unwrap();
      let likes = 0;
      let dislikes = 0;

      console.log("POST LIKES DATA ", postLikesData);
      postLikesData.forEach((like) => {
        if (like.like_type) likes++;
        else dislikes++;
        if (like.user_id === userID) {
          setHasLikeFromThisUser(true);
          setCurrentLikeType(like.like_type);
        }
      });

      console.log(`likes: ${likes}, dislikes: ${dislikes}`);
      setPopularity(likes - dislikes);
    } catch (err) {}
  };

  useEffect(() => {
    loadLikesUnderPost();
  }, [postId]);

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
