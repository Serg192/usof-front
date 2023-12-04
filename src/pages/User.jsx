import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useGetUserMutation,
  useGetUserPostsMutation,
  useUploadAvatarMutation,
} from "../features/users/usersApiSlice";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { QuestionPreview, UserProfileIcon } from "../components";
import { theme } from "../theme";
import { useSelector } from "react-redux";
import { selectcurrentId } from "../features/auth/authSlice";

const btnStyle = {
  color: "white",
  backgroundColor: theme.palette.primary.light,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  textTransform: "none",
  fontSize: "18px",
};

const User = () => {
  const { userId } = useParams();
  const appUser = useSelector(selectcurrentId);

  const [currentUser, setCurrentUser] = useState(null);
  const [currentPosts, setcurrentPosts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayUploadErr, setDisplayUploadErr] = useState(false);

  const [getUser] = useGetUserMutation();
  const [getUserPosts] = useGetUserPostsMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

  const fileInputRef = useRef(null);

  const loadCurrentUser = async () => {
    try {
      const userData = await getUser(userId).unwrap();
      setCurrentUser(userData);
    } catch (err) {}
  };

  const loadUserPosts = async () => {
    try {
      const userPosts = await getUserPosts(userId).unwrap();
      setcurrentPosts(userPosts);
    } catch (err) {}
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const resetFileInput = () => {
    fileInputRef.current.value = null;
    setSelectedFile(null);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      try {
        await uploadAvatar(formData).unwrap();
        loadCurrentUser();
        loadUserPosts();
        resetFileInput();
        setDisplayUploadErr(false);
      } catch (err) {
        console.error("Error uploading photo:", err);
        setDisplayUploadErr(true);
      }
    }
  };

  useEffect(() => {
    loadCurrentUser();
    loadUserPosts();
  }, []);

  return (
    <Stack
      direction="column"
      width="100%"
      alignItems="center"
      mt="30px"
      mb="30px"
      spacing="25px"
    >
      <UserProfileIcon
        name={currentUser?.user_login}
        rating={currentUser?.user_rating}
        image={`http://localhost:4545/profile-images/${currentUser?.user_profile_picture}`}
        size="128px"
      />

      {displayUploadErr && (
        <Alert
          severity={"error"}
          sx={{ width: "50%", marginBottom: 2, fontSize: "16px" }}
        >
          Only .png and .jpeg allowed. File size should be less that 5M
        </Alert>
      )}

      {appUser == userId && (
        <div>
          <Button
            sx={btnStyle}
            onClick={() => {
              if (selectedFile) {
                resetFileInput();
                setDisplayUploadErr(false);
              } else {
                fileInputRef.current.click();
              }
            }}
          >
            {selectedFile ? "Cancel" : "Choose File"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ position: "absolute", top: "-9999px" }}
            onChange={handleFileChange}
            onClick={(e) => (e.target.value = null)}
          />
          {selectedFile && (
            <Typography mt={1} color="text.secondary">
              Chosen File: {selectedFile.name}
            </Typography>
          )}
          {selectedFile && (
            <Button
              variant="contained"
              onClick={handleFileUpload}
              style={btnStyle}
            >
              Upload Photo
            </Button>
          )}
        </div>
      )}

      <Typography color="primary.light" variant="h4">
        User posts:
      </Typography>
      {currentPosts.length &&
        currentPosts.map((p) => (
          <QuestionPreview
            title={p.post_title}
            author={p.post_author.user_login}
            author_img={p.post_author.user_profile_picture}
            date={new Date(p.post_publish_date).toDateString()}
            categories={p.post_categories}
            likes={p.like_count}
            dislikes={p.post_likes.length - p.like_count}
            commentsCount={p.post_comments.length}
            postId={p.id}
          />
        ))}
    </Stack>
  );
};

export default User;