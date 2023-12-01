import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";

import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { theme } from "../theme";

const textInputSX = {
  "& .MuiInputBase-input": {
    fontSize: "20px",
  },
};

const labelProps = { style: { fontSize: "20px" } };

const Login = () => {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      const userData = await login({ login: user, password: pwd }).unwrap();
      console.log("User data, ", userData);
      dispatch(setCredentials({ ...userData, user }));
      setUser("");
      setPwd("");
      navigate("/protected");
    } catch (err) {
      const respStatus = err?.status;
      if (!respStatus) {
        setErrMsg("No Server Response");
      } else if (respStatus === 400) {
        console.log("Here", err);
        setErrMsg(err?.data?.message || "Fields cannot be empty");
      } else if (respStatus === 401) {
        setErrMsg(err?.data?.message);
      } else {
        setErrMsg("Login failed");
      }
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="center"
      mt="1vh"
      sx={{ minHeight: "100vh" }}
    >
      <Paper
        elevation={4}
        sx={{ height: "95vh", width: { md: "500px", sm: "70%", xs: "90%" } }}
      >
        <Stack direction="column" alignItems="center" p="20px" spacing="23px">
          <Typography variant="h3" sx={{ color: "primary.main", mb: "30px" }}>
            Log in
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
            label="Login"
            variant="standard"
            fullWidth
            sx={textInputSX}
            InputLabelProps={labelProps}
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
          />

          <TextField
            id="pwd"
            label="Password"
            variant="standard"
            type="password"
            fullWidth
            sx={textInputSX}
            InputLabelProps={labelProps}
            autoComplete="off"
            onChange={(e) => setPwd(e.target.value)}
          />

          <Link to={"/signup"}>
            <Typography
              variant="h6"
              sx={{
                color: "primary.light",
                "&:hover": { color: "primary.main" },
              }}
            >
              Do not have an account? Sign up
            </Typography>
          </Link>
          <Typography
            variant="h6"
            sx={{
              color: "primary.light",
              "&:hover": { color: "primary.main" },
            }}
          >
            If you for got you password click here
          </Typography>
          <Button
            onClick={() => handleSubmit()}
            sx={{
              color: "white",
              backgroundColor: theme.palette.primary.light,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
              "&:disabled": {
                backgroundColor: theme.palette.primary.lighter,
              },
              width: "300px",
            }}
          >
            Log in
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Login;
