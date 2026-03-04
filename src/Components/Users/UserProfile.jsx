import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Person,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import "../../Styling/UserProfileStyling.scss";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${user.id}`);
        setProfile(response.data);
        reset({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          username: response.data.username || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.id, reset]);

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    // Build payload with all required fields (backend requires all fields)
    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      phone_number: data.phone_number || "",
      sex_at_birth: profile?.sex_at_birth || "",
      gender_identity: profile?.gender_identity || "",
      date_of_birth: profile?.date_of_birth || "",
    };

    // Include password only if provided
    if (data.password) {
      payload.password = data.password;
    }

    try {
      const response = await api.put(`/users/${user.id}`, payload);
      setProfile(response.data);
      setEditing(false);
      setSuccess("Profile updated successfully!");

      // Update auth context if name changed
      if (dirtyFields.first_name || dirtyFields.last_name) {
        const updatedUser = {
          ...user,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      const resData = err.response?.data;
      if (resData?.details?.length) {
        setError(resData.details.map((d) => d.message).join(". "));
      } else {
        setError(resData?.error || "Failed to update profile.");
      }
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    reset({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      username: profile?.username || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
    });
  };

  if (loading) {
    return (
      <Box className="profile-loading">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="user-profile">
      <Box className="profile-header">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" className="profile-title">
            My Profile
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" className="profile-content">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <Card className="profile-card">
          <CardHeader
            className="profile-card-header"
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Person />
                <Typography variant="h5">Profile Information</Typography>
              </Box>
            }
            action={
              !editing && (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                  variant="outlined"
                  size="small"
                >
                  Edit
                </Button>
              )
            }
          />
          <CardContent className="profile-card-content">
            {editing ? (
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                className="profile-form"
              >
                <Box className="form-row">
                  <TextField
                    fullWidth
                    label="First Name"
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: { value: 3, message: "Min 3 characters" },
                  })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register("phone_number")}
                />

                <TextField
                  fullWidth
                  label="New Password (leave blank to keep current)"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    minLength: {
                      value: 8,
                      message: "Min 8 characters",
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
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
                  }}
                />

                <Box className="form-actions">
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    className="save-button"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box className="profile-display">
                <Box className="profile-field">
                  <Typography variant="body2" className="field-label">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {profile?.first_name} {profile?.last_name}
                  </Typography>
                </Box>
                <Box className="profile-field">
                  <Typography variant="body2" className="field-label">
                    Username
                  </Typography>
                  <Typography variant="body1">{profile?.username}</Typography>
                </Box>
                <Box className="profile-field">
                  <Typography variant="body2" className="field-label">
                    Email
                  </Typography>
                  <Typography variant="body1">{profile?.email}</Typography>
                </Box>
                {profile?.phone_number && (
                  <Box className="profile-field">
                    <Typography variant="body2" className="field-label">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {profile.phone_number}
                    </Typography>
                  </Box>
                )}
                <Box className="profile-field">
                  <Typography variant="body2" className="field-label">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {new Date(profile?.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
