import React, { useState } from "react";
import {
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import BasicDateRangePicker from "./BasicDateRangePicker";
import ChooseCategory from "./ChooseCategory";

const FilterSidebar = ({
  open,
  setOpen,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onlyActivePosts,
  setOnlyActivePosts,
  date,
  setDate,
  selectedCategories,
  setSelectedCategories,
}) => {
  return (
    <Drawer
      elevation={2}
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        sx: { width: "500px" },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          m: "20px",
          border: "2px solid #69618e",
          borderRadius: "4px",
          mb: 2,
        }}
      >
        <Stack direction="column" p="20px" spacing="20px">
          <Typography color="primary" variant="h4">
            Sorting
          </Typography>
          <Stack direction="column" spacing="5px">
            <InputLabel id="sortBy" sx={{ color: "primary.main" }}>
              Sort by
            </InputLabel>
            <Select
              labelId="sortBy"
              id="sortBy"
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value={"post_likes"}>Like count</MenuItem>
              <MenuItem value={"post_publish_date"}>Publish date</MenuItem>
            </Select>
          </Stack>

          <Stack direction="column" spacing="5px">
            <InputLabel id="sortOrder" sx={{ color: "primary.main" }}>
              Sort order
            </InputLabel>
            <Select
              labelId="sortOrder"
              id="sortOrder"
              label="Sort order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value={"ASC"}>ascending</MenuItem>
              <MenuItem value={"DESC"}>descending</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          m: "20px",
          border: "2px solid #69618e",
          borderRadius: "4px",
          mb: 2,
        }}
      >
        <Stack direction="column" p="20px" spacing="20px">
          <Typography color="primary" variant="h4">
            Filters
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={onlyActivePosts}
                onChange={(e) => setOnlyActivePosts(!onlyActivePosts)}
              />
            }
            label="Only active posts"
          />
          <Typography variant="h6" color="primary.light">
            Date range:
          </Typography>
          <BasicDateRangePicker value={date} setValue={setDate} />
          <Typography variant="h6" color="primary.light">
            Categories:
          </Typography>
          <ChooseCategory
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </Stack>
      </Paper>
    </Drawer>
  );
};

export default FilterSidebar;
