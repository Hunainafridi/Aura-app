---
name: Aura
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393f'
  surface-container-lowest: '#0d0e13'
  surface-container-low: '#1a1b21'
  surface-container: '#1e1f25'
  surface-container-high: '#292a2f'
  surface-container-highest: '#34343a'
  on-surface: '#e3e1e9'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e3e1e9'
  inverse-on-surface: '#2f3036'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#b8c4ff'
  on-tertiary: '#002584'
  tertiary-container: '#6d89fa'
  on-tertiary-container: '#002074'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c4ff'
  on-tertiary-fixed: '#001453'
  on-tertiary-fixed-variant: '#173bab'
  background: '#121318'
  on-background: '#e3e1e9'
  surface-variant: '#34343a'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 54px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 42px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

A sanctuary of focus and tranquil cognition. The design system embodies a serene, hyper-minimalist digital atmosphere tailored for high-performing individuals, deep-work practitioners, and mindfulness seekers seeking absolute cognitive clarity. 

The aesthetic marries **Tactile Glassmorphism** with **Atmospheric Luminescence**. The interface acts as a silent canvas: deep matte obsidian void surfaces eliminate visual fatigue, while subtle, fluid neon auroras—electric cyan and ethereal sapphire—surface softly only to communicate state changes, biometric feedback, and moments of achievement. 

Visual density is deliberately kept sparse. Every element carries generous breathing room, pristine optical alignment, and frosted dimensional glass that replicates finely milled, edge-lit sapphire crystal.

## Colors

The palette leverages an abyssal dark spectrum paired with crystalline emissive accents:

- **Base Void (`#090A0F`)**: Deep matte obsidian absorbing visual tension and eliminating background distraction.
- **Surface Foundations**:
  - `Surface Lowest`: `#06070A` (App background layer, absolute black gradient anchor)
  - `Surface Base`: `#090A0F` (Base canvases)
  - `Surface Container`: `rgba(255, 255, 255, 0.03)` (Glass backdrop)
  - `Surface Container High`: `rgba(255, 255, 255, 0.06)` (Interactive Bento modules)
  - `Surface Border/Stroke`: `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.14)` (Precision razor-thin glass edges)
- **Sapphire Core (`#3B82F6`, `#1E40AF`)**: Guides structural hierarchy, active focus trackers, and grounding moments.
- **Electric Cyan Luminescence (`#06B6D4`, `#22D3EE`)**: Reserved for live pulses, dynamic biometric states, active breathing cues, and focus momentum.
- **Text & Content**:
  - Primary: `#F8FAFC` (Pure optical white with soft slate cool cast)
  - Secondary: `rgba(248, 250, 252, 0.60)`
  - Tertiary: `rgba(248, 250, 252, 0.38)`

## Typography

Inter provides a clinical, humanist, modern iOS system font alternative. 

- **Display & Large Headlines**: Set with negative letter-spacing for razor-sharp cohesion. Display weights stay locked between `500` (Medium) and `600` (SemiBold) to preserve lightness without visual heaviness.
- **Numbers & Biometrics**: For timers, breath countdowns, and mental telemetry metrics, always use tabular numerals (`tnum`) to eliminate spatial shifting during live count states.
- **Micro-labels**: Uppercase styling is strictly reserved for `label-sm` with loose letter-spacing (`0.04em`), signaling categories and quiet state indicators.

## Layout & Spacing

The layout is built on a responsive mobile-first Bento grid architecture with an underlying 4px/8px incremental base rhythm.

- **Mobile (Handheld iOS)**:
  - Outer margins: `1.25rem` (20px)
  - Grid gutters: `0.75rem` to `1rem`
  - Vertical page margins avoid the status bar dynamic island (safe area top + `1rem`) and floating bento dock (safe area bottom + `5rem`).
- **Tablet / Large Screens**:
  - Max content width constrained to `720px` to maintain focused, single-view clarity without cognitive overload.
  - Multi-column Bento tiles collapse cleanly into 2-column or 3-column asymmetric widgets.
- **Spatial Hierarchy**:
  - Tightly paired data (e.g., metric value and unit): `space-xs` (4px).
  - Component inner padding: `space-md` (16px) for cards, `space-lg` (24px) for hero Bento modules.

## Elevation & Depth

Depth is established through physical glass transmission and ambient luminescence rather than direct drop shadows:

- **Backdrop Blurs**: Heavy frosted glass execution using `backdrop-filter: blur(24px) saturate(180%)` to diffuse canvas light into a soft internal radiance.
- **Edge Specularity**: Cards, chips, and modals possess a 1px compound border:
  - Border: `linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.02) 100%)`. This simulates light striking the top beveled edge of milled glass.
- **Atmospheric Glows**: Active and selected elements emit an ambient Gaussian shadow tinted with primary Sapphire (`rgba(59, 130, 246, 0.22)`) or Cyan (`rgba(6, 182, 212, 0.28)`) with blur radiuses spanning `24px` to `48px`, yielding a bioluminescent floating presence.

## Shapes

The interface embraces a continuous fluid curve aesthetic (iOS continuous squircle corners):

- **Standard Containers & Bento Modules**: `rounded-xl` (48px / 3rem squircle on large modules, down to 24px on compact units) delivering organic softness.
- **Pills & Interactive Controls**: `9999px` (Full Pill) for filter chips, audio tags, breathing status indicators, and the floating dock.
- **Micro Elements**: `rounded-md` (8px) for internal progress steps and tiny icon wells.

## Components

### 1. Bento Floating Dock
- Floating at the bottom margin with 32px blur frosted obsidian glass (`rgba(9, 10, 15, 0.72)`).
- Pill geometry encapsulating segmented navigation items.
- Active icons illuminate with an electric cyan pinpoint glow (`box-shadow: 0 0 12px rgba(6, 182, 212, 0.6)`).

### 2. Glowing Pills & Chips
- Fully rounded pills with `rgba(255, 255, 255, 0.05)` fill and a `1px` translucent edge.
- Active state transitions into electric cyan border gradient with an underlying `0 0 20px rgba(34, 211, 238, 0.25)` radial glow.
- Micro dot indicator within pills incorporates subtle pulse keyframe animation.

### 3. Bento Cards & Modules
- Modular, asymmetric surface tiles with subtle internal top-down gradient: `linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)`.
- No solid borders; uses edge lighting via single-pixel borders with directional opacity.

### 4. Buttons
- **Primary**: Solid sapphire-to-cyan gradient (`linear-gradient(135deg, #1E40AF 0%, #06B6D4 100%)`) with white text and a diffuse colored glow.
- **Secondary (Glass)**: Semi-transparent frosted fill (`rgba(255, 255, 255, 0.08)`) with illuminated white stroke.
- **Destructive/Quiet**: Bare glass with muted slate copy; turns faint crimson glow only upon interaction.

### 5. Selection Controls (Checkboxes & Radios)
- Radios feature concentric glowing circles; inner cyan bead radiates light into outer ring on active focus.
- Checkboxes utilize soft-rounded continuous squircles with custom electric cyan draw-in checkmarks.

### 6. Inputs & Search Bars
- Recessed frosted wells (`rgba(0, 0, 0, 0.35)`) with subtle inner shadow to signify depth.
- Caret and active focus illuminate the perimeter with a soft sapphire ambient halo.