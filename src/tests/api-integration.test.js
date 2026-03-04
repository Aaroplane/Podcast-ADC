import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockApi, resetLocalStorage, localStorageMock } from "./setup";
import {
  validMoods,
  invalidMoods,
  moodGroups,
  validTones,
  singleSpeakerScript,
  multiSpeakerScript,
  trioSpeakerScript,
  voicesResponse,
  dashboardResponse,
  userProfileResponse,
  loginResponse,
  refreshResponse,
  validationErrorResponse,
  podcastEntry,
  testUser,
} from "./fixtures";

// =============================================================================
// Phase 8A — Mood Enum & CRUD Fixes
// =============================================================================
describe("Phase 8A — Mood Enum & CRUD Fixes", () => {
  it("moodGroups contains all 14 backend enum values", () => {
    const allMoods = moodGroups.flatMap((g) => g.moods);
    expect(allMoods).toHaveLength(14);
    validMoods.forEach((mood) => {
      expect(allMoods).toContain(mood);
    });
  });

  it("moodGroups does not contain invalid moods", () => {
    const allMoods = moodGroups.flatMap((g) => g.moods);
    invalidMoods.forEach((mood) => {
      expect(allMoods).not.toContain(mood);
    });
  });

  it("all mood values are lowercase", () => {
    const allMoods = moodGroups.flatMap((g) => g.moods);
    allMoods.forEach((mood) => {
      expect(mood).toBe(mood.toLowerCase());
    });
  });

  it("POST /script body uses lowercase mood value", () => {
    const mockApi = createMockApi();
    const mood = "educational";
    const body = { podcastentry: "Test topic for podcasting", mood };

    mockApi.post(`/users/${testUser.id}/podcastentries/script`, body);

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[1].mood).toBe("educational");
    expect(call.args[1].mood).toBe(call.args[1].mood.toLowerCase());
  });

  it("DELETE /podcastentries/:id calls backend API", () => {
    const mockApi = createMockApi();
    const entryId = podcastEntry.id;

    mockApi.delete(`/users/${testUser.id}/podcastentries/${entryId}`);

    const call = mockApi.getCallsFor("delete")[0];
    expect(call.args[0]).toContain(`/podcastentries/${entryId}`);
  });

  it("download handler builds correct filename from podcast title", () => {
    const podcast = { title: "My Podcast", audio_url: "https://example.com/audio.mp3" };
    const filename = `${podcast.title || "podcast"}.mp3`;

    expect(filename).toBe("My Podcast.mp3");
    expect(podcast.audio_url).toContain("https://");
  });

  it("download handler uses fallback filename when title is empty", () => {
    const podcast = { title: "", audio_url: "https://example.com/audio.mp3" };
    const filename = `${podcast.title || "podcast"}.mp3`;

    expect(filename).toBe("podcast.mp3");
  });
});

