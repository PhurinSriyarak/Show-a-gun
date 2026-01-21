# AR-15 Builder Web Application

This is a premium 3D configurator for AR-15 Airsoft builds, created with React and Three.js.

## Features
- **3D Viewer**: Interactive 3D scene with orbit controls.
- **Part Swapping**: Real-time part replacement with slot-based logic.
- **Camera Presets**: Multiple cinematic camera angles with smooth transitions.
- **Color Selector**: Change the base color of the receiver.
- **Screenshot System**: Capture high-quality images of your build.

## Technology Stack
- **Framework**: React (Vite)
- **3D Engine**: @react-three/fiber, @react-three/drei (Three.js)
- **Animation**: GSAP
- **Styling**: Vanilla CSS (Premium Dark Theme)

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Adding Your 3D Models (.glb)
Place your `.glb` models in the `public/models/` folder according to the structure:
- `public/models/base/ar15_base.glb`
- `public/models/parts/barrel/*.glb`
- `public/models/parts/handguard/*.glb`
- etc.

Update `src/data/parts.json` to point to your new model paths.

### 4. Customizing the UI
The UI is styled in `src/App.css`. You can customize the colors, backdrop-blur, and typography there.

## Implementation Details
- **Part Management**: Handled via React state in `App.jsx`.
- **Camera Controls**: Managed by the `CameraController` component in `Viewer.jsx` using GSAP for smooth interpolation.
- **3D Rendering**: Uses `Stage` and `Environment` from `@react-three/drei` for photo-realistic lighting without complex setup.
