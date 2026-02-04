# Design Brief: Human in Command Ticket System

## 1. App Analysis

### What This App Does
This is a ticket system configuration dashboard for "Human in Command" - a support system where administrators manage the building blocks of their help desk: ticket categories, priority levels, ticket statuses, and technicians. It's the control center for defining HOW support works in their organization.

### Who Uses This
IT administrators and support team managers who need to configure and maintain their ticket system. They're busy people who check this dashboard occasionally to see their system's health and add new team members or categories as the organization grows.

### The ONE Thing Users Care About Most
**System Overview at a Glance** - They want to instantly see: "Is my ticket system properly configured? Do I have enough active technicians? Are all my categories, priorities, and statuses set up?"

### Primary Actions (IMPORTANT!)
1. **Techniker hinzufugen** (Add Technician) - Primary Action Button - Most common action as team changes frequently
2. Kategorie hinzufugen - Add new ticket categories
3. Status hinzufugen - Add new ticket statuses

---

## 2. What Makes This Design Distinctive

### Visual Identity
This dashboard embodies a "mission control" aesthetic - calm, professional, with a subtle tech-forward feel. The cool slate-blue undertones convey trust and reliability, while the teal accent creates moments of focus without being aggressive. It feels like software built by engineers FOR engineers - no unnecessary decoration, but every detail considered.

### Layout Strategy
The layout uses an **asymmetric approach** because there's a clear hierarchy:
- **Hero**: Total active technicians count - this is the pulse of the support system
- The hero takes 40% more visual weight than secondary metrics through size AND a distinctive card treatment
- Secondary KPIs (Categories, Priorities, Statuses) are presented as a compact row - equally important but secondary
- Below, a full-width technician list provides actionable detail
- Visual interest comes from the contrast between the large, breathing hero area and the dense, functional list below

### Unique Element
The hero technician count uses a **status ring** - a circular progress indicator showing active vs total technicians. If 8 of 10 technicians are active, the ring is 80% filled. This creates immediate visual feedback about team capacity without reading numbers.

---

## 3. Theme & Colors

