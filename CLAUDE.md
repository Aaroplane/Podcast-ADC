# CLAUDE.md — ChitChat Podcast Frontend

## Project Overview
React frontend for the ChitChat Podcast app. Generates AI podcast scripts and multi-voice audio via the backend API.

## Stack
- **Framework:** React 18 + Vite
- **UI:** Material UI (MUI) v7 + SCSS
- **Forms:** react-hook-form
- **HTTP:** axios (centralized instance with auth interceptors)
- **Routing:** React Router DOM v7
- **State:** React Context API (AuthContext)
- **Testing:** Vitest

## Directory Structure
```
src/
├── Components/
│   ├── Forms/          — SignIn, SignUp, PasswordReset, Newsletter
│   ├── Users/
│   │   ├── UserDashboard.jsx
│   │   ├── UserPodcastEntries.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── UserProfile.jsx
│   │   ├── SpeakerToneSelector.jsx
│   │   ├── ConversationScriptRenderer.jsx
│   │   └── VoicePicker.jsx
│   ├── ProtectedRoute.jsx
│   ├── NavBar.jsx
│   ├── NewLandingPage.jsx
│   ├── AboutUs.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── Loading.jsx
├── Styling/            — SCSS files + MUI theme (theme.jsx)
├── contexts/           — AuthContext.jsx
├── utils/              — api.js (centralized axios with refresh interceptor)
├── tests/              — Vitest test suite (40 tests)
├── assets/             — Images & videos
├── App.jsx             — Route definitions
└── main.jsx            — Entry point
```

## Key Patterns
- One SCSS file per component in `Styling/` directory
- MUI ThemeProvider wraps the app (theme defined in `Styling/theme.jsx`)
- Auth state managed via AuthContext (token + refreshToken in localStorage)
- Centralized axios instance (`utils/api.js`) with silent 401/403 refresh
- Forms use react-hook-form with `register()` / `handleSubmit()`
- ProtectedRoute wrapper for authenticated routes
- API base URL from `VITE_BASE_URL` env var

## Backend API Reference
The backend repo contains the full API contract documentation:
- **API docs:** `/Users/uwu/Desktop/Projects/ChitChatPodcast/Podcast-ADC-BE/docs/BACKEND-REPORT.md` (Section 13: Frontend Integration Guide)
- **Development checklist:** `/Users/uwu/Desktop/Projects/ChitChatPodcast/Podcast-ADC-BE/docs/DEVELOPMENT-CHECKLIST.md`
- **Implementation plan:** `~/.claude/plans/logical-inventing-platypus.md`
- **Frontend pages plan:** `~/.claude/plans/cached-roaming-locket.md`

Read these files at the start of each session to understand current progress and next steps.

## Current Routes
| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | NewLandingPage | No |
| `/login` | SignIn | No |
| `/signup` | SignUp | No |
| `/users/:id/userdashboard` | UserDashboard | Yes (ProtectedRoute) |
| `/users/:id/profile` | UserProfile | Yes (ProtectedRoute) |
| `/contact` | Contact | No |
| `/about` | AboutUs | No |

## Development Workflow
1. Check `DEVELOPMENT-CHECKLIST.md` for current phase and next tasks
2. Use the appropriate `/specialist` skill for the task type
3. Reference `BACKEND-REPORT.md` Section 13 for all API request/response shapes
4. Test changes in browser: `npm run dev` (runs on port 5173)
5. Run tests: `npm test` (Vitest — 40 tests)

## Specialist Skills Available
| Skill | Use For |
|-------|---------|
| `/frontend-ui-ux` | Component design, MUI theming, responsive layout, SCSS |
| `/auth-specialist` | Token handling, refresh rotation, auth flows |
| `/validation-specialist` | Form validation, enum alignment, error display |
| `/backend-engineer` | API integration, endpoint wiring |
| `/code-reviewer` | Security audit, code quality review |
| `/debugger-tester` | Testing, debugging, edge cases |

## Completed Phases
All frontend phases (6-13) are complete:
- **Phase 6:** Backend cleanup
- **Phase 7:** Auth hardening & centralized API layer
- **Phase 8A:** Mood enum fix, delete wiring, download button
- **Phase 8B:** Multi-speaker UI (SpeakerToneSelector, ConversationScriptRenderer)
- **Phase 9:** Script persistence & audio download
- **Phase 10:** Dashboard stats & user profile page
- **Phase 11:** Voice picker
- **Phase 12:** Polish & cleanup (AboutUs, ProtectedRoute, console.log removal, @11labs removal)
- **Phase 13:** Frontend test suite (Vitest, 40 tests)

## Remaining Work
- **Phase 14 (optional):** E2E browser testing with Playwright
- **Phase 15 (future):** Backend enhancements — password reset email, podcast sharing, HttpOnly cookies
