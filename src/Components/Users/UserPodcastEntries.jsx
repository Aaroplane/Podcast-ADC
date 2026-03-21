import { useState } from "react";
import api from "../../utils/api";
import {
  StyledButton,
  StyledContainer,
} from "../../Styling/theme";
import {
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../contexts/AuthContext";
import "../../Styling/EntriesStyling.scss";
import PropTypes from 'prop-types';

export default function UserPodcastEntries({podcastEntries, setPodcastEntries}) {
  const { user } = useAuth();
  const [error, setError] = useState(null);

  const deletePodcast = async (podcastId) => {
    try {
      await api.delete(`/users/${user.id}/podcastentries/${podcastId}`);
      setPodcastEntries((prev) =>
        prev.filter((podcast) => podcast.id !== podcastId)
      );
    } catch (error) {
      setError("Failed to delete podcast");
    }
  };

  if (!podcastEntries) {
    return <p>Loading podcasts...</p>;
  }

  if (podcastEntries.length === 0) {
    return (
      <StyledContainer className="entry_container">
        <h1>{user.firstName}'s Podcasts</h1>
        <p>No Podcasts yet. Create your first one!</p>
      </StyledContainer>
    );
  }

  return (
    <div className="entry_container">
      <Container className="accordion_container">
        <div>
          <Typography className="accordion-title">Podcast Library</Typography>
          {podcastEntries.map((podcast, index) => (
            <Accordion className="accordion-item" key={podcast.id}>
              <AccordionSummary
                className="accordion-summary"
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-content-${index}`}
                id={`panel-header-${index}`}
              >
                <Typography>{podcast.title}</Typography>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <Typography>{podcast.description}</Typography>
                {podcast.audio_url && (
                  <audio controls className="accordion-audio">
                    <source src={podcast.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <div className="accordion-actions">
                  <StyledButton
                    onClick={() => deletePodcast(podcast.id)}
                    color="primary"
                    size="small"
                  >
                    Delete
                  </StyledButton>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container>
    </div>
  );
}

UserPodcastEntries.propTypes = {
  podcastEntries: PropTypes.array.isRequired,
  setPodcastEntries: PropTypes.func.isRequired,
};
