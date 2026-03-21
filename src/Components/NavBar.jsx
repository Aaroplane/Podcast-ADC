import {
  AppBar,
  Box,
  Button,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { StyledButton } from "../Styling/theme.jsx";
import { Link } from "react-router-dom";
import "../Styling/NavbarStyling.scss";
import { useAuth } from "../contexts/AuthContext.jsx";
import CCPnewLogo from "../assets/CCPnewLOGO.png";

export default function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 90);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Contact", path: "/contact" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} className="mobile_drawer">
      <Box className="drawer_header">
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            to={item.path}
            className="mobile_nav_item"
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Box className="mobile_auth_buttons">
          {isAuthenticated ? (
            <>
              <StyledButton
                LinkComponent={Link}
                to={`/users/${user.id}/userdashboard`}
                fullWidth
              >
                Dashboard
              </StyledButton>
              <StyledButton
                LinkComponent={Link}
                to={`/users/${user.id}/profile`}
                fullWidth
              >
                Profile
              </StyledButton>
              <StyledButton
                onClick={() => {
                  logout();
                }}
                fullWidth
              >
                Log Out
              </StyledButton>
            </>
          ) : (
            <>
              <StyledButton
                LinkComponent={Link}
                to="/login"
                fullWidth
                className="mobile_auth_btn"
              >
                Log In
              </StyledButton>
              <StyledButton
                LinkComponent={Link}
                to="/signup"
                fullWidth
                className="mobile_auth_btn"
              >
                Sign Up
              </StyledButton>
            </>
          )}
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        className={`nav_bar ${scrolled ? "nav_bar--scrolled" : ""}`}
      >
        <Toolbar className="custom-toolbar">
          <Box component={Link} to="/" className="logo_container">
            <Box
              component="img"
              src={CCPnewLogo}
              className="img_logo"
              alt="Company Logo"
              LinkComponent={Link}
              to="/"
            />
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              className="mobile_menu_button"
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box className="nav_buttons_container">
              <Box className="nav_links">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    className="nav_buttons"
                    LinkComponent={Link}
                    to={item.path}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Box className="sign_forms">
                {isAuthenticated ? (
                  <>
                    <StyledButton
                      LinkComponent={Link}
                      to={`/users/${user.id}/userdashboard`}
                      className="nav_auth_btn"
                      fullWidth
                    >
                      Dashboard
                    </StyledButton>
                    <StyledButton
                      LinkComponent={Link}
                      to={`/users/${user.id}/profile`}
                      className="nav_auth_btn"
                      fullWidth
                    >
                      Profile
                    </StyledButton>
                    <StyledButton
                      onClick={() => {
                        logout();
                      }}
                      fullWidth
                    >
                      Log Out
                    </StyledButton>
                  </>
                ) : (
                  <>
                    <StyledButton LinkComponent={Link} to="/login">
                      Log In
                    </StyledButton>
                    <StyledButton LinkComponent={Link} to="/signup">
                      Sign Up
                    </StyledButton>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        className="mobile_drawer_container"
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </>
  );
}