### Font
- **Family:** Space Grotesk
- **URL:** `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap`
- **Why this font:** Space Grotesk has a technical, modern feel that suits a system administration dashboard. Its geometric shapes and slightly condensed letterforms read well in both large headlines and compact data displays.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(210 20% 98%)` | `--background` |
| Main text | `hsl(215 25% 17%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(215 25% 17%)` | `--card-foreground` |
| Borders | `hsl(214 20% 90%)` | `--border` |
| Primary action | `hsl(173 58% 39%)` | `--primary` |
| Text on primary | `hsl(0 0% 100%)` | `--primary-foreground` |
| Accent highlight | `hsl(173 45% 92%)` | `--accent` |
| Muted background | `hsl(210 15% 95%)` | `--muted` |
| Muted text | `hsl(215 15% 47%)` | `--muted-foreground` |
| Success/positive | `hsl(160 60% 40%)` | (component use) |
| Error/negative | `hsl(0 72% 51%)` | `--destructive` |

### Why These Colors
The cool slate-blue base (`hsl(210 20% 98%)`) creates a calm, professional atmosphere that won't fatigue users staring at dashboards. The teal primary (`hsl(173 58% 39%)`) is distinctive without being loud - it's professional yet memorable. This palette says "enterprise software that doesn't feel like enterprise software."

### Background Treatment
The background is a subtle cool off-white (`hsl(210 20% 98%)`) - not pure white, which would feel stark and clinical. Cards sit on pure white to create gentle elevation through color contrast rather than heavy shadows.

---

## 4. Mobile Layout (Phone)

Design mobile as a COMPLETELY SEPARATE experience, not squeezed desktop.

### Layout Approach
Mobile uses a single-column flow with the hero technician ring dominating the first viewport. Secondary KPIs become a horizontally scrollable pill row to save vertical space. The technician list becomes compact cards that are thumb-friendly.

### What Users See (Top to Bottom)

**Header:**
- App title "Ticket System" left-aligned, 20px Space Grotesk Medium
- Primary action button "+" icon (circle, 44px) in top right - taps to add technician
- Subtle bottom border in `--border` color

**Hero Section (The FIRST thing users see):**
- Takes approximately 50% of viewport height
- Centered circular progress ring (180px diameter, 10px stroke)
- Ring color: `--primary` for filled portion, `--muted` for unfilled
- Inside ring: Large number (56px, weight 700) showing active technician count
- Below number: "von X aktiv" in muted text (14px)
- Below ring: "Techniker" label (16px, weight 500)
- Generous padding (32px) around the hero
- Why hero: Technician availability is the lifeblood of support - if no one's active, tickets don't get solved

**Section 2: Quick Stats Row**
- Horizontal scrolling row with 16px gap
- Three pill-shaped stat badges (not cards):
  - Each pill: 120px min-width, 48px height, `--muted` background, rounded-full
  - Content: Icon (16px) + number (18px bold) + label (12px muted)
  - Categories count, Priorities count, Statuses count
- This row is scannable without taking focus from hero

**Section 3: Techniker Liste**
- Section header: "Team" (18px, weight 600) with "Alle anzeigen" link right-aligned
- Cards for each technician (max 5 shown initially):
  - Card: full-width, 72px height, white background, 12px border-radius
  - Left: Avatar circle (40px) with initials, background `--accent`
  - Center: Name (16px, weight 500) and specialization below (13px, muted)
  - Right: Active status badge (green dot or "Inaktiv" text)
- Cards have 8px vertical gap

**Bottom Navigation / Action:**
- Fixed bottom action button: "Techniker hinzufugen"
- Full-width minus 16px margins, 52px height
- `--primary` background, white text, 12px border-radius
- Safe area padding for notched phones

### Mobile-Specific Adaptations
- Hero ring is smaller (180px vs 220px on desktop)
- Quick stats become horizontal scroll instead of grid
- Technician list shows only 5 items with "Alle anzeigen" to expand
- Primary action is fixed at bottom for thumb reach

### Touch Targets
- All buttons minimum 44px touch target
- Cards are fully tappable
- Horizontal scroll has generous padding at edges

### Interactive Elements
- Tapping a technician card shows a bottom sheet with full details (email, phone, specialization)
- "Alle anzeigen" expands the list to show all technicians

---

## 5. Desktop Layout

### Overall Structure
Two-column asymmetric layout: **65% main content / 35% sidebar**

The eye flows: Hero (top-left, largest) -> Quick Stats (below hero) -> Technician List (sidebar, scrollable)

Visual interest comes from the size contrast between the expansive hero area and the dense sidebar list.

### Section Layout

**Header Bar (full-width):**
- Left: "Human in Command" title (24px, weight 600)
- Subtitle: "Ticket System Verwaltung" (14px, muted)
- Right: Primary action button "Techniker hinzufugen" (not just icon, full text + icon)
- Height: 72px with border-bottom

**Main Content (65%, left side):**

*Hero Section:*
- Full width of main column
- Centered content with 48px padding all around
- Circular progress ring (220px diameter, 12px stroke)
- Inside: Active count (72px, weight 700) + "von X aktiv" (16px, muted)
- Below ring: "Techniker im Team" label (18px, weight 500)
- Card background with subtle shadow

*Quick Stats Grid (below hero):*
- 3-column grid with 16px gap
- Each stat card:
  - Icon (24px) in `--accent` background circle
  - Number (32px, weight 600)
  - Label (14px, muted)
  - Optional: subtle bottom border accent in relevant color
- Cards: Kategorien, Prioritatsstufen, Statuswerte

**Sidebar (35%, right side):**
- Header: "Team Ubersicht" (18px, weight 600) + count badge
- Scrollable list (max-height: calc(100vh - 200px))
- Each technician row:
  - Avatar (36px) with initials
  - Name (15px, weight 500)
  - Specialization (13px, muted, truncated)
  - Status indicator (colored dot: green=active, gray=inactive)
  - Hover: background changes to `--muted`
- 8px gap between items
- Bottom: "Alle Techniker verwalten" link

### What Appears on Hover
- Technician rows: Background subtle highlight, cursor pointer
- Stat cards: Slight scale (1.02) and shadow increase
- Action button: Darker shade of primary

### Clickable/Interactive Areas
- Technician rows open a detail panel/modal with full info and edit options
- Stat cards navigate to management view for that entity type (future enhancement)

---

## 6. Components

### Hero KPI
The MOST important metric that users see first.

- **Title:** Aktive Techniker
- **Data source:** Techniker app
- **Calculation:** Count where `active === true` / Total count
- **Display:** Circular progress ring with number inside. Ring percentage = active/total
- **Context shown:** "X von Y aktiv" below the number
- **Why this is the hero:** Technician availability determines ticket resolution capacity. An understaffed team means SLA breaches.

### Secondary KPIs

**Kategorien**
- Source: Kategorien app
- Calculation: Count where `active === true`
- Format: number
- Display: Stat card with folder icon

**Prioritatsstufen**
- Source: Prioritaetsstufen app
- Calculation: Count where `active === true`
- Format: number
- Display: Stat card with flag icon

**Statuswerte**
- Source: Statusverwaltung app
- Calculation: Count where `active === true`
- Format: number
- Display: Stat card with check-circle icon

### Chart
*Not applicable for this dashboard* - The data is categorical/count-based, not time-series. Charts would add visual noise without providing insight. The progress ring on the hero serves the visualization need.

### Lists/Tables

**Techniker Liste**
- Purpose: Quick access to team members and their status
- Source: Techniker app
- Fields shown: display_name (or vorname + nachname), specialization, active status
- Mobile style: Cards with avatar, name, specialization, status dot
- Desktop style: Compact rows in sidebar
- Sort: By sortorder (if set), then by nachname alphabetically
- Limit: Mobile 5 (expandable), Desktop all (scrollable)

### Primary Action Button (REQUIRED!)

- **Label:** "Techniker hinzufugen" (Mobile: "+" icon only in header, full button at bottom)
- **Action:** add_record
- **Target app:** Techniker
- **What data:**
  - techniker_vorname (required)
  - techniker_nachname (required)
  - techniker_email
  - techniker_telefon
  - specialization
  - active (default: true)
- **Mobile position:** bottom_fixed (52px button, full-width)
- **Desktop position:** header (right side, as button with icon + text)
- **Why this action:** Team composition changes most frequently. New hires, departures, and status changes are the most common administrative tasks.

---

## 7. Visual Details

### Border Radius
- Cards: 12px (rounded, friendly but professional)
- Buttons: 8px (slightly less rounded than cards)
- Pills/Badges: 9999px (full pill shape)
- Avatars: 9999px (circular)

### Shadows
- Cards: `0 1px 3px hsl(215 25% 17% / 0.04), 0 1px 2px hsl(215 25% 17% / 0.06)` (subtle, professional)
- Hover cards: `0 4px 12px hsl(215 25% 17% / 0.08)` (slightly elevated)
- No heavy shadows - depth comes from background color contrast

### Spacing
- Spacious - this is an admin dashboard, not a data-dense trading app
- Base unit: 8px
- Card padding: 24px desktop, 16px mobile
- Section gaps: 24px
- Component internal gaps: 12px

### Animations
- **Page load:** Stagger fade-in for cards (100ms delay between each)
- **Hover effects:** 150ms ease transition on background-color and transform
- **Tap feedback:** Scale to 0.98 on active state
- **Progress ring:** Animate from 0 to actual value on load (600ms ease-out)

---

## 8. CSS Variables (Copy Exactly!)

The implementer MUST copy these values exactly into `src/index.css`:

```css
:root {
  --background: hsl(210 20% 98%);
  --foreground: hsl(215 25% 17%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(215 25% 17%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(215 25% 17%);
  --primary: hsl(173 58% 39%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(210 15% 95%);
  --secondary-foreground: hsl(215 25% 17%);
  --muted: hsl(210 15% 95%);
  --muted-foreground: hsl(215 15% 47%);
  --accent: hsl(173 45% 92%);
  --accent-foreground: hsl(173 58% 25%);
  --destructive: hsl(0 72% 51%);
  --border: hsl(214 20% 90%);
  --input: hsl(214 20% 90%);
  --ring: hsl(173 58% 39%);
  --radius: 0.75rem;
}
```

---

## 9. Implementation Checklist

The implementer should verify:
- [ ] Space Grotesk font loaded from Google Fonts URL
- [ ] All CSS variables copied exactly as specified in Section 8
- [ ] Mobile layout matches Section 4 - single column, hero ring, horizontal stat pills, card list
- [ ] Desktop layout matches Section 5 - 65/35 split, sidebar with technician list
- [ ] Hero progress ring is prominent and animated on load
- [ ] Colors create the calm, tech-forward mood described in Section 2
- [ ] Primary action button is present on both mobile (bottom fixed) and desktop (header)
- [ ] Technician list shows avatar with initials, name, specialization, active status
- [ ] Touch targets are minimum 44px on mobile
- [ ] Stagger animation on card load
