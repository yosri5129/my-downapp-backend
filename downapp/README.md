# Universal Video Downloader

A modern, cross-platform video downloader web application built with React and Flask.

## Features
-   Download videos from various platforms (supported by `yt-dlp`).
-   Modern, responsive UI.
-   No watermark, high quality.

## Prerequisites
-   **Python 3.8+**
-   **Node.js 16+** & **npm**

## Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd downapp
    ```

2.  **Install Backend Dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Running the App

### Windows
Double-click `run_app.bat` or run:
```cmd
.\run_app.bat
```

### macOS / Linux
Run the shell script:
```bash
chmod +x run_app.sh
./run_app.sh
```

The app handles starting both the backend (Flask) and frontend (Vite) servers.
-   Frontend: `http://localhost:5173`
-   Backend: `http://localhost:5000`

## Deployment

### Backend (Render / Heroku)
This repository includes a `Procfile` configured for deployment.
1.  Push code to GitHub.
2.  Connect repository to Render/Heroku.
3.  Set build command: `pip install -r backend/requirements.txt`
4.  Set start command (if not auto-detected from Procfile): `gunicorn --chdir backend app:app`

### Frontend (Vercel / Netlify)
1.  Push code to GitHub.
2.  Connect repository to Vercel/Netlify.
3.  Set **Root Directory** to `frontend`.
4.  Build command: `npm run build`
5.  Output directory: `dist`
6.  **Important**: You will need to configure the frontend to point to your deployed backend URL instead of `localhost:5000`. You can do this by setting an environment variable `VITE_API_URL` and updating `frontend/src/App.jsx` to use it.
