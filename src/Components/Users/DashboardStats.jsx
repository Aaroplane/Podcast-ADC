import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {
  Podcasts,
  Description,
  Audiotrack,
  TextSnippet,
  CalendarMonth,
} from "@mui/icons-material";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import "../../Styling/DashboardStatsStyling.scss";

const statIcons = {
  totalEntries: <Podcasts />,
  entriesWithScripts: <Description />,
  entriesWithAudio: <Audiotrack />,
  totalScriptWordCount: <TextSnippet />,
};

const statLabels = {
  totalEntries: "Total Podcasts",
  entriesWithScripts: "With Scripts",
  entriesWithAudio: "With Audio",
  totalScriptWordCount: "Total Words",
};

export default function DashboardStats() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get(`/users/${user.id}/dashboard`);
        setDashboard(response.data);
      } catch (err) {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user.id]);

  if (loading) {
    return (
      <Box className="dashboard-stats-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="dashboard-stats-error">
        {error}
      </Typography>
    );
  }

  if (!dashboard) return null;

  const { profile, stats, entriesByMonth } = dashboard;

  return (
    <Box className="dashboard-stats">
      <Box className="member-info">
        <Typography variant="h6" className="welcome-text">
          Welcome, {profile.name}
        </Typography>
        <Typography variant="body2" className="member-since">
          Member for {profile.accountAgeDays} days
        </Typography>
      </Box>

      <Box className="stat-cards">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key} className="stat-card">
            <CardContent className="stat-card-content">
              <Box className="stat-icon">{statIcons[key]}</Box>
              <Typography variant="h4" className="stat-value">
                {value.toLocaleString()}
              </Typography>
              <Typography variant="body2" className="stat-label">
                {statLabels[key]}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {entriesByMonth && entriesByMonth.length > 0 && (
        <Box className="activity-section">
          <Typography variant="h6" className="activity-title">
            <CalendarMonth sx={{ mr: 1, verticalAlign: "middle" }} />
            Activity Timeline
          </Typography>
          <Box className="activity-chart">
            {entriesByMonth.map((item) => {
              const maxCount = Math.max(...entriesByMonth.map((e) => e.count));
              const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              return (
                <Box key={item.month} className="activity-row">
                  <Typography variant="body2" className="activity-month">
                    {item.month}
                  </Typography>
                  <Box className="activity-bar-container">
                    <Box
                      className="activity-bar"
                      sx={{ width: `${barWidth}%` }}
                    />
                  </Box>
                  <Typography variant="body2" className="activity-count">
                    {item.count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