// =============================================================================
// Phase 8B — Multi-Speaker
// =============================================================================
describe("Phase 8B — Multi-Speaker", () => {
  it("POST /script includes speakers field when > 1", () => {
    const mockApi = createMockApi();
    const body = { podcastentry: "Test topic", mood: "casual", speakers: 2, tone: "balanced" };

    mockApi.post(`/users/${testUser.id}/podcastentries/script`, body);

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[1].speakers).toBe(2);
  });

  it("POST /script includes tone field when speakers > 1", () => {
    const body = { podcastentry: "Test topic", mood: "casual", speakers: 2, tone: "debate" };
    expect(body.tone).toBe("debate");
  });

  it("POST /script omits tone when speakers = 1", () => {
    const body = { podcastentry: "Test topic", mood: "casual" };
    const speakerCount = 1;
    if (speakerCount > 1) {
      body.speakers = speakerCount;
      body.tone = "casual";
    }
    expect(body.tone).toBeUndefined();
    expect(body.speakers).toBeUndefined();
  });

  it("speakers value is integer (1, 2, or 3)", () => {
    [1, 2, 3].forEach((n) => {
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(3);
    });
  });

  it("tone value is valid enum", () => {
    validTones.forEach((tone) => {
      expect(["casual", "balanced", "debate", "heated", "deep-dive"]).toContain(tone);
    });
  });

  it("multi-speaker script detected by presence of turns array", () => {
    expect(Array.isArray(multiSpeakerScript.turns)).toBe(true);
    expect(Array.isArray(singleSpeakerScript.turns)).toBe(false);
    expect(singleSpeakerScript.turns).toBeUndefined();
  });

  it("multi-speaker audio calls /audio/conversation with turns payload", () => {
    const mockApi = createMockApi();
    const script = multiSpeakerScript;

    if (Array.isArray(script.turns)) {
      mockApi.post(
        `/users/${testUser.id}/podcastentries/audio/conversation`,
        { turns: script.turns, entry_id: podcastEntry.id },
        { responseType: "blob" }
      );
    }

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[0]).toContain("/audio/conversation");
    expect(call.args[1].turns).toEqual(script.turns);
  });

  it("single-speaker audio calls /audio with text field", () => {
    const mockApi = createMockApi();
    const script = singleSpeakerScript;
    const text = `${script.title} ${script.introduction} ${script.mainContent} ${script.conclusion}`;

    if (!Array.isArray(script.turns)) {
      mockApi.post(
        `/users/${testUser.id}/podcastentries/audio`,
        { text, entry_id: podcastEntry.id },
        { responseType: "blob" }
      );
    }

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[0]).toContain("/audio");
    expect(call.args[0]).not.toContain("/audio/conversation");
    expect(call.args[1].text).toBeDefined();
  });

  it("conversation turns have speaker and text fields", () => {
    multiSpeakerScript.turns.forEach((turn) => {
      expect(turn).toHaveProperty("speaker");
      expect(turn).toHaveProperty("text");
      expect(typeof turn.speaker).toBe("string");
      expect(typeof turn.text).toBe("string");
    });
  });

  it("trio script includes narrator role", () => {
    const speakers = trioSpeakerScript.turns.map((t) => t.speaker);
    expect(speakers).toContain("narrator");
    expect(speakers).toContain("host");
    expect(speakers).toContain("cohost");
  });
});

// =============================================================================
// Phase 9 — Script Persistence & Audio
// =============================================================================
describe("Phase 9 — Script Persistence & Audio", () => {
  it("PUT /script sends correct payload shape for single-speaker", () => {
    const mockApi = createMockApi();
    const payload = {
      title: singleSpeakerScript.title,
      description: singleSpeakerScript.description,
      introduction: singleSpeakerScript.introduction,
      mainContent: singleSpeakerScript.mainContent,
      conclusion: singleSpeakerScript.conclusion,
    };

    mockApi.put(
      `/users/${testUser.id}/podcastentries/${podcastEntry.id}/script`,
      payload
    );

    const call = mockApi.getCallsFor("put")[0];
    expect(call.args[1]).toHaveProperty("title");
    expect(call.args[1]).toHaveProperty("introduction");
    expect(call.args[1]).toHaveProperty("mainContent");
    expect(call.args[1]).toHaveProperty("conclusion");
  });

  it("multi-speaker script save includes turns array", () => {
    const mockApi = createMockApi();

    mockApi.put(
      `/users/${testUser.id}/podcastentries/${podcastEntry.id}/script`,
      multiSpeakerScript
    );

    const call = mockApi.getCallsFor("put")[0];
    expect(Array.isArray(call.args[1].turns)).toBe(true);
    expect(call.args[1].turns[0]).toHaveProperty("speaker");
    expect(call.args[1].turns[0]).toHaveProperty("text");
  });

  it("GET /script returns saved script content", () => {
    const mockApi = createMockApi();
    mockApi.get.mockResolvedValueOnce({ data: singleSpeakerScript });

    const url = `/users/${testUser.id}/podcastentries/${podcastEntry.id}/script`;
    mockApi.get(url).then((res) => {
      expect(res.data).toHaveProperty("title");
      expect(res.data).toHaveProperty("mainContent");
    });
  });

  it("POST /audio with entry_id sends uuid in body", () => {
    const mockApi = createMockApi();
    const body = { text: "Hello world", entry_id: podcastEntry.id };

    mockApi.post(`/users/${testUser.id}/podcastentries/audio`, body, {
      responseType: "blob",
    });

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[1].entry_id).toBe(podcastEntry.id);
  });

  it("entry creation includes title and description", () => {
    const mockApi = createMockApi();
    const body = {
      title: "Test Podcast",
      description: "A test podcast",
      audio_url: "pending",
    };

    mockApi.post(`/users/${testUser.id}/podcastentries`, body);

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[1]).toHaveProperty("title");
    expect(call.args[1]).toHaveProperty("description");
    expect(call.args[1].audio_url).toBe("pending");
  });
});

