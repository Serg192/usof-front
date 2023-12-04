import React, { useEffect } from "react";

import { FilterSidebar, PageController, QuestionPreview } from "../components";
import { Button, Fab, Stack } from "@mui/material";
import { theme } from "../theme";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";

import { useGetPostsMutation } from "../features/posts/postsApiSlice";
import { useState } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import { useSelector } from "react-redux";
import {
  selectCurrentToken,
  selectcurrentId,
} from "../features/auth/authSlice";

const Posts = () => {
  const [getPosts] = useGetPostsMutation();

  const [paginationInfo, setPaginationInfo] = useState({});
  const [currentPosts, setcurrentPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("post_likes");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [onlyActivePosts, setOnlyActivePosts] = useState(true);
  const [date, setDate] = useState([null, null]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [openFilterOptions, setOpenFilterOptions] = useState(false);

  const token = useSelector(selectCurrentToken);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchValue = queryParams.get("search") || "";

  const navigate = useNavigate();

  const loadPosts = async () => {
    let dateFilter = null;
    let categoryFilter = null;
    if (date[0] || date[1]) {
      dateFilter = "";
      const startDate = new Date(date[0]);
      const endDate = new Date(date[1]);
      endDate.setDate(endDate.getDate() + 2);
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
      dateFilter += `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

    if (selectedCategories.length > 0) {
      categoryFilter = selectedCategories.map((cat) => cat.id).join(",");
      categoryFilter = `&category=${categoryFilter}`;
    }
    try {
      const searchAttr = `&search=${searchValue}`;
      console.log("SEARCH: ", searchAttr);
      const posts = await getPosts(
        `page=${page}&limit=2&sortBy=${sortBy}&sortOrder=${sortOrder}${
          categoryFilter ? categoryFilter : ""
        }${onlyActivePosts ? "&status=active" : ""}${
          dateFilter ? dateFilter : ""
        }${searchValue.length > 0 ? searchAttr : ""}`
      ).unwrap();
      setPaginationInfo(posts.pagination);
      console.log(posts.records);
      setcurrentPosts(posts.records);
    } catch (err) {}
  };

  const newQuestion = () => {
    if (token) {
      navigate("/newQuestion");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadPosts();
  }, [
    page,
    sortBy,
    sortOrder,
    onlyActivePosts,
    date,
    selectedCategories,
    searchValue,
  ]);

  return (
    <Stack
      direction="column"
      width="100%"
      alignItems="center"
      mt="30px"
      mb="30px"
      spacing="25px"
    >
      <Fab
        color="primary"
        aria-label="open-sidebar"
        style={{
          position: "fixed",
          top: "30%",
          right: 0,
          transform: "translateY(-50%)",
        }}
        onClick={() => setOpenFilterOptions(!openFilterOptions)}
      >
        <FilterListIcon />
      </Fab>

      <FilterSidebar
        open={openFilterOptions}
        setOpen={setOpenFilterOptions}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onlyActivePosts={onlyActivePosts}
        setOnlyActivePosts={setOnlyActivePosts}
        date={date}
        setDate={setDate}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
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
        onClick={() => newQuestion()}
      >
        Ask a question
      </Button>

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
      <PageController paginationInfo={paginationInfo} setPage={setPage} />
    </Stack>
  );
};

export default Posts;
