import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetPostDataMutation } from "../features/posts/postsApiSlice";
import { PostView } from "../components";
import { Stack, Typography } from "@mui/material";

const PostPage = () => {
  const { post_id } = useParams();

  const [getPostData] = useGetPostDataMutation();
  const [post, setPost] = useState({});

  const loadPostData = async () => {
    try {
      const postData = await getPostData(post_id).unwrap();
      console.log("post page, ", postData.user_id);

      setPost({
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

  useEffect(() => {
    loadPostData();
  }, []);

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      mt="30px"
      //sx={{ width: { lg: "700px", md: "500px", sm: "95%" } }}
    >
      <PostView post={post} />
    </Stack>
  );
};

export default PostPage;
