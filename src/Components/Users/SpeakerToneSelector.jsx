import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import "../../Styling/SpeakerToneSelectorStyling.scss";

const toneOptions = ["casual", "balanced", "debate", "heated", "deep-dive"];

export default function SpeakerToneSelector({ register, watch, errors }) {
  const speakers = watch("speakers") || 1;

  return (
    <Box className="speaker-tone-selector">
      <Box className="form-field">
        <Typography variant="subtitle1" className="field-label">
          Number of Speakers
        </Typography>
        <FormControl error={!!errors?.speakers}>
          <RadioGroup
            row
            value={String(speakers)}
            className="speaker-radio-group"
          >
            {[1, 2, 3].map((num) => (
              <FormControlLabel
                key={num}
                value={String(num)}
                control={<Radio className="speaker-radio" />}
                label={
                  num === 1
                    ? "Solo"
                    : num === 2
                    ? "Duo (Host + Co-host)"
                    : "Trio (+ Narrator)"
                }
                {...register("speakers", { valueAsNumber: true })}
                className="speaker-option"
              />
            ))}
          </RadioGroup>
          {errors?.speakers && (
            <FormHelperText>{errors.speakers.message}</FormHelperText>
          )}
        </FormControl>
      </Box>

      {Number(speakers) > 1 && (
        <Box className="form-field tone-field">
          <Typography variant="subtitle1" className="field-label">
            Conversation Tone
          </Typography>
          <FormControl fullWidth error={!!errors?.tone}>
            <Select
              {...register("tone", {
                required:
                  Number(speakers) > 1
                    ? "Please select a conversation tone"
                    : false,
              })}
              value={watch("tone") || ""}
              displayEmpty
              className="select-field"
            >
              <MenuItem value="">
                <em>Select conversation tone</em>
              </MenuItem>
              {toneOptions.map((tone) => (
                <MenuItem key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1).replace("-", " ")}
                </MenuItem>
              ))}
            </Select>
            {errors?.tone && (
              <FormHelperText>{errors.tone.message}</FormHelperText>
            )}
          </FormControl>
        </Box>
      )}
    </Box>
  );
}
