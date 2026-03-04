import { Box, Typography } from "@mui/material";
import "../../Styling/ConversationScriptRendererStyling.scss";

const speakerColors = {
  host: { bg: "rgba(93, 237, 245, 0.15)", border: "rgb(93, 237, 245)", label: "#0097a7" },
  cohost: { bg: "rgba(29, 58, 138, 0.1)", border: "rgb(29, 58, 138)", label: "#1d3a8a" },
  narrator: { bg: "rgba(158, 158, 158, 0.1)", border: "#9e9e9e", label: "#616161" },
};

export default function ConversationScriptRenderer({ script }) {
  if (!script) return null;

  const isConversation = Array.isArray(script.turns);

  if (isConversation) {
    return (
      <Box className="conversation-renderer">
        <Typography variant="h6" className="script-title">
          {script.title}
        </Typography>
        {script.description && (
          <Typography variant="body2" className="script-description">
            {script.description}
          </Typography>
        )}

        <Box className="turns-container">
          {script.turns.map((turn, index) => {
            const colors = speakerColors[turn.speaker] || speakerColors.host;
            const isHost = turn.speaker === "host";

            return (
              <Box
                key={index}
                className={`turn-bubble ${isHost ? "turn-left" : "turn-right"}`}
                sx={{
                  backgroundColor: colors.bg,
                  borderLeft: isHost ? `4px solid ${colors.border}` : "none",
                  borderRight: !isHost ? `4px solid ${colors.border}` : "none",
                }}
              >
                <Typography
                  variant="caption"
                  className="speaker-label"
                  sx={{ color: colors.label }}
                >
                  {turn.speaker.charAt(0).toUpperCase() + turn.speaker.slice(1)}
                </Typography>
                <Typography variant="body1" className="turn-text">
                  {turn.text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  // Single-speaker: key-value display
  return (
    <Box className="single-script-renderer">
      {Object.entries(script).map(([key, value]) => (
        <Box key={key} className="script-section">
          <Typography variant="h6" className="section-title">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}:
          </Typography>
          <Typography variant="body1" className="section-content">
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
