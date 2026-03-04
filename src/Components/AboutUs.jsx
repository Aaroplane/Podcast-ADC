import { Box, Container, Typography, Card } from "@mui/material";
import {
  Mic,
  AutoAwesome,
  RecordVoiceOver,
  Speed,
  Security,
  CloudDownload,
} from "@mui/icons-material";
import "../Styling/AboutUsStyling.scss";

const features = [
  {
    icon: <AutoAwesome />,
    title: "AI-Powered Scripts",
    description:
      "Generate professional podcast scripts on any topic using advanced AI. Choose from 14 mood presets to match your style.",
  },
  {
    icon: <RecordVoiceOver />,
    title: "Multi-Speaker Conversations",
    description:
      "Create dynamic conversations with up to 3 speakers — host, co-host, and narrator — each with a unique voice.",
  },
  {
    icon: <Mic />,
    title: "Text-to-Speech Audio",
    description:
      "Convert your scripts into natural-sounding audio using Edge TTS technology. No API keys required.",
  },
  {
    icon: <Speed />,
    title: "Fast & Simple",
    description:
      "Go from topic idea to finished audio in minutes. No recording equipment needed — just your creativity.",
  },
  {
    icon: <Security />,
    title: "Secure & Private",
    description:
      "JWT authentication with refresh token rotation keeps your account safe. Your content is yours.",
  },
  {
    icon: <CloudDownload />,
    title: "Save & Download",
    description:
      "Scripts and audio persist in your library. Download MP3 files anytime or stream directly from the dashboard.",
  },
];

export default function AboutUs() {
  return (
    <Box className="about-us">
      <Box className="about-hero">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" className="hero-title">
            About ChitChat Podcast
          </Typography>
          <Typography variant="h6" className="hero-subtitle">
            Turn any topic into a podcast — powered by AI, voiced by technology,
            driven by your creativity.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" className="about-content">
        <Box className="about-section">
          <Typography variant="h4" className="section-title">
            What is ChitChat?
          </Typography>
          <Typography variant="body1" className="section-text">
            ChitChat Podcast is an AI-powered podcast creation platform that lets
            anyone generate professional podcast scripts and convert them into
            natural-sounding audio — no microphone, studio, or editing software
            required. Whether you want a solo monologue, a two-person
            conversation, or a narrated discussion, ChitChat handles it all.
          </Typography>
        </Box>

        <Box className="about-section">
          <Typography variant="h4" className="section-title">
            How It Works
          </Typography>
          <Typography variant="body1" className="section-text">
            Enter a topic, pick a mood, choose your speaker count, and hit
            generate. Our AI creates a structured script tailored to your
            preferences. Then convert it to audio with one click — the system
            assigns distinct voices to each speaker and stitches everything
            together into a downloadable MP3. Your scripts and audio are saved to
            your personal library for later access.
          </Typography>
        </Box>

        <Box className="about-section">
          <Typography variant="h4" className="section-title">
            Features
          </Typography>
          <Box className="features-grid">
            {features.map((feature) => (
              <Card key={feature.title} className="feature-card" elevation={0}>
                <Box className="feature-icon">{feature.icon}</Box>
                <Typography variant="h6" className="feature-title">
                  {feature.title}
                </Typography>
                <Typography variant="body2" className="feature-description">
                  {feature.description}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      <Box className="team-section">
        <Container maxWidth="md">
          <Typography variant="h4" className="team-title">
            Built with Purpose
          </Typography>
          <Typography variant="body1" className="team-description">
            ChitChat Podcast was built to democratize podcast creation. We
            believe everyone has stories worth sharing, and technology should make
            it easy to bring those stories to life. Our platform combines AI
            script generation, text-to-speech synthesis, and cloud storage into
            one seamless experience.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
