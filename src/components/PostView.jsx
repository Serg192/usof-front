import { Avatar, Divider, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CategoryChip from "./CategoryChip";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Like from "./Like";
import { useGetUserMutation } from "../features/users/usersApiSlice";

const PostView = ({ post }) => {
  const { title, date, content, categories, userId, likes, dislikes } = post;

  const [getUser] = useGetUserMutation();
  const [user, setUser] = useState();
  const [userPicture, setUserPicture] = useState();

  const loadUserData = async () => {
    if (userId) {
      console.log("ididididid:", userId);
      const userData = (await getUser(userId)).data;
      console.log(userData);
      setUser(userData?.user_login);
      setUserPicture(userData?.user_profile_picture);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);
  return (
    <Paper
      elevation={0}
      sx={{ width: { lg: "950px", md: "800px", xs: "95%" } }}
    >
      <Typography variant="h2">{title}</Typography>
      <Stack direction="row" spacing="10px" mt="10px" alignItems="center">
        {categories &&
          categories.map((category) => (
            <CategoryChip name={category.category_title} />
          ))}
      </Stack>
      <Stack
        direction="row"
        mt="10px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing="5px">
          <Avatar
            alt={`${user}'s avatar`}
            src={`http://localhost:4545/profile-images/${userPicture}`}
            sx={{ width: "54px", height: "54px" }}
          />
          <Typography variant="h6" color="primary.light">
            {user}
          </Typography>
        </Stack>
        <Typography variant="h6" color={"primary.light"}>
          Date: {date}
        </Typography>
      </Stack>
      <Divider sx={{ mt: "15px", width: "100%", borderWidth: "1.5px" }} />
      <Stack direction="row" alignItems="center" spacing="30px">
        <Like />
        <Typography component="div" sx={{ fontSize: "18px", mt: "10px" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Typography>
      </Stack>
      <Divider sx={{ mt: "15px", width: "100%", borderWidth: "1.5px" }} />
    </Paper>
  );
};

export default PostView;
