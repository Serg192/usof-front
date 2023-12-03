import React, { useEffect } from "react";

import { QuestionPreview } from "../components";
import { Button, Stack } from "@mui/material";
import { theme } from "../theme";
import { Link } from "react-router-dom";

import { useGetPostsMutation } from "../features/posts/postsApiSlice";
import { useState } from "react";

const questionData = {
  title: "I am a newbie here. How can I add a picture to my question?",
  author: "admin",
  date: "20.21.2020",
  categories: ["Category 1", "Category 2"],
  likeCount: 512,
  comments: 12,
};

const Posts = () => {
  const [getPosts] = useGetPostsMutation();

  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPosts, setcurrentPosts] = useState([]);

  const loadPosts = async () => {
    try {
      const posts = await getPosts("").unwrap();
      setPaginationInfo(posts.pagination);
      console.log(posts.records);
      setcurrentPosts(posts.records);
    } catch (err) {}
  };

  useEffect(() => {
    loadPosts();
  }, []);

  let arr = [];
  for (let i = 0; i < 20; i++) arr.push(questionData);
  return (
    <Stack
      direction="column"
      width="100%"
      alignItems="center"
      mt="30px"
      spacing="25px"
    >
      <Link to="/newQuestion">
        <Button
          sx={{
            color: "white",
            backgroundColor: theme.palette.primary.light,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
            },
            textTransform: "none",
            fontSize: "18px",
          }}
        >
          Ask a question
        </Button>
      </Link>

      {currentPosts.length &&
        currentPosts.map((p) => (
          <QuestionPreview
            title={p.post_title}
            author={p.post_author.user_login}
            author_img={p.post_author.user_profile_picture}
            date={new Date(p.post_publish_date).toDateString()}
            categories={p.post_categories}
            likes={100}
            comments={questionData.comments}
            postId={p.id}
          />
        ))}
    </Stack>
  );
};

export default Posts;
