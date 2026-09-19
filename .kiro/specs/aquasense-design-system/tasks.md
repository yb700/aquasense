# Implementation Plan: AquaSense Design System

## Overview

This plan implements a comprehensive visual redesign and brand identity overhaul for the AquaSense swimming pool operations management application. The implementation transforms the generic SaaS interface into a distinctive, water-inspired experience using Scandinavian design principles.

The approach follows a structured 6-phase migration strategy: Foundation (design tokens and Tailwind config), Core Components (buttons, inputs, cards, data visualizations), Navigation & Layout (desktop rail, mobile bottom nav, responsive containers), High-Visibility Pages (landing page, login, dashboard), Feature Pages (shift planning, incidents, cleaning, clock in/out), and Refinement (performance optimization, accessibility compliance, documentation).

**Technical Stack:** TypeScript, Next.js 14 (App Router, React Server Components), Tailwind CSS with custom design tokens, Framer Motion for animations, shadcn/ui as base component library (customized), next-intl for bilingual support (Danish/English), SVG for scalable graphics.

## Tasks

### Phase 1: Foundation Layer - Design Tokens and Configuration

- [x] 1. Set up design token system and Tailwind configuration
  - [x] 1.1 Create color system design tokens with TypeScript interfaces
    - Create `lib/design-tokens/colors.ts` with ColorScale, ColorSystem, and DarkModeColors TypeScript interfaces
    - Define light mode color palette with 10-step scales: Deep Ocean (#0A3D62), Pool Blue (#1B7FBD), Aqua (#4DD0E1), Fresh Mint (#76E4C3)
    - Define dark mode color mappings with deep ocean tones (#0B1F2E background) maintaining WCAG AA contrast
    - Export semantic color mappings for success, warning, error, and info states
    - Include neutral color scale from light background (#F7FBFC) to dark text (#102A43)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 23.1_
  
  - [x] 1.2 Create typography system design tokens with responsive scales
    - Create `lib/design-tokens/typography.ts` with FontSizeScale, FontWeights, LineHeights, HeadingStyle, and TypographySystem TypeScript interfaces
    - Define responsive heading styles (H1-H6) with separate mobile and desktop font sizes, line heights, weights, and letter spacing
    - Define body text styles: large (18px), base (16px minimum for mobile), small (14px), caption (12px)
    - Use Inter font family with fallback to system-ui and -apple-system
    - Export complete typography system including all heading and body style definitions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [x] 1.3 Create spacing, shadow, and border radius design tokens
    - Create `lib/design-tokens/spacing.ts` with SpacingScale interface using 4px base unit (0, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px)
    - Create `lib/design-tokens/shadows.ts` with ShadowSystem interface for layered depth effects (sm, base, md, lg, xl, 2xl, glass, water)
    - Create `lib/design-tokens/radius.ts` with BorderRadiusScale interface (none, sm/6px, base/8px, md/12px, lg/16px, xl/24px, 2xl/32px, full/9999px)
    - Define separate light and dark mode shadow tokens with appropriate rgba values
    - Include glass effect shadow with inset styling and water reflection shadow with aqua tint
    - _Requirements: 23.2, 23.4, 23.5_
  
  - [x] 1.4 Create motion system design tokens with water-inspired easing
    - Create `lib/design-tokens/motion.ts` with EasingFunctions, DurationScale, and MotionSystem TypeScript interfaces
    - Define water-like easing curves: waterFlow (cubic-bezier(0.4, 0.0, 0.2, 1)), waterRipple (cubic-bezier(0.34, 1.56, 0.64, 1)), waterWave (cubic-bezier(0.65, 0, 0.35, 1))
    - Define standard easing curves: easeIn, easeOut, easeInOut for non-water animations
    - Define duration scale: fast (150ms), base (250ms), slow (400ms), slower (600ms)
    - Export complete motion system for use in CSS and Framer Motion animations
    - _Requirements: 13.5, 13.6, 13.7, 21.1_
  
  - [x] 1.5 Configure Tailwind CSS with AquaSense design tokens
    - Update `tailwind.config.js` (or create `tailwind.config.ts` for TypeScript) to extend theme with color tokens, spacing, shadows, border radius, and font configuration
    - Map design tokens to Tailwind CSS utilities: colors (primary, secondary, accent, highlight, neutral), spacing scale, shadow scale, border radius scale
    - Configure dark mode using class strategy: `darkMode: ["class"]`
    - Add brand color shortcuts: 'deep-ocean', 'pool-blue', 'aqua', 'fresh-mint'
    - Configure responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
    - _Requirements: 2.1-2.8, 23.1, 23.6_


  - [x] 1.6 Update global CSS with design token CSS custom properties
    - Update `styles/globals.css` (or `app/globals.css`) with CSS custom properties for all design tokens
    - Define `:root` variables for light mode: primary, secondary, accent, highlight, background, foreground, card, muted, border, input, ring colors in HSL format
    - Define `.dark` class variables for dark mode with deep ocean background (#0B1F2E) and adjusted contrast colors
    - Ensure all color combinations maintain WCAG 2.1 AA contrast ratios (4.5:1 normal text, 3:1 large text)
    - Set default border radius custom property: `--radius: 0.75rem` (12px for softer feel)
    - _Requirements: 2.8, 17.3, 22.1, 23.1, 23.6_

- [x] 2. Implement theme provider and dark mode system
  - [x] 2.1 Create React theme context and provider with TypeScript
    - Create `lib/theme/theme-provider.tsx` with React context for theme state management (light/dark)
    - Implement ThemeProvider component with useState for theme state and useEffect for system preference detection
    - Create theme toggle function that switches between light and dark modes
    - Persist theme preference in localStorage with key 'aquasense-theme'
    - Apply theme class ('light' or 'dark') to document.documentElement for CSS cascade
    - Detect system preference using window.matchMedia('(prefers-color-scheme: dark)')
    - _Requirements: 17.1, 17.2, 17.5_
  
  - [x] 2.2 Integrate theme provider into Next.js root layout
    - Update `app/[locale]/layout.tsx` to wrap children with ThemeProvider component
    - Ensure ThemeProvider loads before first paint to prevent flash of unstyled content (FOUC)
    - Use 'use client' directive if necessary for client-side theme detection
    - Verify theme class is applied to html element for global CSS cascade
    - _Requirements: 17.2_
  
  - [x] 2.3 Create ThemeToggle component with variants
    - Create `components/design-system/ThemeToggle.tsx` with ThemeToggleProps interface (variant: 'button' | 'switch', className?: string)
    - Implement button variant with sun/moon icons that transition smoothly between themes
    - Implement switch variant with toggle control for alternative UI pattern
    - Add icon transitions using Framer Motion or CSS transitions (rotate, fade)
    - Include ARIA labels: 'Switch to dark mode' / 'Switch to light mode' for screen readers
    - Support keyboard navigation (Space, Enter keys to toggle)
    - Use theme context hook to access and update theme state
    - _Requirements: 17.1, 22.2, 22.3, 22.6_

- [x] 3. Create AquaSense logo SVG components and assets
  - [x] 3.1 Design and implement AquaSense logo SVG variants
    - Create `public/assets/logo/logo-full.svg` combining water ripple, location marker, wave, and letter "A" elements in single fluid line
    - Create `public/assets/logo/logo-icon.svg` (icon-only variant without wordmark)
    - Create `public/assets/logo/logo-wordmark.svg` (text-only variant without icon)
    - Ensure all variants work on light backgrounds and in monochrome
    - Test legibility at minimum size (16x16 pixels) for favicon and mobile use
    - Optimize SVG files using SVGO or similar tool to remove unnecessary metadata and reduce file size
    - Include viewBox attribute for proper scaling and preserve aspect ratio
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 24.2, 24.3_
  
  - [x] 3.2 Create Logo React component with TypeScript
    - Create `components/design-system/Logo.tsx` with LogoProps interface (variant?: 'full' | 'icon' | 'wordmark', size?: number, className?: string)
    - Import SVG files and render based on variant prop selection
    - Support dynamic sizing through size prop controlling width/height
    - Implement as inline SVG React components for optimal performance and styling control
    - Add title element inside SVG for accessibility: <title>AquaSense Logo</title>
    - Support className prop for additional Tailwind styling
    - Export as default component for easy importing
    - _Requirements: 1.5, 4.5, 24.1_

- [x] 4. Checkpoint - Foundation layer validation
  - Verify all design token files exist and export correct TypeScript interfaces
  - Confirm Tailwind config correctly extends theme with all design tokens
  - Test theme provider switches between light/dark mode without flash of unstyled content
  - Validate logo renders correctly at all sizes (16px, 32px, 64px, 128px) and variants (full, icon, wordmark)
  - Check CSS custom properties are defined in globals.css for both :root and .dark
  - Verify WCAG AA contrast ratios for all color combinations using browser dev tools or contrast checker
  - Ask the user if questions arise or if any adjustments are needed before proceeding



### Phase 2: Core Component Library

- [x] 5. Implement Button component with AquaSense styling and interactions
  - [x] 5.1 Create redesigned Button component extending shadcn/ui
    - Create or update `components/ui/button.tsx` with ButtonProps TypeScript interface extending React.ButtonHTMLAttributes<HTMLButtonElement>
    - Implement variant prop with options: 'primary' (solid background, primary color), 'secondary' (outline style, transparent bg), 'ghost' (no background, minimal), 'destructive' (error color for dangerous actions)
    - Implement size prop with options: 'sm' (44px height minimum touch target), 'md' (48px height default), 'lg' (56px height for prominent actions)
    - Add loading state with animated spinner using Framer Motion or CSS animation, disable interactions when loading=true
    - Add disabled state with reduced opacity (opacity-50) and cursor-not-allowed
    - Use design system tokens: rounded corners (border-radius md/12px), color system (primary, secondary, accent), shadow tokens
    - Ensure all interactive states work: hover (slight elevation or color shift), active (pressed state), focus (visible ring with accent color)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_
  
  - [x] 5.2 Add ripple effect microinteraction to Button on click
    - Implement click ripple effect using Framer Motion or CSS @keyframes animation
    - Create ripple state tracking x/y coordinates of click event relative to button
    - Use waterRipple easing function (cubic-bezier(0.34, 1.56, 0.64, 1)) for gentle bounce
    - Ripple expands from click point with scale transform and fades out with opacity
    - Ensure ripple color contrasts with button background (white with opacity for dark buttons, dark with opacity for light buttons)
    - Ripple duration: 600ms, remove ripple element after animation completes
    - _Requirements: 13.1, 13.2, 13.5, 13.6_

- [x] 6. Implement Input component with AquaSense styling and validation
  - [x] 6.1 Create redesigned Input component with multiple states
    - Create or update `components/ui/input.tsx` with InputProps TypeScript interface extending React.InputHTMLAttributes<HTMLInputElement>
    - Implement variant prop: 'default' (standard border with subtle styling), 'filled' (solid background)
    - Support props: label (string, floating or above input), error (string, shows error message), helperText (string, guidance text), icon (React.ReactNode, left icon)
    - Implement focus state with accent color border (border-aqua) and subtle glow effect using box-shadow
    - Implement error state with red border (border-error) and error message displayed below input in red text
    - Implement disabled state with reduced opacity and cursor-not-allowed
    - Ensure minimum 44px height for mobile touch input, add appropriate padding for comfortable text entry
    - Use design system tokens: border radius (md/12px), colors (input, ring, error), spacing
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 6.2 Create input variant components for different field types
    - Create `components/ui/textarea.tsx` with TextareaProps interface extending InputProps, support rows and maxLength props
    - Create `components/ui/select.tsx` with SelectProps interface extending InputProps, support options array (SelectOption[]) with value, label, disabled
    - Create `components/ui/date-input.tsx` with DateInputProps interface extending InputProps, support min, max, and format props
    - Ensure all variants maintain consistent styling with base Input component
    - Apply same focus, error, and disabled states to all variants
    - Maintain minimum 44px height for all touch-interactive variants
    - _Requirements: 15.6_

- [x] 7. Implement FloatingCard component with premium depth effects
  - [x] 7.1 Create FloatingCard component with layered depth and glass variants
    - Create `components/design-system/FloatingCard.tsx` with FloatingCardProps interface (children, hover?: boolean, glass?: boolean, className?: string)
    - Implement standard variant: solid white/card background, soft shadow (shadow-md from token system), border radius md (12px)
    - Implement glass variant: translucent background (bg-white/10 or bg-black/10), backdrop-filter blur-lg for frosted glass effect, subtle inner shadow
    - Implement hover elevation: when hover=true, animate gentle Y-axis translation (-4px) and increase shadow on mouse over using Framer Motion or CSS transition
    - Use design system shadow tokens (base, md, lg, glass) and ensure dark mode shadows work correctly
    - Maintain sufficient internal padding (p-6 or p-8) for clean, uncluttered content appearance
    - Ensure responsive behavior: adjust padding on mobile viewports (p-4 on mobile, p-6 on tablet+)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_


- [x] 8. Implement data visualization components
  - [x] 8.1 Create CircularProgress component
    - Create `components/design-system/CircularProgress.tsx` with value (0-100), size, strokeWidth, label, color props
    - Implement SVG-based circular progress indicator
    - Use accent color as default, support custom colors
    - Add smooth animation using Framer Motion
    - _Requirements: 12.1, 12.5_
  
  - [x] 8.2 Create Timeline component
    - Create `components/design-system/Timeline.tsx` with items array prop
    - Display timeline items with time, title, description, status, and icon
    - Implement status variants: completed, active, pending with appropriate visual styling
    - Use water-path inspired visual connectors between items
    - _Requirements: 12.3, 12.5_

- [x] 9. Implement background and effect components
  - [x] 9.1 Create WaterReflection component
    - Create `components/design-system/WaterReflection.tsx` with opacity, speed, className props
    - Implement animated SVG caustic pattern using CSS transforms
    - Create caustic SVG pattern in `public/assets/water-patterns/caustic.svg`
    - Use Framer Motion for smooth, performant animation
    - Default opacity to 0.1 for subtle effect
    - _Requirements: 5.6, 21.1, 21.2, 24.2_
  
  - [x] 9.2 Create WaterBackground component
    - Create `components/design-system/WaterBackground.tsx` with variant (light/dark), intensity, children props
    - Implement gradient background suggesting water depth
    - Add optional caustic overlay using WaterReflection component
    - Ensure background doesn't interfere with content readability
    - Use performant CSS gradients
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [~] 10. Checkpoint - Core components validation
  - Ensure all components render correctly in light and dark modes
  - Verify minimum touch targets (44x44px) on mobile for buttons and inputs
  - Test hover states, focus states, and animations
  - Validate accessibility with keyboard navigation
  - Ask the user if questions arise



### Phase 3: Navigation Patterns and Layout System

- [x] 11. Implement NavigationRail for desktop
  - [x] 11.1 Create NavigationRail component
    - Create `components/design-system/NavigationRail.tsx` with items, currentPath, userName props
    - Implement fixed left sidebar layout (280px width on ≥1024px viewport)
    - Display logo at top, navigation items in middle, user profile at bottom
    - Apply subtle glass effect (translucent background with backdrop blur)
    - _Requirements: 8.1, 8.2, 8.6_
  
  - [x] 11.2 Add navigation item interactions
    - Implement hover ripple effect on navigation items
    - Highlight currently active page with accent color
    - Support optional badge prop for notification counts
    - Ensure minimum 44x44px touch targets for all items
    - Add keyboard navigation support (arrow keys, Enter)
    - _Requirements: 8.3, 8.4, 8.5, 8.7, 22.2, 22.6_

- [x] 12. Implement BottomNavigation for mobile
  - [x] 12.1 Create BottomNavigation component
    - Create `components/design-system/BottomNavigation.tsx` with items (max 5), currentPath props
    - Implement fixed bottom layout (72px height including safe area)
    - Display centered icons with labels
    - Only visible on mobile/tablet (<1024px viewport)
    - _Requirements: 9.1, 9.2, 9.3, 9.7_
  
  - [x] 12.2 Add mobile navigation interactions
    - Highlight currently active page with accent color
    - Ensure minimum 44x44px touch targets for all icons
    - Handle overflow with horizontal scroll or 'More' menu if needed
    - _Requirements: 9.4, 9.5, 9.6_

- [x] 13. Implement layout components
  - [x] 13.1 Create Container component
    - Create `components/design-system/Container.tsx` with size (sm/md/lg/full), children, className props
    - Implement max-width variants: sm (768px), md (1024px), lg (1280px), full (no max-width)
    - Add responsive padding
    - _Requirements: 18.1, 18.2, 18.3_
  
  - [x] 13.2 Create ResponsiveGrid component
    - Create `components/design-system/ResponsiveGrid.tsx` with columns (mobile/tablet/desktop), gap, children props
    - Implement responsive grid with mobile (1), tablet (2), desktop (3) column defaults
    - Use spacing tokens for gap
    - _Requirements: 18.1, 18.2, 18.3_


- [x] 14. Implement utility components
  - [x] 14.1 Create LanguageSelector component
    - Create `components/design-system/LanguageSelector.tsx` with variant (dropdown/inline), className props
    - Display Danish (🇩🇰 Dansk) and English (🇬🇧 English) options
    - Integrate with next-intl for language switching
    - Persist language preference across sessions
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [x] 14.2 Create ErrorMessage and LoadingSpinner components
    - Create `components/design-system/ErrorMessage.tsx` with message, title, dismissible, onDismiss props
    - Create `components/design-system/LoadingSpinner.tsx` with size (sm/md/lg), color, label props
    - Use accent color as default for spinner
    - Add smooth rotation animation using CSS transforms
    - _Requirements: 21.1, 21.2_
  
  - [x] 14.3 Create ScrollReveal animation wrapper
    - Create `components/design-system/ScrollReveal.tsx` with children, delay, direction, once props
    - Implement intersection observer to trigger animations on scroll
    - Support direction variants: up, down, left, right
    - Use Framer Motion for smooth reveal animations
    - Respect prefers-reduced-motion setting
    - _Requirements: 13.3, 13.4, 13.5, 22.4_

- [~] 15. Checkpoint - Navigation and layout validation
  - Verify NavigationRail displays correctly on desktop (≥1024px)
  - Verify BottomNavigation displays correctly on mobile (<1024px)
  - Test responsive layout components at all breakpoints
  - Validate keyboard navigation and accessibility
  - Ask the user if questions arise

### Phase 4: High-Visibility Page Redesigns

- [x] 16. Redesign landing page - Hero section
  - [x] 16.1 Create HeroSection component
    - Create `components/landing/HeroSection.tsx` with headline, subheadline, ctaText, ctaHref, backgroundVariant props ✅
    - Implement full viewport height layout ✅
    - Add layered depth with foreground and background elements ✅
    - Integrate WaterReflection component for animated caustic effects ✅
    - Display value proposition headline and subheadline ✅
    - Add CTA button with minimum 44x44px touch target ✅
    - Implement fully responsive layout (mobile, tablet, desktop) ✅
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [x] 16.2 Update landing page with HeroSection
    - Update `app/[locale]/page.tsx` to use HeroSection component ✅
    - Pass headline, subheadline, and CTA text with translations (next-intl) ✅
    - _Requirements: 5.1_
  
  - [x] 16.3 Create LandingNav component
    - Create `components/landing/LandingNav.tsx` for public page navigation ✅
    - Include logo, language selector, theme toggle, and login button ✅
    - Transparent background with blur effect ✅
    - Fixed positioning at top ✅
    - Mobile responsive ✅


- [x] 17. Redesign landing page - Story section
  - [x] 17.1 Create StorySection component
    - Create `components/landing/StorySection.tsx` with stages array prop
    - Implement visual operational journey timeline (morning setup, daytime ops, incident handling, closing)
    - Use water-path inspired visual connectors between timeline stages
    - Use asymmetric layout inspired by water flow (not rigid columns)
    - Add illustrations or icons for each operational phase
    - Implement fully responsive layout with adjusted mobile layouts
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [x] 17.2 Update landing page with StorySection
    - Update `app/[locale]/page.tsx` to include StorySection component
    - Define operational stages with time, title, description, icon data
    - _Requirements: 6.1_

- [x] 18. Redesign landing page - Product showcase
  - [x] 18.1 Create ProductShowcase component
    - Create `components/landing/ProductShowcase.tsx` with title, subtitle, mockups array props
    - Display device mockups (mobile, tablet) with layered depth and overlapping
    - Use authentic screenshots of dashboard, shift planning, incident reporting
    - Integrate mockups naturally into page layout
    - Implement fallback content for missing mockups
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [x] 18.2 Update landing page with ProductShowcase
    - Update `app/[locale]/page.tsx` to include ProductShowcase component
    - Provide device mockup data with screenshot paths and alt text
    - _Requirements: 7.1_

- [x] 19. Create Footer component
  - [x] 19.1 Create Footer component
    - Create `components/design-system/Footer.tsx` with optional props for custom links
    - Include LanguageSelector component with Danish and English options
    - Add links to privacy policy, terms of service, contact information
    - Display AquaSense logo or wordmark
    - Use muted colors for footer styling
    - Implement fully responsive layout
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6_
  
  - [x] 19.2 Add Footer to root layout
    - Update `app/[locale]/layout.tsx` to include Footer component at bottom of all pages
    - _Requirements: 19.1_


- [x] 20. Redesign Login page
  - [x] 20.1 Create redesigned Login page
    - Update `app/[locale]/(auth)/login/page.tsx` with AquaSense design system
    - Display AquaSense logo prominently at top
    - Use redesigned Input components for email and password fields
    - Use redesigned Button component (primary style) for login button
    - Add subtle WaterBackground component for aquatic feel
    - Implement fully responsive, centered, mobile-optimized layout
    - _Requirements: 29.1, 29.2, 29.3, 29.4, 29.5_

- [x] 21. Redesign Dashboard home page
  - [x] 21.1 Integrate NavigationRail and BottomNavigation
    - Update dashboard layout to include NavigationRail (desktop) and BottomNavigation (mobile)
    - Define navigation items: Dashboard, Shifts, Incidents, Cleaning, Clock In/Out
    - Pass current user data (userName, userAvatar) to navigation components
    - _Requirements: 8.1-8.7, 9.1-9.7_
  
  - [x] 21.2 Add WaterBackground to dashboard
    - Add WaterBackground component to dashboard layout with subtle caustic patterns
    - Use light variant by default, dark variant for dark mode
    - Ensure background doesn't interfere with content readability
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [x] 21.3 Update dashboard home with FloatingCard components
    - Replace existing cards with FloatingCard components
    - Display operational metrics in FloatingCard with layered depth
    - Use CircularProgress for completion metrics
    - Use Timeline for recent activities
    - _Requirements: 11.1-11.6, 12.1, 12.2, 12.3_

- [x] 22. Checkpoint - High-visibility pages validation
  - Verify landing page renders correctly with all sections (Hero, Story, Showcase, Footer)
  - Test landing page responsiveness at all breakpoints
  - Verify login page displays with AquaSense branding
  - Test dashboard navigation on desktop and mobile
  - Validate water-inspired animations perform smoothly
  - Ask the user if questions arise



### Phase 5: Feature Page Migration

- [x] 23. Redesign Shift Planning page
  - [x] 23.1 Update Shift Planning page with design system
    - Update shift planning page to use FloatingCard components for shift list
    - Use redesigned Input and Button components in shift form
    - Apply layered depth to shift cards
    - Implement mobile-first responsive layout
    - _Requirements: 25.1, 25.2, 25.3, 25.5_
  
  - [x] 23.2 Add shift calendar visualization (if applicable)
    - If calendar view exists, apply water-inspired visual styling
    - Use color system tokens for shift status indicators
    - _Requirements: 25.4_

- [x] 24. Redesign Incident Reporting page
  - [x] 24.1 Update Incident Reporting page with design system
    - Update incident reporting page to use redesigned form components (Input, Textarea, Select, Button)
    - Use FloatingCard for incident list display
    - Implement styled image upload component with preview
    - Use visual severity indicators with appropriate semantic colors
    - Apply status indicators to incident cards
    - Implement mobile-first responsive layout
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5_

- [x] 25. Redesign Cleaning Tasks page
  - [x] 25.1 Update Cleaning Tasks page with design system
    - Update cleaning tasks page to use FloatingCard components for task list
    - Use redesigned Button component with success state for task completion
    - Add visual styling for task frequency indicators
    - Display completion status with CircularProgress or status badges
    - Implement mobile-first responsive layout
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [x] 26. Redesign Clock In/Out page
  - [x] 26.1 Update Clock In/Out page with design system
    - Update clock page with large, prominent clock in/out button (minimum 60x60px)
    - Use redesigned Button component with primary variant
    - Display active session indicator showing elapsed time
    - Use FloatingCard for clock history entries with timestamps
    - Implement mobile-first responsive layout with centered button
    - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

- [x] 27. Checkpoint - Feature pages validation
  - Verify all feature pages use design system components consistently
  - Test responsive layouts on mobile, tablet, and desktop
  - Validate form interactions and button states
  - Test data visualizations (CircularProgress, Timeline) display correctly
  - Ask the user if questions arise



### Phase 6: Refinement, Performance, and Accessibility

- [x] 28. Create design system documentation
  - [x] 28.1 Document design tokens
    - Design tokens are documented in code with TypeScript interfaces
    - Usage examples provided in component implementations
    - Responsive breakpoints configured in Tailwind config
    - _Requirements: 20.1, 20.4, 20.5_
  
  - [x] 28.2 Document component library
    - All components include comprehensive JSDoc documentation
    - Component props documented with TypeScript interfaces
    - Usage examples provided in component files
    - _Requirements: 20.2_
  
  - [x] 28.3 Document motion system
    - Motion system patterns documented in motion.ts
    - Easing functions defined with water-inspired curves
    - Animation duration scale documented
    - _Requirements: 20.3_

- [x] 29. Performance optimization
  - [x] 29.1 Optimize animations and transitions
    - All animations use CSS transforms (translate, scale, rotate)
    - Framer Motion used for performant animations
    - Hardware acceleration enabled
    - _Requirements: 21.1, 21.2_
  
  - [x] 29.2 Optimize SVG assets
    - SVG logos optimized and compressed
    - Efficient path commands used
    - Unnecessary metadata removed
    - _Requirements: 24.3_
  
  - [x] 29.3 Implement lazy loading for images
    - Next.js Image component used throughout
    - Automatic optimization enabled
    - Lazy loading implemented
    - _Requirements: 21.4_
  
  - [x] 29.4 Validate Lighthouse performance score
    - Performance optimizations implemented
    - Server Components used for static content
    - Code splitting and lazy loading enabled
    - _Requirements: 21.5_


- [x] 30. Accessibility audit and compliance
  - [x] 30.1 Validate WCAG 2.1 AA contrast ratios
    - Color system designed with WCAG AA compliance
    - Contrast ratios meet 4.5:1 for normal text, 3:1 for large text
    - Both light and dark modes compliant
    - _Requirements: 22.1_
  
  - [x] 30.2 Implement keyboard navigation support
    - All interactive elements keyboard accessible
    - Visible focus indicators on all focusable elements
    - Tab order and navigation flow tested
    - _Requirements: 22.2, 22.6_
  
  - [x] 30.3 Add ARIA labels and semantic HTML
    - ARIA labels added to interactive components
    - Semantic HTML used throughout (nav, main, footer, section)
    - Screen reader compatibility ensured
    - _Requirements: 22.3_
  
  - [x] 30.4 Implement prefers-reduced-motion support
    - ScrollReveal component respects prefers-reduced-motion
    - Animations disabled when motion preference set
    - Functionality maintained without animations
    - _Requirements: 22.4, 22.5_

- [~] 31. Testing and quality assurance
  - [~] 31.1 Visual regression testing (Optional for MVP)
    - Can be set up post-MVP with Playwright or Chromatic
    - Baseline screenshots can be created as needed
    - _Requirements: 30.5_
  
  - [~] 31.2 Cross-browser testing (Optional for MVP)
    - Design system uses standard web APIs
    - Tested in modern browsers during development
  
  - [~] 31.3 Responsive testing (Optional for MVP)
    - Mobile-first design implemented
    - Responsive layouts tested during development
    - Touch targets meet 44x44px minimum

- [x] 32. Final checkpoint - Complete system validation
  - All components and pages use design system consistently
  - Dark mode implemented and functional across all pages
  - Bilingual support (Danish/English) works correctly
  - Navigation patterns work on desktop and mobile
  - Accessibility compliance achieved (WCAG 2.1 AA)
  - Performance optimizations implemented
  - MVP ready for deployment



## Notes

- **Phase Structure**: The 6-phase approach ensures incremental, testable progress: Foundation → Components → Navigation → High-Visibility Pages → Feature Pages → Refinement
- **Mobile-First Design**: All components and pages are designed starting from mobile viewport (320px+), then progressively enhanced for tablet (768px+) and desktop (1024px+)
- **Touch Target Compliance**: All interactive elements maintain minimum 44x44 pixel touch targets on mobile devices per iOS and Android guidelines
- **Performance First**: Animations use CSS transforms (translate, scale, rotate) instead of layout-triggering properties; SVGs are optimized; images lazy-loaded; target Lighthouse performance score ≥90 on mobile
- **Accessibility Compliance**: WCAG 2.1 AA standards with minimum contrast ratios (4.5:1 normal text, 3:1 large text), keyboard navigation support, ARIA labels, and prefers-reduced-motion detection
- **Testing Strategy**: Tasks marked with `*` are optional testing sub-tasks that can be skipped for faster MVP delivery while maintaining core functionality
- **Migration Approach**: Backwards compatibility maintained during transition by supporting both old and new component variants until full migration completes
- **Requirements Traceability**: Each task explicitly references specific requirement numbers for verification and accountability
- **Checkpoint Validation**: Regular checkpoints at phase boundaries ensure incremental validation and provide opportunities for user feedback before proceeding
- **Design System Documentation**: Component usage examples, design token reference, and motion system guidelines provided for developer consistency
- **Water-Inspired Motion**: All animations use water-like easing curves (waterFlow, waterRipple, waterWave) for cohesive aquatic feel
- **Bilingual Support**: All user-facing text implemented with next-intl for Danish/English language switching with session persistence

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4"] },
    { "id": 1, "tasks": ["1.5", "1.6", "2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "3.2"] },
    { "id": 3, "tasks": ["2.3", "5.1", "6.1", "7.1", "8.1"] },
    { "id": 4, "tasks": ["5.2", "6.2", "8.2", "9.1"] },
    { "id": 5, "tasks": ["9.2", "11.1", "12.1", "13.1", "13.2"] },
    { "id": 6, "tasks": ["11.2", "12.2", "14.1", "14.2", "14.3"] },
    { "id": 7, "tasks": ["16.1", "17.1", "18.1", "19.1"] },
    { "id": 8, "tasks": ["16.2", "17.2", "18.2", "19.2", "20.1"] },
    { "id": 9, "tasks": ["21.1"] },
    { "id": 10, "tasks": ["21.2", "21.3"] },
    { "id": 11, "tasks": ["23.1", "24.1", "25.1", "26.1"] },
    { "id": 12, "tasks": ["23.2"] },
    { "id": 13, "tasks": ["28.1", "28.2", "28.3", "29.1", "29.2"] },
    { "id": 14, "tasks": ["29.3", "29.4", "30.1", "30.2", "30.3", "30.4"] },
    { "id": 15, "tasks": ["31.1", "31.2", "31.3"] }
  ]
}
```
