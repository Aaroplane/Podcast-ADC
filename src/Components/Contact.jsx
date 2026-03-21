import { Card, CardContent, Box, Container, Typography, Button } from "@mui/material";
import { Email, Phone } from "@mui/icons-material";
import "../Styling/Contact.scss";
import ContactPhoto from "../assets/ContactPhoto.jpeg";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="hero-section">
        <Container className="hero-title-section">
          <Typography variant="h2" className="hero-title">
            Get to know the Creator!
          </Typography>
          <div className="hero-divider"></div>
        </Container>

        <div className="main-content">
          <div className="content-grid">
            <Container className="creator-section">
              <div className="creator-photo-wrapper">
                <div className="photo-glow"></div>
                <Box className="photo-container">
                  <Box className="photo-placeholder">
                    <Box
                      component="img"
                      src={ContactPhoto}
                      alt="Creator"
                      className="creator-photo"
                    />
                  </Box>
                </Box>
              </div>
              <Typography className="creator-name">Aaron - The Creator</Typography>
            </Container>

            <div className="contact-info-section">
              <Card className="contact-card">
                <CardContent className="contact-card-content">
                  <Typography variant="h4" className="contact-title">
                    Contact Me
                  </Typography>
                  <Typography className="contact-description">
                    If you have any questions, feedback, or just want to say
                    hello, feel free to reach out!
                  </Typography>

                  <div className="contact-methods">
                    <div className="contact-method email-method">
                      <div className="contact-icon email-icon">
                        <Email className="icon" />
                      </div>
                      <div>
                        <Typography className="contact-method-label">Email</Typography>
                        <a
                          href="mailto:aarocons@gmail.com"
                          className="contact-method-value email-link"
                        >
                          Aarocons@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="contact-method phone-method">
                      <div className="contact-icon phone-icon">
                        <Phone className="icon" />
                      </div>
                      <div>
                        <Typography className="contact-method-label">Phone</Typography>
                        <Typography className="contact-method-value">
                          Available upon request
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <Box className="contact-actions">
                    <Button
                      className="send-email-btn"
                      onClick={() =>
                        (window.location.href = "mailto:aarocons@gmail.com")
                      }
                    >
                      Send Email
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="additional-info">
          <Card className="info-card">
            <CardContent className="info-card-content">
              <Typography variant="h5" className="info-title">
                Let's Connect!
              </Typography>
              <Typography className="info-description">
                I'm always excited to discuss new projects, creative ideas, or
                opportunities to be part of your visions. Whether you're looking
                for collaboration or just want to chat about technology and
                design, I'd love to hear from you over some coffee/tea.
              </Typography>
              <div className="info-dots">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