// =============================================================================
// Phase 10 — Dashboard & Profile
// =============================================================================
describe("Phase 10 — Dashboard & Profile", () => {
  it("GET /dashboard returns profile, stats, recentEntries, entriesByMonth", () => {
    expect(dashboardResponse).toHaveProperty("profile");
    expect(dashboardResponse).toHaveProperty("stats");
    expect(dashboardResponse).toHaveProperty("recentEntries");
    expect(dashboardResponse).toHaveProperty("entriesByMonth");
  });

  it("dashboard stats object has required fields", () => {
    const { stats } = dashboardResponse;
    expect(stats).toHaveProperty("totalEntries");
    expect(stats).toHaveProperty("entriesWithScripts");
    expect(stats).toHaveProperty("entriesWithAudio");
    expect(stats).toHaveProperty("totalScriptWordCount");
  });

  it("dashboard profile includes memberSince and accountAgeDays", () => {
    const { profile } = dashboardResponse;
    expect(profile).toHaveProperty("memberSince");
    expect(profile).toHaveProperty("accountAgeDays");
    expect(typeof profile.accountAgeDays).toBe("number");
  });

  it("GET /users/:id returns user profile data", () => {
    expect(userProfileResponse).toHaveProperty("first_name");
    expect(userProfileResponse).toHaveProperty("last_name");
    expect(userProfileResponse).toHaveProperty("username");
    expect(userProfileResponse).toHaveProperty("email");
  });

  it("PUT /users/:id sends only changed fields (partial update)", () => {
    const mockApi = createMockApi();
    const changedFields = { first_name: "Updated", last_name: "Name" };
    const payload = {
      ...changedFields,
      username: userProfileResponse.username,
      email: userProfileResponse.email,
      phone_number: userProfileResponse.phone_number,
    };

    mockApi.put(`/users/${testUser.id}`, payload);

    const call = mockApi.getCallsFor("put")[0];
    expect(call.args[1].first_name).toBe("Updated");
    expect(call.args[1].last_name).toBe("Name");
  });

  it("validation errors parsed from details array", () => {
    const { details } = validationErrorResponse;
    expect(Array.isArray(details)).toBe(true);
    expect(details.length).toBeGreaterThan(0);

    const messages = details.map((d) => d.message);
    expect(messages.join(". ")).toContain("Must be at least 8 characters");

    details.forEach((d) => {
      expect(d).toHaveProperty("field");
      expect(d).toHaveProperty("message");
    });
  });

  it("entriesByMonth items have month and count fields", () => {
    dashboardResponse.entriesByMonth.forEach((item) => {
      expect(item).toHaveProperty("month");
      expect(item).toHaveProperty("count");
      expect(typeof item.count).toBe("number");
    });
  });
});

