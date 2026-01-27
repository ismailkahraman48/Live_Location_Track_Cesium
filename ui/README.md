# IETT Live Tracking UI 🌍

Hey! This is the **frontend**, the showcase of the project.

This is where users experience the 3D city and watch buses moving fluently across the map. I used CesiumJS to create a high-performance 3D world directly in the browser.

### Highlights
*   **CesiumJS Integration:** The map isn't just a flat background; it's a full 3D world with accurate terrain and depth.
*   **Smooth Animations:** Even if data from the backend arrives in chunks (e.g., every 2 seconds), the code here uses **interpolation** to fill in the gaps. This ensures buses glide smoothly instead of jumping or teleporting.
*   **Modern Interface:** I used React and TailwindCSS for the floating panels and buttons, ensuring it looks good on both mobile and desktop.

### Tech Stack
*   **React:** For managing UI components and state.
*   **Vite:** For super-fast building and development.
*   **CesiumJS:** The core 3D map engine.
*   **TailwindCSS:** For all styling needs.

### How to Run
Make sure the API is running, then open a new terminal:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app usually opens at `http://localhost:5173`. Enjoy the ride!
