import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import "../../Styling/VoicePickerStyling.scss";

const roleLabels = {
  host: "Host Voice",
  cohost: "Co-host Voice",
  narrator: "Narrator Voice",
};

export default function VoicePicker({ speakers, selectedVoices, onVoiceChange }) {
  const { user } = useAuth();
  const [voiceData, setVoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await api.get(
          `/users/${user.id}/podcastentries/audio/voices`
        );
        setVoiceData(response.data);
      } catch (err) {
        // Silently fail — voice picker is optional
      } finally {
        setLoading(false);
      }
    };

    fetchVoices();
  }, [user.id]);

  if (loading) {
    return (
      <Box className="voice-picker-loading">
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (!voiceData || !voiceData.voices) return null;

  const speakerCount = Number(speakers) || 1;
  const rolesToShow =
    speakerCount === 1
      ? ["host"]
      : speakerCount === 2
      ? ["host", "cohost"]
      : ["host", "cohost", "narrator"];

  return (
    <Box className="voice-picker">
      <Typography variant="subtitle1" className="field-label">
        Voice Selection
      </Typography>
      <Box className="voice-selectors">
        {rolesToShow.map((role) => (
          <FormControl key={role} fullWidth className="voice-select-control">
            <Typography variant="body2" className="voice-role-label">
              {roleLabels[role]}
            </Typography>
            <Select
              value={selectedVoices[role] || voiceData.roles?.[role] || voiceData.default || ""}
              onChange={(e) => onVoiceChange(role, e.target.value)}
              size="small"
              className="voice-select"
            >
              {voiceData.voices.map((voice) => (
                <MenuItem key={voice.key} value={voice.key}>
                  {voice.label} — {voice.accent} ({voice.gender})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </Box>
    </Box>
  );
}
