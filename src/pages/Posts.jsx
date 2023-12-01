import React from "react";

import { QuestionPreview } from "../components";
import { Stack } from "@mui/material";

const questionData = {
  title: "I am a newbie here. How can I add a picture to my question?",
  author: "admin",
  date: "20.21.2020",
  categories: ["Category 1", "Category 2"],
  likeCount: 512,
  comments: 12,
};

const Posts = () => {
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
      {arr.map((q) => (
        <QuestionPreview
          title={questionData.title}
          author={questionData.author}
          date={questionData.date}
          categories={questionData.categories}
          likes={questionData.likeCount}
          comments={questionData.comments}
        />
      ))}
    </Stack>
  );
};

export default Posts;
