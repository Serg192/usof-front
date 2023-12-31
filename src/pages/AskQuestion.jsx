import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ChooseCategory } from "../components";
import React, { useEffect, useState } from "react";
import {
  useCreatePostMutation,
  useGetPostDataMutation,
  useUpdatePostMutation,
} from "../features/posts/postsApiSlice";
import { theme } from "../theme";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const labelProps = { style: { fontSize: "20px" } };
const textInputSX = {
  "& .MuiInputBase-input": {
    fontSize: "20px",
  },
};

const AskQuestion = () => {
  const { question_id } = useParams();
  const isMid = useMediaQuery(theme.breakpoints.up("md"));

  const [content, setContent] = useState("");
  const [displayContentError, setDisplayContentError] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [displayTitleError, setDisplayTitleError] = useState(false);
  const [displayCategoryError, setDisplayCategoryError] = useState(false);

  const [serverErrMsg, setServerErrMsg] = useState("");

  const [createPost, { isLoading }] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const navigate = useNavigate();

  const handleSubmitQuestion = async () => {
    let valid = true;

    if (title.length < 10 || title.length >= 100) {
      setDisplayTitleError(true);
      valid = false;
    }
    if (selectedCategories.length === 0) {
      setDisplayCategoryError(true);
      valid = false;
    }
    if (content.length < 30) {
      setDisplayContentError(true);
      valid = false;
    }

    if (valid) {
      const categoryIds = selectedCategories.map((cat) => cat.id);

      try {
        if (question_id == 0) {
          const postCreateAsw = await createPost({
            title,
            content,
            categoryIds,
          }).unwrap();
          const createdPostId = postCreateAsw.post.id;
          navigate(`/posts/${createdPostId}`);
        } else {
          const updatedPost = await updatePost({
            postId: question_id,
            payload: {
              title,
              content,
              categoryIds,
            },
          }).unwrap();
          navigate(`/posts/${question_id}`);
        }
      } catch (err) {
        const respStatus = err?.originalStatus;
        if (!respStatus) {
          setServerErrMsg("No server response");
        } else if (respStatus === 400) {
          setServerErrMsg("Bad request");
        } else {
          setServerErrMsg(err?.data?.message || "Server error");
        }
      }
    }
  };

  const [getPostData] = useGetPostDataMutation();
  const loadQuestion = async () => {
    try {
      const postData = await getPostData(question_id).unwrap();
      setTitle(postData.post_title);
      setContent(postData.post_content);
      const categories = postData.postCategories.map((cat) => {
        return { id: cat.category_id, name: cat.category_title };
      });
      setSelectedCategories(categories);
    } catch (err) {}
  };

  useEffect(() => {
    if (question_id != 0) loadQuestion();
  }, [question_id]);

  return (
    <Stack
      direction={isMid ? "row" : "column"}
      justifyContent="space-between"
      alignItems="stretch"
    >
      <Paper
        elevation={2}
        sx={{
          width: { lg: "700px", md: "500px", sm: "100%" },
          flex: "0 0 auto",
          display: "flex",
          justifyContent: "center",

          p: "20px",
        }}
      >
        <Stack direction="column" alignItems="center" width="100%">
          {serverErrMsg && (
            <Alert severity="error" sx={{ width: "95%", fontSize: "20px" }}>
              {serverErrMsg}
            </Alert>
          )}
          <Typography variant="h4">
            {question_id == 0 ? "Ask a question" : "Edit question"}
          </Typography>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDisplayTitleError(false);
            }}
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={labelProps}
            sx={textInputSX}
            error={displayTitleError}
            helperText={
              displayTitleError && "Title should be from 10 to 100 characters "
            }
          />
          <ChooseCategory
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            error={displayCategoryError}
            setDisplayError={setDisplayCategoryError}
          />
          <TextField
            label="Content"
            variant="outlined"
            multiline
            rows={15}
            fullWidth
            margin="normal"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setDisplayContentError(false);
            }}
            error={displayContentError}
            helperText={
              displayContentError &&
              "Question description should have at least 30 charaters"
            }
          />

          <Button
            onClick={() => handleSubmitQuestion()}
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
            Submit
          </Button>
        </Stack>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          flex: "1",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "15px",
        }}
      >
        <Box position="sticky" top={0}>
          <Typography variant="h3" alignSelf="center">
            Preview
          </Typography>
          <Divider fullWidth sx={{ mt: "20px", mb: "20px" }} />
        </Box>

        <Stack sx={{ flex: "1", overflowY: "auto" }}>
          <Typography component="div" sx={{ fontSize: "18px", mt: "10px" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default AskQuestion;
