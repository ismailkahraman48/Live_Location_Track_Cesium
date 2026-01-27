# IETT Live Tracking API 🚌

Hello! This folder hosts the **backend** of the project.

The main purpose here is to provide a "live-like" data stream to the frontend. Ideally, I would have connected to a real-time public IETT stream, but due to data format inconsistencies and access limitations, I decided to write my own custom simulation engine.

### What Does It Do?
In simple terms:
1.  **Prepares Data:** It parses route geometries (LineStrings) from IETT's web services or static assets.
2.  **Simulates:** It calculates "where should this bus be right now?" for every single vehicle. To make it look real, it moves buses along their specific route paths at realistic speeds.
3.  **Publishes (WebSocket):** It pushes these calculated coordinates to all connected clients every second (or at a set interval) via WebSockets. This way, the frontend doesn't have to constantly ask "is there new data?".

### Tech Stack
*   **Python:** For rapid development and data processing.
*   **FastAPI:** Chosen for its modern, async architecture. Its WebSocket performance is fantastic.
*   **Uvicorn:** To serve the application.

### How to Run
In a development environment, just do the following:

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server (Usually runs on port 8080)
uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```
