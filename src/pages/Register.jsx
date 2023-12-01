import { React, useRef, useState, useEffect } from "react";
import {
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  Alert,
} from "@mui/material";
import { theme } from "../theme";
import { Link } from "react-router-dom";

import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { StackTraceAd } from "../components";

const REGEX = require("../utils/regex");

const textInputSX = {
  "& .MuiInputBase-input": {
    fontSize: "20px",
  },
};

const labelProps = { style: { fontSize: "20px" } };

const Register = () => {
  const isLGScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const userRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [fullName, setFullName] = useState("");
  const [validFullName, setValidFullName] = useState(false);
  const [fullNameFocus, setFullNameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const result = REGEX.USER_LOGIN_REGEX.test(user);
    console.log("Username validation result: ", result);
    console.log("Username value is: ", user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = REGEX.EMAIL_REGEX.test(email) && email.length < 35;
    console.log("Email validation result: ", result);
    console.log("Email value is: ", email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = REGEX.USER_FULL_NAME.test(fullName);
    console.log("FullName validation result: ", result);
    console.log("Full Name is: ", fullName);
    setValidFullName(result);
  }, [fullName]);

  useEffect(() => {
    const result = REGEX.USER_PASSWORD_REGEX.test(pwd);
    console.log("Password validation result: ", result);
    console.log("Password is: ", pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, email, fullName, pwd, matchPwd]);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      spacing="30px"
      mt="1h"
      sx={{ minHeigt: "100vh" }}
    >
      {isLGScreen && <StackTraceAd height="95vh" width="60%" />}

      <Paper
        elevation={4}
        sx={{ height: "95vh", width: { md: "500px", sm: "70%", xs: "90%" } }}
      >
        <Stack direction="column" alignItems="center" p="20px" spacing="23px">
          <Typography variant="h3" sx={{ color: "primary.main", mb: "30px" }}>
            Sign up
          </Typography>

          <Alert
            severity="success"
            sx={{ width: "95%", marginBottom: 2, fontSize: "16px" }}
          >
            This is an error alert — check it out!
          </Alert>

          <Stack direction="row" width="100%" alignItems="center">
            <TextField
              id="login"
              label="Login"
              variant="standard"
              fullWidth
              sx={textInputSX}
              ref={userRef}
              InputLabelProps={labelProps}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              error={user && !validName}
              helperText={
                userFocus && user && !validName
                  ? "Login should have 4-40 characters"
                  : ""
              }
            />
            {validName && <CheckIcon color="success" />}
            {!validName && user && <ErrorOutlineIcon color="error" />}
          </Stack>

          <Stack direction="row" width="100%" alignItems="center">
            <TextField
              id="fullName"
              label="Full Name"
              variant="standard"
              fullWidth
              sx={textInputSX}
              InputLabelProps={labelProps}
              autoComplete="off"
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => setFullNameFocus(true)}
              onBlur={() => setFullNameFocus(false)}
              error={fullName && !validFullName}
              helperText={
                fullName && fullNameFocus && !validFullName
                  ? " Please enter your real full name"
                  : ""
              }
            />
            {validFullName && <CheckIcon color="success" />}
            {!validFullName && fullName && <ErrorOutlineIcon color="error" />}
          </Stack>

          <Stack direction="row" width="100%" alignItems="center">
            <TextField
              id="email"
              label="Email"
              variant="standard"
              fullWidth
              sx={textInputSX}
              InputLabelProps={labelProps}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              error={email && !validEmail}
              helperText={
                email && emailFocus && !validEmail ? "Email is not valid" : ""
              }
            />
            {validEmail && <CheckIcon color="success" />}
            {!validEmail && email && <ErrorOutlineIcon color="error" />}
          </Stack>

          <Stack direction="row" width="100%" alignItems="center">
            <TextField
              id="password"
              label="Password"
              type="password"
              variant="standard"
              fullWidth
              sx={textInputSX}
              InputLabelProps={labelProps}
              autoComplete="off"
              onChange={(e) => setPwd(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              error={pwd && !validPwd}
              helperText={
                pwd && pwdFocus && !validPwd
                  ? "Password should have at least 8 characters 3 uppercase letters, 3 numbers and 1 special character"
                  : ""
              }
            />
            {validPwd && <CheckIcon color="success" />}
            {!validPwd && pwd && <ErrorOutlineIcon color="error" />}
          </Stack>

          <Stack direction="row" width="100%" alignItems="center">
            <TextField
              id="confPass"
              label="Confirm password"
              type="password"
              variant="standard"
              fullWidth
              sx={textInputSX}
              InputLabelProps={labelProps}
              autoComplete="off"
              onChange={(e) => setMatchPwd(e.target.value)}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              error={matchPwd && !validMatch}
              helperText={
                matchPwd && matchFocus && !validMatch
                  ? "Passwords do not match"
                  : ""
              }
            />
            {validMatch && matchPwd && <CheckIcon color="success" />}
            {!validMatch && matchPwd && <ErrorOutlineIcon color="error" />}
          </Stack>

          <Link to={"/login"}>
            <Typography
              variant="h6"
              sx={{
                color: "primary.light",
                "&:hover": { color: "primary.main" },
              }}
            >
              Already have an account?
            </Typography>
          </Link>
          <Button
            disabled={
              !(
                validName &&
                validEmail &&
                validFullName &&
                validPwd &&
                validMatch
              )
            }
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
            Sign up
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Register;
