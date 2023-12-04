import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const btnStyle = {
  "&:hover": {
    transform: "scale(1.3)",
    color: "primary.dark",
  },
};

const PageController = ({ paginationInfo, setPage }) => {
  const { currentPage, nextPage, prevPage } = paginationInfo;
  return (
    <Stack direction="row" alignItems="center">
      <IconButton
        color={"primary.main"}
        sx={btnStyle}
        onClick={() => prevPage && setPage(prevPage)}
      >
        <ArrowLeftIcon sx={{ transform: "scale(3)}" }} />
      </IconButton>
      <Typography variant="h4" color="primary.light">
        {currentPage}
      </Typography>
      <IconButton
        color={"primary.main"}
        sx={btnStyle}
        onClick={() => nextPage && setPage(nextPage)}
      >
        <ArrowRightIcon sx={{ transform: "scale(3)}" }} />
      </IconButton>
    </Stack>
  );
};

export default PageController;
