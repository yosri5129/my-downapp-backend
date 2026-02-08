FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for yt-dlp (ffmpeg is crucial)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Install frontend dependencies and build
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ ./
RUN npm run build

# Go back to root
WORKDIR /app

# Expose ports (Flask: 5000)
# Note: In a real production Docker setup, you'd likely serve the frontend static files 
# via Nginx or have the backend serve them. For simplicity here, we'll just document 
# how to run the backend, assuming frontend is static or separate.
# BUT, to make a single "runnable" container, we can use a script to run both or just backend.
# Let's stick to backend for the Docker image as it's the critical piece for "deployment" usually.
# A full stack docker-compose is better for local dev.

EXPOSE 5000

# Command to run the backend using gunicorn
CMD ["gunicorn", "--chdir", "backend", "--bind", "0.0.0.0:5000", "app:app"]
