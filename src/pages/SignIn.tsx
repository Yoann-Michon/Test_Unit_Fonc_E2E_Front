// src/pages/SignInPage.tsx
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GoogleIcon, FacebookIcon, AkkorIcon } from "../components/Icons";
import { FormEvent, useState } from "react";
import { AuthService } from "../services/Auth.service";
import { useNavigate } from "react-router-dom";
import { LoginSchema } from "../schema/LoginSchema";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInPage = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
  
    const { error } = LoginSchema.validate({ email, password }, { abortEarly: false });
  
    if (error) {
      error.details.forEach((err) => {
        if (err.context?.key === "email") {
          setEmailError(true);
          setEmailErrorMessage(err.message);
        } else if (err.context?.key === "password") {
          setPasswordError(true);
          setPasswordErrorMessage(err.message);
        }
      });
      return; 
    }
  
    setEmailError(false);
    setEmailErrorMessage("");
    setPasswordError(false);
    setPasswordErrorMessage("");
  
    try {
      await AuthService.signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <>
      <Stack direction="column" justifyContent="center" alignItems="center" height='100vh'>
        <Card variant="outlined">
          <AkkorIcon />
          <Typography variant="h4">Sign In</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{display: 'contents'}}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                type="password"
                id="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
              />
            </FormControl>
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <Button type="submit" variant="contained" fullWidth>
              Sign in
            </Button>
          </Box>
          <Divider>or</Divider>
          <Button fullWidth variant="outlined" onClick={() => alert("Sign in with Google")} startIcon={<GoogleIcon />}>
            Sign in with Google
          </Button>
          <Button fullWidth variant="outlined" onClick={() => alert("Sign in with Facebook")} startIcon={<FacebookIcon />}>
            Sign in with Facebook
          </Button>
          <Typography>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </Typography>
        </Card>
      </Stack>
    </>
  );
};

export default SignInPage;
