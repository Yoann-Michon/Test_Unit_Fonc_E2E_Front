import { ChangeEvent, useState, useEffect } from "react";
import { UserSchema } from "../../schema/UserSchema";
import { VisibilityOff, Visibility, Save, Edit } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
  Container,
  Divider,
} from "@mui/material";
import { AuthService } from "../../services/Auth.service";
import { userService } from "../../services/User.service";
import { SlideSnackbar } from "../../components/SlideSnackbar";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({
    id: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    pseudo: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      const decodedUser = AuthService.decodeToken();
      setUserData({
        id: decodedUser.sub,
        email: decodedUser.email,
        firstname: decodedUser.firstname,
        lastname: decodedUser.lastname,
        password: "",
        pseudo: decodedUser.pseudo,
      });
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    const { error } = UserSchema.extract(name).validate(value);
    setErrors((prev) => ({
      ...prev,
      [name]: error ? error.details[0].message : "",
    }));
  };

  const handleSave = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const { id, password, ...updateData } = userData;

    const dataToSend = password ? { ...updateData, password } : updateData;

    const validationSchema =
      password === ""
        ? UserSchema.fork(["password"], (schema) => schema.optional())
        : UserSchema;

    const { error } = validationSchema.validate(dataToSend, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.reduce(
        (acc: { [key: string]: string }, curr: any) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        },
        {}
      );
      console.log(error);

      setErrors(validationErrors);
      return;
    }

    try {
      const updatedUser = await userService.updateUser(id, dataToSend);

      setUserData((prev) => ({
        ...prev,
        ...updatedUser,
        password: "",
      }));

      setIsEditing(false);
      setSuccessMessage("Profile successfully updated!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Save error:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "gray.100",
        padding: 4,
      }}
    >
      <Card sx={{ minWidth: 400, p: 3 }}>
        <CardHeader title="My Account" sx={{ textAlign: "center" }} />
        <CardContent>
          <TextField
            fullWidth
            label="First Name"
            name="firstname"
            value={userData.firstname}
            onChange={handleChange}
            disabled={!isEditing}
            margin="dense"
            error={!!errors.firstname}
            helperText={errors.firstname}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastname"
            value={userData.lastname}
            onChange={handleChange}
            disabled={!isEditing}
            margin="dense"
            error={!!errors.lastname}
            helperText={errors.lastname}
          />
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            label="Username"
            name="pseudo"
            value={userData.pseudo}
            onChange={handleChange}
            disabled={!isEditing}
            margin="dense"
            error={!!errors.pseudo}
            helperText={errors.pseudo}
          />
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
            margin="dense"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={userData.password}
            onChange={handleChange}
            disabled={!isEditing}
            margin="dense"
            error={!!errors.password}
            helperText={errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box className="flex justify-center mt-4">
            {isEditing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                startIcon={<Save />}
              >
                Save
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => setIsEditing(true)}
                startIcon={<Edit />}
              >
                Edit
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <SlideSnackbar
        open={snackbarOpen}
        message={successMessage || errorMessage}
        severity={successMessage ? "success" : "error"}
        onClose={() => setSnackbarOpen(false)}
      />
    </Container>
  );
}
