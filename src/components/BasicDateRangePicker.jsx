import * as React from "react";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { theme } from "../theme";

const btnStyle = {
  color: "white",
  backgroundColor: theme.palette.primary.light,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  textTransform: "none",
  fontSize: "18px",
};

const BasicDateRangePicker = ({ value, setValue }) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={{ start: "Start date", end: "End date" }}
    >
      <DateRangePicker
        value={value}
        onChange={(newVal) => setValue(newVal)}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
      <Button onClick={() => setValue([null, null])} sx={btnStyle}>
        Reset Dates
      </Button>
    </LocalizationProvider>
  );
};

export default BasicDateRangePicker;