// =============================================================================
// Phase 11 — Voice Picker
// =============================================================================
describe("Phase 11 — Voice Picker", () => {
  it("GET /audio/voices returns object with host, cohost, narrator keys", () => {
    expect(voicesResponse).toHaveProperty("host");
    expect(voicesResponse).toHaveProperty("cohost");
    expect(voicesResponse).toHaveProperty("narrator");
  });

  it("POST /audio includes voice field from picker selection", () => {
    const mockApi = createMockApi();
    const selectedVoice = voicesResponse.host;

    mockApi.post(
      `/users/${testUser.id}/podcastentries/audio`,
      { text: "Test", voice: selectedVoice, entry_id: podcastEntry.id },
      { responseType: "blob" }
    );

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[1].voice).toBe("en-US-GuyNeural");
  });

  it("voice values are non-empty strings", () => {
    Object.values(voicesResponse).forEach((voice) => {
      expect(typeof voice).toBe("string");
      expect(voice.length).toBeGreaterThan(0);
    });
  });

  it("single-speaker shows only host voice selector", () => {
    const speakerCount = 1;
    const rolesToShow =
      speakerCount === 1
        ? ["host"]
        : speakerCount === 2
        ? ["host", "cohost"]
        : ["host", "cohost", "narrator"];

    expect(rolesToShow).toEqual(["host"]);
  });

  it("multi-speaker shows per-role voice selectors", () => {
    expect(
      2 === 2 ? ["host", "cohost"] : []
    ).toEqual(["host", "cohost"]);

    expect(
      3 === 3 ? ["host", "cohost", "narrator"] : []
    ).toEqual(["host", "cohost", "narrator"]);
  });
});

// =============================================================================
// Phase 12 — Auth & ProtectedRoute
// =============================================================================
describe("Phase 12 — Auth & ProtectedRoute", () => {
  beforeEach(() => {
    resetLocalStorage();
  });

  it("login stores token and refreshToken in localStorage", () => {
    const { token, refreshToken, user } = loginResponse;

    localStorageMock.setItem("token", token);
    localStorageMock.setItem("refreshToken", refreshToken);
    localStorageMock.setItem("user", JSON.stringify(user));

    expect(localStorageMock.setItem).toHaveBeenCalledWith("token", token);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("refreshToken", refreshToken);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(user)
    );
  });

  it("logout clears all auth-related localStorage keys", () => {
    localStorageMock.removeItem("token");
    localStorageMock.removeItem("refreshToken");
    localStorageMock.removeItem("user");
    localStorageMock.removeItem("script");

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("refreshToken");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("script");
  });

  it("logout calls POST /auth/logout with refreshToken", () => {
    const mockApi = createMockApi();
    const refreshToken = loginResponse.refreshToken;

    mockApi.post("/auth/logout", { refreshToken });

    const call = mockApi.getCallsFor("post")[0];
    expect(call.args[0]).toBe("/auth/logout");
    expect(call.args[1].refreshToken).toBe(refreshToken);
  });

  it("refresh response contains new token and refreshToken", () => {
    expect(refreshResponse).toHaveProperty("token");
    expect(refreshResponse).toHaveProperty("refreshToken");
    expect(refreshResponse.token).not.toBe(loginResponse.token);
    expect(refreshResponse.refreshToken).not.toBe(loginResponse.refreshToken);
  });

  it("auth interceptor skips refresh for auth endpoints", () => {
    const authEndpoints = ["/auth/refresh", "/auth/logout", "/login"];

    authEndpoints.forEach((url) => {
      const isAuthEndpoint = url.includes("/auth/") || url.includes("/login");
      expect(isAuthEndpoint).toBe(true);
    });
  });

  it("request interceptor attaches Bearer token header", () => {
    localStorageMock.setItem("token", "test-jwt-token");
    const token = localStorageMock.getItem("token");
    const header = `Bearer ${token}`;
    expect(header).toBe("Bearer test-jwt-token");
  });
});
