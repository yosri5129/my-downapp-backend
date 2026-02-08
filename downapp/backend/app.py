import os
import re
from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
import yt_dlp
import uuid
import logging

app = Flask(__name__)
# Restrict CORS to local development frontend AND local network
# Allow localhost and typical local network IPs (192.168.x.x, 10.x.x.x, 172.16.x.x)
# In a real scenario, you might want to be more specific or use a regex callback for origins
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    r"^http://192\.168\.\d{1,3}\.\d{1,3}:5173$",
    r"^http://10\.\d{1,3}\.\d{1,3}\.\d{1,3}:5173$",
    r"^http://172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}:5173$"
]}})

# Configure logging
logging.basicConfig(level=logging.INFO)

DOWNLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

def is_valid_url(url):
    """
    Basic URL validation.
    Checks if the URL starts with http:// or https:// and contains a valid domain structure.
    """
    if not url:
        return False
    regex = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' # domain...
        r'localhost|' # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    return re.match(regex, url) is not None

@app.route('/api/info', methods=['POST'])
def get_video_info():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
        
    if not is_valid_url(url):
        return jsonify({'error': 'Invalid URL format'}), 400

    try:
        ydl_opts = {'quiet': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract relevant info
            video_data = {
                'title': info.get('title'),
                'thumbnail': info.get('thumbnail'),
                'duration': info.get('duration'),
                'uploader': info.get('uploader'),
                'platform': info.get('extractor_key'),
                'formats': []
            }
            
            return jsonify(video_data)
    except Exception as e:
        app.logger.error(f"Error fetching video info: {str(e)}")
        # Return a generic error message to avoid leaking internal details
        return jsonify({'error': 'Failed to fetch video information. Please check the URL.'}), 500

@app.route('/api/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
        
    if not is_valid_url(url):
        return jsonify({'error': 'Invalid URL format'}), 400

    try:
        # Generate a unique filename
        filename = f"{uuid.uuid4()}"
        
        ydl_opts = {
            'format': 'best',  # generic best
            'outtmpl': os.path.join(DOWNLOAD_FOLDER, f'{filename}.%(ext)s'),
            'quiet': True,
        }
        
        downloaded_file_path = None

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            expected_filename = ydl.prepare_filename(info)
            downloaded_file_path = expected_filename

        if downloaded_file_path and os.path.exists(downloaded_file_path):
            # Schedule file deletion after sending
            @after_this_request
            def remove_file(response):
                try:
                    os.remove(downloaded_file_path)
                except Exception as error:
                    app.logger.error(f"Error removing file {downloaded_file_path}: {error}")
                return response

            return send_file(downloaded_file_path, as_attachment=True, download_name=os.path.basename(downloaded_file_path))
        else:
            app.logger.error("Download finished but file not found.")
            return jsonify({'error': 'Download failed'}), 500

    except Exception as e:
        app.logger.error(f"Error downloading video: {str(e)}")
        return jsonify({'error': 'An error occurred during download.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
