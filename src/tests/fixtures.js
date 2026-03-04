// Test fixtures — shared test data for all phases

export const testUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  username: "testuser",
};

export const validMoods = [
  "professional",
  "casual",
  "humorous",
  "serious",
  "educational",
  "inspirational",
  "conversational",
  "dramatic",
  "storytelling",
  "investigative",
  "lighthearted",
  "energetic",
  "calm",
  "suspenseful",
];

export const invalidMoods = ["Enthusiastic", "Informative", "Happy", "Sad"];

export const moodGroups = [
  { label: "Conversational", moods: ["conversational", "casual", "lighthearted"] },
  { label: "Professional", moods: ["professional", "educational", "inspirational"] },
  { label: "Creative", moods: ["dramatic", "storytelling", "humorous"] },
  { label: "Intense", moods: ["investigative", "energetic", "suspenseful", "serious"] },
  { label: "Calm", moods: ["calm"] },
];

export const validTones = ["casual", "balanced", "debate", "heated", "deep-dive"];

export const singleSpeakerScript = {
  title: "Test Podcast",
  description: "A test podcast about testing",
  introduction: "Welcome to the show!",
  mainContent: "Here is the main content about testing frameworks...",
  conclusion: "Thanks for listening!",
};

export const multiSpeakerScript = {
  title: "Duo Podcast",
  description: "A conversation between host and cohost",
  turns: [
    { speaker: "host", text: "Welcome to our show!" },
    { speaker: "cohost", text: "Great to be here!" },
    { speaker: "host", text: "Today we discuss testing." },
    { speaker: "cohost", text: "An important topic indeed." },
  ],
};

export const trioSpeakerScript = {
  title: "Trio Podcast",
  description: "A conversation with narrator",
  turns: [
    { speaker: "narrator", text: "In today's episode..." },
    { speaker: "host", text: "Welcome everyone!" },
    { speaker: "cohost", text: "Happy to be here!" },
    { speaker: "narrator", text: "They began their discussion..." },
  ],
};

export const voicesResponse = {
  host: "en-US-GuyNeural",
  cohost: "en-US-JennyNeural",
  narrator: "en-GB-RyanNeural",
};

export const dashboardResponse = {
  profile: {
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    memberSince: "2026-01-15T00:00:00.000Z",
    accountAgeDays: 47,
  },
  stats: {
    totalEntries: 5,
    entriesWithScripts: 3,
    entriesWithAudio: 2,
    totalScriptWordCount: 1250,
  },
  recentEntries: [],
  entriesByMonth: [
    { month: "2026-02", count: 3 },
    { month: "2026-01", count: 2 },
  ],
};

export const userProfileResponse = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  email: "test@example.com",
  phone_number: "555-0100",
  created_at: "2026-01-15T00:00:00.000Z",
};

export const loginResponse = {
  token: "eyJhbGciOiJIUzI1NiJ9.access",
  refreshToken: "eyJhbGciOiJIUzI1NiJ9.refresh",
  user: testUser,
};

export const refreshResponse = {
  token: "eyJhbGciOiJIUzI1NiJ9.newaccess",
  refreshToken: "eyJhbGciOiJIUzI1NiJ9.newrefresh",
};

export const validationErrorResponse = {
  error: "Validation failed",
  details: [
    { field: "password", message: "Must be at least 8 characters" },
    { field: "email", message: "Invalid email format" },
  ],
};

export const podcastEntry = {
  id: "660e8400-e29b-41d4-a716-446655440001",
  title: "Test Podcast",
  description: "A test podcast",
  audio_url: "https://example.com/audio.mp3",
  script_content: true,
  mood: "casual",
  createdAt: "2026-03-01",
};
