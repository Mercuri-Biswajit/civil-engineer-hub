# Civil-Engineer-Hub Frontend

Welcome to the Civil-Engineer-Hub frontend! This project is a specialized suite for structural engineers, providing tools for Beam, Column, Slab, Foundation, Road, and Bridge design, along with BBS (Bar Bending Schedule) and BOQ (Bill of Quantities) calculators.

## 🎨 Design System

The application follows a **Premium Light Theme** designed for clarity and professional use. Most design-related constants are centralized to make the UI easy to maintain and scale.

### Design Tokens
All core visual tokens (colors, typography, spacing) are defined in:
`src/styles/StructureDesign/tokens.js`

- **C (Colors)**: Includes primary blues, accent oranges, and success greens. Surfaces use high-fidelity grays and soft whites.
- **F (Typography)**: Uses 'Outfit' for headers and 'JetBrains Mono' for data-heavy engineering results.
- **S (Spacing)**: Uniform spacing scale for margins and padding.
- **R (Radius)**: Standardized border radii for cards, inputs, and buttons.

### 🛠️ Core UI Elements

The project uses a component-based architecture for maximum reusability.

#### 1. Generic UI Components (`src/components/ui/`)
- `Button.jsx`: Standardized action buttons.
- `Card.jsx`: The primary container for layout sections.
- `Input.jsx`: Controlled form inputs.

#### 2. Structure Design Primitives (`src/components/StructureDesign/ui/`)
These are highly optimized components for engineering data entry:
- `Inp.jsx`: Specialized numeric input with unit support.
- `StatBox.jsx`: Displays key result metrics.
- `ResultRow.jsx`: Standardized row for showing pass/fail or calculation steps.
- `PassFail.jsx`: Visual indicator for structural code checks (IS 456 / IS 800).
- `TwoCol.jsx`: Responsive layout helper for input/preview views.

## 🏗️ Project Structure

- `src/pages/`: Contains the main tool pages (BeamPage, ColumnPage, etc.).
- `src/components/`: Reusable UI components.
- `src/utils/`: Engineering engines and calculation logic.
- `src/styles/`: Design tokens and global CSS.
- `src/auth/`: Firebase Authentication context and providers.

## 🔧 How to Manually Change Elements

### Changing the Color Palette
Modify the `C` object in `src/styles/StructureDesign/tokens.js`. For example, updating `C.primary` will change the theme across all tools.

### Modifying Global UI Proportions
To change the "feel" of the app (e.g., making it more compact or more spacious):
1.  **Padding/Spacing**: Adjust the `S` scale in `tokens.js`.
2.  **Card Styles**: Edit `src/components/ui/Card.jsx`.
3.  **Global Resets**: Check `src/styles/global.css`.

### Updating Component Logic
If you need to change how an input behaves globally, edit the primitive in `src/components/StructureDesign/ui/Inp.jsx`. This ensures consistency across the whole suite (Beam, Column, Slab, etc.).

### Adding New Tools
1. Define the route in `src/utils/StructureDesign/routes/index.js`.
2. Create the page in `src/pages/StructureDesign/`.
3. Link the logic in `StructureDesignPage.jsx`.

## 🚀 Getting Started

1. `npm install`
2. `npm run dev`

The app uses **Vite** for fast HMR and **Tailwind CSS** for layout utilities.
