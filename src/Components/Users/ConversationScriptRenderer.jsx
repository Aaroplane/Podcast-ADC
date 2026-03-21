import { Box, Typography } from "@mui/material";
import "../../Styling/ConversationScriptRendererStyling.scss";

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
            const isHost = turn.speaker === "host";
            const speakerClass = `turn-${turn.speaker}`;

            return (
              <Box
                key={index}
                className={`turn-bubble ${isHost ? "turn-left" : "turn-right"} ${speakerClass}`}
              >
                <Typography
                  variant="caption"
                  className={`speaker-label label-${turn.speaker}`}
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
