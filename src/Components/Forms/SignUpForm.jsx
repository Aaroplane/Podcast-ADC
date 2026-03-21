import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../Styling/theme";
import "../../Styling/SignUpStyling.scss";
import { InputAdornment, IconButton, Alert } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function SignUp() {
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    const formattedData = {
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      password: data.password,
      email: data.email,
    };

    try {
      const response = await api.post("/users", formattedData);

      reset({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
      });

      const { token, refreshToken, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      setTimeout(() => {
        navigate(`/users/${user.id}/userdashboard`);
      }, 3000);
    } catch (error) {
      const resData = error.response?.data;
      if (resData?.details?.length) {
        setError(resData.details.map((d) => d.message).join(". "));
      } else if (resData?.error?.toLowerCase().includes("already exists")) {
        setError("An account with this email or username already exists. Please try a different one.");
      } else {
        setError(
          resData?.error || resData?.message || "Account creation failed. Please check your information and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="paper-container">
        <div className="form-header">
          <h2 className="form-title">Join the Chit-Chat Community</h2>
          <div className="signup-subtitle">
            Fill in your details to get started
          </div>
        </div>

        {error && (
          <Alert
            severity="error"
            className="error-alert"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-field">
            <TextField
              fullWidth
              label="First Name"
              className="signup-input"
              {...register("first_name", {
                required: "First name is required",
                minLength: {
                  value: 2,
                  message: "First name must be at least 2 characters",
                },
              })}
              error={!!errors.first_name}
              helperText={errors.first_name?.message || ""}
            />
          </div>

          <div className="form-field">
            <TextField
              fullWidth
              label="Last Name"
              className="signup-input"
              {...register("last_name", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Last name must be at least 2 characters",
                },
              })}
              error={!!errors.last_name}
              helperText={errors.last_name?.message || ""}
            />
          </div>

          <div className="form-field">
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              className="signup-input"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message || ""}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#6c757d" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>

          <div className="form-field">
            <TextField
              fullWidth
              label="Username"
              className="signup-input"
              placeholder="Choose a username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              })}
              error={!!errors.username}
              helperText={errors.username?.message || ""}
            />
          </div>

          <div className="form-field">
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              className="signup-input"
              placeholder="Create a strong password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                },
              })}
              error={!!errors.password}
              helperText={
                errors.password?.message || "Strong password recommended"
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#6c757d" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>

          <div className="form-field">
            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              className="signup-input"
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message || ""}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#6c757d" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>

          <StyledButton
            type="submit"
            className="submitBtn"
            disabled={isLoading}
            fullWidth={false}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </StyledButton>
        </form>

        <div className="signup-prompt">
          <div className="signin-text">Already have an account?</div>
          <StyledButton
            variant="outlined"
            className="signin-button"
            onClick={() => navigate("/login")}
          >
            Sign In
          </StyledButton>
        </div>
      </div>
    </div>
  );
}
