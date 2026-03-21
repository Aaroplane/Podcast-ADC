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

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant solution?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
1. **Plan First:** Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan:** Check in before starting implementation
3. **Track Progress:** Mark items complete as you go
4. **Explain Changes:** High-level summary at each step
5. **Document Results:** Add review section to `tasks/todo.md`
6. **Capture Lessons:** Update `tasks/lessons.md` after corrections

## Core Principles
- **Simplicity First:** Make every change as simple as possible. Impact minimal code.
- **No Laziness:** Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact:** Changes should only touch what's necessary. Avoid introducing bugs.

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
