import { Autocomplete, Chip, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../theme";
import { useSearchCategoryMutation } from "../features/categories/categoryApiSlice";

const ChooseCategory = ({
  selectedCategories,
  setSelectedCategories,
  error,
  setDisplayError,
}) => {
  const [availableCategories, setAvailableCategories] = useState([]);

  const [searchCategory, { isLoading }] = useSearchCategoryMutation();

  const handleUpdSearchCategories = async (searchPattern) => {
    const categories = (await searchCategory(searchPattern))?.data;

    const newAl = categories?.data?.map((cat) => {
      return { id: cat.id, name: cat.category_title };
    });
    setAvailableCategories(newAl || []);
  };

  const handleCategoryChange = (event, values) => {
    setSelectedCategories(values);
  };

  const filterOptions = (options, { inputValue }) => {
    return options.filter(
      (option) =>
        !selectedCategories.some((selected) => selected.id === option.id)
    );
  };

  const renderTags = (value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        key={index}
        label={option.name}
        {...getTagProps({ index })}
        style={{
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.secondary.main,
          margin: "4px",
          fontSize: "16px",
        }}
      />
    ));

  return (
    <Autocomplete
      id="category-chooser"
      options={availableCategories}
      getOptionLabel={(option) => option.name}
      style={{ width: "100%" }}
      multiple
      renderTags={renderTags}
      filterOptions={filterOptions}
      onChange={handleCategoryChange}
      onInputChange={(e) => {
        setDisplayError && setDisplayError(false);
        handleUpdSearchCategories(e.target.value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            "& .MuiFormHelperText-root": {
              fontSize: "15px",
            },
          }}
          label="Choose Categories"
          variant="outlined"
          error={error}
          helperText={error && "At least one category must be chosen"}
        />
      )}
    />
  );
};

export default ChooseCategory;
