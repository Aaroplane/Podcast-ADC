Here is Claude's plan:                                                                                                                      
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 Fix Plan: Post-Audit Regressions — Layout, Spacing & Responsive                                                                           

 Context

 After the UI/UX audit, several regressions appeared:
 1. Landing page: All content below the carousel bar is invisible
 2. Sign-In page: Layout doesn't fill full screen — visible gap on right side
 3. Sign-Up page: Excessive vertical spacing between form fields
 4. Global CSS: Missing resets that cause child components to overflow/misalign

 ---
 Fix 0: Global CSS Foundation — App.css & index.css

 Problems found:
 - No box-sizing: border-box reset — padding adds to element width, causing width: 100% + padding to overflow the viewport
 - No overflow-x: hidden — any child wider than the viewport creates a horizontal scrollbar
 - Duplicate body rules — both index.css and App.css declare body { margin: 0; padding: 0 } independently
 - height: 100% on #root unreliable — html doesn't have height: 100%, so the percentage chain breaks; min-height: 100vh is more robust
 - width: 100vw on .signin-page — includes scrollbar width on Windows/Linux, causing horizontal overflow; needs to be 100%

 Fix src/index.css — make this the single global reset:
 *, *::before, *::after {
   box-sizing: border-box;
 }

 html, body {
   margin: 0;
   padding: 0;
   width: 100%;
   min-height: 100vh;
   overflow-x: hidden;
 }

 Fix src/App.css — remove duplicate body rules, keep only #root styles:
 #root {
   margin: 0;
   padding: 0;
   min-height: 100vh;
   width: 100%;
   font-family: "Montserrat", sans-serif;
   font-optical-sizing: auto;
   background: #f5f4ed;
 }

 .protected-route-loading {
   display: flex;
   justify-content: center;
   align-items: center;
   min-height: 60vh;
 }

 Fix src/Styling/SignInStyling.scss — change .signin-page width: 100vw → width: 100%

 ---
 Fix 1: Landing Page — Invisible Content

 Root Cause: The useScrollReveal() hook uses callback refs (ref={observe}) on each .reveal element. The IntersectionObserver is not reliably
  triggering for all observed elements. Sections have .reveal { opacity: 0 } and never get the .visible class, so they stay invisible.

 Fix src/Components/NewLandingPage.jsx:
 - Remove the useScrollReveal hook entirely
 - Replace with a single useRef on the container + useEffect that queries all .reveal elements via querySelectorAll and observes them with
 one IntersectionObserver
 - Remove all individual ref={observe} from section/grid elements
 - Keep the .reveal classes on the elements (they're correct)

 const containerRef = useRef(null);

 useEffect(() => {
   const elements = containerRef.current?.querySelectorAll('.reveal');
   if (!elements?.length) return;

   const observer = new IntersectionObserver(
     (entries) => {
       entries.forEach((entry) => {
         if (entry.isIntersecting) {
           entry.target.classList.add('visible');
           observer.unobserve(entry.target);
         }
       });
     },
     { threshold: 0.15 }
   );

   elements.forEach((el) => observer.observe(el));
   return () => observer.disconnect();
 }, []);

 Then: <div className="newLandingPage_container" ref={containerRef}>

 No SCSS changes needed — .reveal / .reveal.visible in _animations.scss are correct.

 ---
 Fix 2: Sign-In Page — Not Full Width

 Root Cause: SignInForm.jsx line 54 uses <StyledContainer> which applies via JS-in-CSS: margin: 16px, padding: 16px, borderRadius: 12px,
 backgroundColor: white, boxShadow. These override the SCSS rules (which no longer have !important). MUI Container also enforces a maxWidth
 default (~1200px), creating the right-side gap.

 Line 70 uses <StyledPaper> adding border: 2px groove, background: #ebe7dd, margin: 24px.

 Fix src/Components/Forms/SignInForm.jsx:
 - Replace <StyledContainer className="signin-container"> → <div className="signin-container">
 - Replace <StyledPaper className="signin-paper"> → <Paper className="signin-paper" elevation={0}>
 - Update imports: remove StyledContainer, StyledPaper; add Paper

 No additional SCSS changes needed — SignInStyling.scss already has correct full-width/transparent styles; they were just being overridden
 by styled-component inline styles.

 ---
 Fix 3: Sign-Up Page — Excessive Spacing

 Root Cause: Each form field is wrapped in <StyledBox> (6 instances) which applies margin: 24px all sides + padding: 16px + backgroundColor:
  white + borderRadius: 12px. Combined with the .form grid gap: 16px, this creates triple-stacked spacing.

 Fix src/Components/Forms/SignUpForm.jsx:
 - Replace all 6 <StyledBox> / </StyledBox> pairs with plain <div> / </div>
 - Remove StyledBox from the import statement

 No SCSS changes needed — the grid gap in SignUpStyling.scss already provides correct spacing.

 ---
 Responsive Design Check

 With the global box-sizing: border-box reset, all pages benefit — padding no longer causes overflow. Additional responsive fixes already in
  the SCSS from the audit:

 ┌───────────┬──────────────────────────────────────────────────┬────────────────────────┬────────────────────┐
 │   Page    │              Mobile ($bp-sm: 480px)              │ Tablet ($bp-md: 768px) │      Desktop       │
 ├───────────┼──────────────────────────────────────────────────┼────────────────────────┼────────────────────┤
 │ Landing   │ cta_login_container flex-column, reduced padding │ Hero flex-column       │ Full side-by-side  │
 ├───────────┼──────────────────────────────────────────────────┼────────────────────────┼────────────────────┤
 │ Sign-In   │ Stacked (flex-column), form fills width          │ Stacked video + form   │ Side-by-side       │
 ├───────────┼──────────────────────────────────────────────────┼────────────────────────┼────────────────────┤
 │ Sign-Up   │ Single column grid, reduced margin               │ 2-column grid          │ 2-column grid      │
 ├───────────┼──────────────────────────────────────────────────┼────────────────────────┼────────────────────┤
 │ Dashboard │ Cards stack, reduced padding                     │ 2-column grid at 768px │ 2-column at 1200px │
 ├───────────┼──────────────────────────────────────────────────┼────────────────────────┼────────────────────┤
 │ Profile   │ Form rows stack at 600px                         │ Full layout            │ Full layout        │
 ├───────────┼──────────────────────────────────────────────────┼────────────────────────┼────────────────────┤
 │ Contact   │ Actions stack, photo shrinks                     │ 2-column grid          │ 2-column grid      │
 └───────────┴──────────────────────────────────────────────────┴────────────────────────┴────────────────────┘

 ---
 Files to Modify (5 files)

 ┌─────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────┐
 │                File                 │                                     Change                                      │
 ├─────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
 │ src/index.css                       │ Add box-sizing: border-box reset, overflow-x: hidden, consolidate body rules    │
 ├─────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
 │ src/App.css                         │ Remove duplicate body rules, fix #root to use min-height: 100vh                 │
 ├─────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
 │ src/Styling/SignInStyling.scss      │ Change .signin-page width: 100vw → width: 100%                                  │
 ├─────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
 │ src/Components/NewLandingPage.jsx   │ Replace callback-ref scroll reveal with useEffect + querySelectorAll('.reveal') │
 ├─────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
 │ src/Components/Forms/SignInForm.jsx │ Replace StyledContainer → <div>, StyledPaper → <Paper elevation={0}>            │
 ├─────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
 │ src/Components/Forms/SignUpForm.jsx │ Replace <StyledBox> → <div> for all 6 form field wrappers                       │
 └─────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────┘

 ---
 Verification

 1. npm run build — clean build
 2. npm test — all 40 tests pass
 3. Browser check at localhost:5173:
   - Landing page (/): Scroll down — hero, how-it-works, login sections fade in; no horizontal scrollbar
   - Sign-In (/login): Video + form fill full viewport width, no right-side gap
   - Sign-Up (/signup): Form fields have consistent, reasonable spacing in 2-column grid
   - All pages: Resize from 320px → 1920px — no horizontal overflow, components stack properly at breakpoints
   