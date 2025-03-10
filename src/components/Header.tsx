import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AkkorIcon } from "./Icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthService } from "../services/Auth.service";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = useState(false);
  const isAuthenticated = !AuthService.isTokenExpired();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              component={Link}
              to="/home"
              variant="text"
              color="primary"
              size="large"
            >
              <AkkorIcon />
            </Button>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              alignItems: "center",
              px: 0,
              display: { xs: "none", md: "flex" },
              maxWidth: 400,
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="text"
              color="info"
              size="small"
              component={Link}
              to="/hotel"
            >
              Hotels
            </Button>
            <Button variant="text" color="info" size="small">
              Flights
            </Button>
            <Button variant="text" color="info" size="small">
              Offers
            </Button>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {isAuthenticated ? (
              <Button
                color="primary"
                variant="contained"
                size="small"
                component={Link}
                to="/dashboard"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component={Link}
                  to="/signin"
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component={Link}
                  to="/signup"
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem
                  component={Link}
                  to="/hotel"
                  onClick={toggleDrawer(false)}
                >
                  Hotels
                </MenuItem>
                <MenuItem onClick={toggleDrawer(false)}>Flights</MenuItem>
                <MenuItem onClick={toggleDrawer(false)}>Offers</MenuItem>

                <Divider sx={{ my: 3 }} />

                {isAuthenticated ? (
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      component={Link}
                      to="/dashboard"
                    >
                      Dashboard
                    </Button>
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        component={Link}
                        to="/signup"
                      >
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        component={Link}
                        to="/signin"
                      >
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
