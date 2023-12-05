import React, { useEffect, useState } from "react";
import { useGetAllCategoriesMutation } from "../features/categories/categoryApiSlice";
import { PageController, Tag } from "../components";
import { InputLabel, MenuItem, Select, Stack } from "@mui/material";

const Tags = () => {
  const [getAllCategories] = useGetAllCategoriesMutation();
  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState([]);
  const [order, setOrder] = useState("DESC");

  const loadTags = async () => {
    try {
      const tagsData = await getAllCategories(
        `page=${page}&sortOrder=${order}&limit=5`
      ).unwrap();
      setPagination(tagsData.pagination);
      setTags(tagsData.records);
    } catch (err) {}
  };

  useEffect(() => {
    loadTags();
  }, [page, order]);
  return (
    <Stack
      direction="column"
      width="100%"
      alignItems="center"
      mt="30px"
      mb="30px"
      spacing="25px"
    >
      <Stack direction="row" alignItems="center" spacing="20px">
        <InputLabel
          id="sortBy"
          sx={{ color: "primary.main", fontSize: "20px" }}
        >
          Popularity
        </InputLabel>
        <Select
          labelId="sortBy"
          id="sortBy"
          label="sortBy"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <MenuItem value={"ASC"}>ascending</MenuItem>
          <MenuItem value={"DESC"}>descending</MenuItem>
        </Select>
      </Stack>

      {tags.length > 0 &&
        tags.map((tag) => (
          <Tag
            title={tag.category_title}
            description={tag.category_description}
            used={tag.post_count}
          />
        ))}

      {pagination && (
        <PageController paginationInfo={pagination} setPage={setPage} />
      )}
    </Stack>
  );
};

export default Tags;
