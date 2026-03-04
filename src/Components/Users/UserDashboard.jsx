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
  FormControl,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  CircularProgress,
  Paper,
  FormHelperText,
  ListSubheader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Mic,
  MusicNote,
  Delete,
  Download,
  ExpandMore,
  Visibility,
} from "@mui/icons-material";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import SpeakerToneSelector from "./SpeakerToneSelector";
import ConversationScriptRenderer from "./ConversationScriptRenderer";
import DashboardStats from "./DashboardStats";
import VoicePicker from "./VoicePicker";
import "../../Styling/UserDashboardStyling.scss";

const PodcastDashboard = () => {
  const [podcastEntries, setPodcastEntries] = useState([]);
  const [currentStep, setCurrentStep] = useState("form");
  const [isLoading, setIsLoading] = useState(false);
  const [currentScript, setCurrentScript] = useState(null);
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [text, setText] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, title: "" });
  const [viewingScript, setViewingScript] = useState(null);
  const [selectedVoices, setSelectedVoices] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      prompt: "",
      mood: "",
      speakers: 1,
      tone: "",
    },
  });

  const moodGroups = [
    {
      label: "Conversational",
      moods: ["conversational", "casual", "lighthearted"],
    },
    {
      label: "Professional",
      moods: ["professional", "educational", "inspirational"],
    },
    {
      label: "Creative",
      moods: ["dramatic", "storytelling", "humorous"],
    },
    {
      label: "Intense",
      moods: ["investigative", "energetic", "suspenseful", "serious"],
    },
    {
      label: "Calm",
      moods: ["calm"],
    },
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const body = { podcastentry: data.prompt, mood: data.mood };
      const speakerCount = Number(data.speakers) || 1;
      if (speakerCount > 1) {
        body.speakers = speakerCount;
        body.tone = data.tone;
      }

      const response = await api.post(
        `/users/${user.id}/podcastentries/script`,
        body
      );
      setCurrentScript(response.data);
      setCurrentStep("script");
      setIsLoading(false);
      localStorage.setItem("script", JSON.stringify(response.data));
    } catch (error) {
      const resData = error.response?.data;
      if (resData?.details?.length) {
        setError(resData.details.map((d) => d.message).join(". "));
      } else {
        setError(resData?.error || "Failed to generate script. Please try again.");
      }
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  const handleConvertToAudio = async () => {
    setCurrentStep("audio");
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Create entry in backend
      const entryRes = await api.post(
        `/users/${user.id}/podcastentries`,
        {
          title: currentScript?.title || "Untitled Podcast",
          description: currentScript?.description || "No description",
          audio_url: "pending",
        }
      );
      const entryId = entryRes.data.id;

      // Step 2: Save script to the entry
      if (currentScript) {
        const scriptPayload = Array.isArray(currentScript.turns)
          ? currentScript
          : {
              title: currentScript.title,
              description: currentScript.description,
              introduction: currentScript.introduction,
              mainContent: currentScript.mainContent,
              conclusion: currentScript.conclusion,
            };
        await api.put(
          `/users/${user.id}/podcastentries/${entryId}/script`,
          scriptPayload
        );
      }

      // Step 3: Generate audio with entry_id for Cloudinary persistence
      const isConversation = Array.isArray(currentScript?.turns);
      let response;

      if (isConversation) {
        response = await api.post(
          `/users/${user.id}/podcastentries/audio/conversation`,
          { turns: currentScript.turns, entry_id: entryId },
          { responseType: "blob" }
        );
      } else {
        const audioBody = { text, entry_id: entryId };
        if (selectedVoices.host) {
          audioBody.voice = selectedVoices.host;
        }
        response = await api.post(
          `/users/${user.id}/podcastentries/audio`,
          audioBody,
          { responseType: "blob" }
        );
      }

      // Step 4: Handle dual response format
      let finalAudioUrl;
      const contentType = response.headers?.["content-type"] || "";

      if (contentType.includes("application/json")) {
        // Cloudinary response: JSON with audio_url
        const text = await response.data.text();
        const jsonData = JSON.parse(text);
        finalAudioUrl = jsonData.audio_url;
      } else {
        // Blob response: create object URL
        finalAudioUrl = URL.createObjectURL(response.data);
      }

      setAudioUrl(finalAudioUrl);

      // Step 5: Refresh entries from backend
      const entriesRes = await api.get(
        `/users/${user.id}/podcastentries`
      );
      setPodcastEntries(entriesRes.data);
    } catch (err) {
      setError("Failed to convert text to audio. Please try again.");
    } finally {
      setIsLoading(false);
      setCurrentStep("form");
      setCurrentScript(null);
      reset();
    }
  };

  const deletePodcast = async (id) => {
    try {
      await api.delete(`/users/${user.id}/podcastentries/${id}`);
      setPodcastEntries((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete podcast. Please try again.");
    } finally {
      setDeleteConfirm({ open: false, id: null, title: "" });
    }
  };

  const handleDownload = (podcast) => {
    const a = document.createElement("a");
    a.href = podcast.audio_url;
    a.download = `${podcast.title || "podcast"}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetToForm = () => {
    setCurrentStep("form");
    setCurrentScript(null);
    setIsLoading(false);
  };

  const handleViewScript = async (entryId) => {
    try {
      const response = await api.get(
        `/users/${user.id}/podcastentries/${entryId}/script`
      );
      setViewingScript(response.data);
    } catch (err) {
      setError("Failed to load script.");
    }
  };

  const handleVoiceChange = (role, voice) => {
    setSelectedVoices((prev) => ({ ...prev, [role]: voice }));
  };

  const formData = watch();

  useEffect(() => {
    if (currentScript) {
      if (Array.isArray(currentScript.turns)) {
        // Multi-speaker: text is handled by /audio/conversation endpoint
        const turnsText = currentScript.turns
          .map((t) => `${t.speaker}: ${t.text}`)
          .join("\n");
        setText(turnsText);
      } else {
        const scriptString = `
          ${currentScript.title || ""}
          ${currentScript.description || ""}
          ${currentScript.introduction || ""}
          ${currentScript.mainContent || ""}
          ${currentScript.conclusion || ""}
        `.trim();
        setText(scriptString);
      }
    }
  }, [currentScript]);

  useEffect(() => {
    const fetchPodcastEntries = async () => {
      try {
        const response = await api.get(
          `/users/${user.id}/podcastentries`
        );
        setPodcastEntries(response.data);
      } catch (error) {
        console.error("Error fetching podcast entries:", error);
      }
    };

    fetchPodcastEntries();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [user.id]);

  return (
    <Box className="podcast-dashboard">
      {/* Header */}
      <Box className="header">
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" className="header-title">
            Chit Chat Podcasts
          </Typography>
          <Typography variant="h5" className="header-subtitle">
            {user.firstName}'s Personalized Creator
          </Typography>
        </Container>
      </Box>

      {/* Dashboard Stats */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <DashboardStats />
      </Container>

      {/* Main Content */}
      <Container maxWidth="xl" className="main-content">
        <Box className="content-grid">
          <Card className="card">
            <CardHeader
              className="card-header"
              title={
                <Box className="card-header-content">
                  <Mic />
                  <Typography variant="h5">Create Your Podcast</Typography>
                </Box>
              }
            />
            <CardContent className="card-content">
              {currentStep === "form" && (
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="form-container"
                >
                  <Box className="form-field">
                    <Typography variant="subtitle1" className="field-label">
                      Podcast Topic
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="What do you want to chat about today?"
                      {...register("prompt", {
                        required: "Podcast topic is required",
                        minLength: {
                          value: 10,
                          message: "Topic must be at least 10 characters long",
                        },
                      })}
                      error={!!errors.prompt}
                      className="text-field"
                    />
                    {errors.prompt && (
                      <FormHelperText error>
                        {errors.prompt.message}
                      </FormHelperText>
                    )}
                  </Box>

                  <Box className="form-field">
                    <Typography variant="subtitle1" className="field-label">
                      Mood & Tone
                    </Typography>
                    <FormControl fullWidth error={!!errors.mood}>
                      <Select
                        {...register("mood", {
                          required: "Please select a mood",
                        })}
                        value={formData.mood || ""}
                        displayEmpty
                        className="select-field"
                      >
                        <MenuItem value="">
                          <em>Select the mood for your podcast</em>
                        </MenuItem>
                        {moodGroups.flatMap((group) => [
                          <ListSubheader key={group.label}>
                            {group.label}
                          </ListSubheader>,
                          ...group.moods.map((mood) => (
                            <MenuItem key={mood} value={mood}>
                              {mood.charAt(0).toUpperCase() + mood.slice(1)}
                            </MenuItem>
                          )),
                        ])}
                      </Select>
                      {errors.mood && (
                        <FormHelperText>{errors.mood.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <SpeakerToneSelector
                    register={register}
                    watch={watch}
                    errors={errors}
                  />

                  <VoicePicker
                    speakers={formData.speakers}
                    selectedVoices={selectedVoices}
                    onVoiceChange={handleVoiceChange}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    className="submit-button"
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {isLoading
                      ? "Creating Script..."
                      : "Generate Podcast Script"}
                  </Button>
                </Box>
              )}

              {currentStep === "script" && currentScript && (
                <Box className="script-container">
                  <Box className="script-header">
                    <Typography variant="h5" className="script-title">
                      Your Script is Ready!
                    </Typography>
                    <Badge className="mood-badge">Mood: {formData.mood}</Badge>
                  </Box>

                  <Paper className="script-content">
                    <ConversationScriptRenderer script={currentScript} />
                  </Paper>

                  <Box className="script-actions">
                    <Button
                      variant="contained"
                      onClick={handleConvertToAudio}
                      startIcon={<MusicNote />}
                      className="convert-button"
                    >
                      Convert to Audio
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={resetToForm}
                      className="back-button"
                    >
                      Back to Form
                    </Button>
                  </Box>
                </Box>
              )}

              {currentStep === "audio" && (
                <Box className="audio-loading">
                  <CircularProgress size={60} sx={{ mb: 3 }} />
                  <Typography variant="h6" className="loading-title">
                    Converting to Audio...
                  </Typography>
                  <Typography variant="body1" className="loading-subtitle">
                    Please wait while we create your podcast audio
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Podcast Library */}
          <Card className="card">
            <CardHeader
              className="card-header library-header"
              title={
                <Box className="card-header-content">
                  <MusicNote />
                  <Typography variant="h5">
                    Podcast Library ({podcastEntries.length})
                  </Typography>
                </Box>
              }
            />
            <CardContent className="library-content">
              {podcastEntries.length === 0 ? (
                <Box className="empty-library">
                  <MusicNote className="empty-icon" />
                  <Typography variant="h6" className="empty-title">
                    No podcasts yet
                  </Typography>
                  <Typography variant="body1">
                    Create your first podcast to get started!
                  </Typography>
                </Box>
              ) : (
                <Box className="library-list">
                  {podcastEntries.map((podcast) => (
                    <Accordion key={podcast.id} className="podcast-accordion">
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box>
                          <Typography variant="h6" className="podcast-title">
                            {podcast.title}
                          </Typography>
                          <Box className="podcast-badges">
                            {podcast.mood && (
                              <Badge className="badge mood-badge">
                                {podcast.mood}
                              </Badge>
                            )}
                            <Badge className="badge date-badge">
                              {podcast.createdAt}
                            </Badge>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant="body1"
                          className="podcast-description"
                        >
                          {podcast.description}
                        </Typography>

                        {podcast.audio_url && (
                          <Paper className="audio-player">
                            <audio controls>
                              <source
                                src={podcast.audio_url}
                                type="audio/mpeg"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          </Paper>
                        )}

                        <Box className="podcast-actions">
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                id: podcast.id,
                                title: podcast.title,
                              })
                            }
                            startIcon={<Delete />}
                          >
                            Delete
                          </Button>
                          {podcast.audio_url && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Download />}
                              onClick={() => handleDownload(podcast)}
                            >
                              Download
                            </Button>
                          )}
                          {podcast.script_content && (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() => handleViewScript(podcast.id)}
                            >
                              View Script
                            </Button>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Error Alert */}
      {error && (
        <Box sx={{ position: "fixed", bottom: 24, left: 24, right: 24, zIndex: 1300 }}>
          <Paper sx={{ p: 2, bgcolor: "#fdeded", border: "1px solid #f5c6cb", borderRadius: 2 }}>
            <Typography color="error">{error}</Typography>
            <Button size="small" onClick={() => setError("")} sx={{ mt: 1 }}>
              Dismiss
            </Button>
          </Paper>
        </Box>
      )}

      {/* View Script Dialog */}
      <Dialog
        open={!!viewingScript}
        onClose={() => setViewingScript(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Saved Script</DialogTitle>
        <DialogContent>
          <ConversationScriptRenderer script={viewingScript} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingScript(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null, title: "" })}
      >
        <DialogTitle>Delete Podcast</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteConfirm.title}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteConfirm({ open: false, id: null, title: "" })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => deletePodcast(deleteConfirm.id)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PodcastDashboard;
