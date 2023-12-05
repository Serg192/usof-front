import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { theme } from "../theme";
import { usePasswordResetMutation } from "../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const textInputSX = {
  "& .MuiInputBase-input": {
    fontSize: "20px",
  },
};

const labelProps = { style: { fontSize: "20px" } };

const btnStyle = {
  color: "white",
  backgroundColor: theme.palette.primary.light,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  "&:disabled": {
    backgroundColor: theme.palette.primary.lighter,
  },
};

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState();
  const [passwordReset] = usePasswordResetMutation();

  const navigate = useNavigate();

  const tryResetPassword = async () => {
    try {
      await passwordReset({ email }).unwrap();
      navigate("/login");
    } catch (err) {
      setErrMsg(err?.data?.message);
    }
  };

  return (
    <Stack direction="column" alignItems="center" mt="20vh">
      <Paper
        alightItems="center"
        justifuContent="center"
        elevation={3}
        sx={{ p: "20px" }}
      >
        <Typography variant="h3" color="primary.main" mb="20px">
          Reset password
        </Typography>
        {errMsg && (
          <Alert
            severity="error"
            sx={{ width: "95%", marginBottom: 2, fontSize: "16px" }}
          >
            {errMsg}
          </Alert>
        )}
        <TextField
          id="login"
          label="Type your email here"
          variant="standard"
          fullWidth
          sx={textInputSX}
          InputLabelProps={labelProps}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Stack direction="row" justifyContent="center" mt="20px">
          <Button
            disabled={!(email.length > 0)}
            sx={btnStyle}
            onClick={() => tryResetPassword()}
          >
            Send reset link
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ResetPassword;
