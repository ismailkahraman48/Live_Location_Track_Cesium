# Istanbul Smart City - Digital Twin Project 🏙️

Hi there! This is my capstone project developed for the **Cesium Certified Developer** certification.

In this project, my goal was not just to simply show bus locations on a map, but to create a **Digital Twin** prototype that aligns with the future "Smart City" vision. I wanted to demonstrate how powerful it can be to verify and visualize real-time data in a 3D environment for managing massive metropolises like Istanbul.

### About The Project
Fundamentally, this project allows you to track Istanbul IETT buses live on a realistic 3D globe.

*   The **backend** runs a simulation engine to generate realistic, real-time positions for the buses.
*   The **frontend** leverages the power of CesiumJS to render this data onto 3D terrain.
*   The result is a living, breathing model of the city where data flows continuously.

### Folder Structure
The project consists of two main parts:

1.  **`/api`**: The Brain. Written in Python. It processes data, manages the simulation physics, and broadcasts updates via WebSockets.
2.  **`/ui`**: The Face. Written with React and CesiumJS. It takes that raw data and turns it into the cool 3D visualization you see.

### Why Did I Build This?
While diving into the Cesium ecosystem, I wanted to specifically experience how to efficiently handle and render **time-dynamic data** in a 3D environment. This project serves as both a learning journey and a proof-of-concept for what's possible with modern WebGIS technologies.

I hope you enjoy exploring it!
