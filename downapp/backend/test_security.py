import unittest
import sys
import os

# Add backend directory to path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app

class SecurityTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_cors_headers(self):
        """Test that CORS headers are correctly set for allowed origins and missing for others."""
        # Test allowed origin
        origin = 'http://localhost:5173'
        response = self.app.post('/api/info', headers={'Origin': origin})
        self.assertEqual(response.headers.get('Access-Control-Allow-Origin'), origin)

        # Test disallowed origin
        bad_origin = 'http://evil.com'
        response = self.app.post('/api/info', headers={'Origin': bad_origin})
        self.assertNotEqual(response.headers.get('Access-Control-Allow-Origin'), bad_origin)

    def test_invalid_url_input(self):
        """Test that invalid URLs are rejected."""
        # Missing URL
        response = self.app.post('/api/info', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'URL is required', response.data)

        # Malformed URL
        response = self.app.post('/api/info', json={'url': 'not_a_url'})
        self.assertEqual(response.status_code, 400)
        self.assertIn(b'Invalid URL format', response.data)

        # XSS attempt
        response = self.app.post('/api/info', json={'url': 'javascript:alert(1)'})
        self.assertEqual(response.status_code, 400)

    def test_error_sanitization(self):
        """Test that server errors do not leak internal details."""
        # Use a URL that passes validation but will likely fail yt-dlp extraction
        # e.g. a valid domain but 404 page
        response = self.app.post('/api/info', json={'url': 'http://google.com/nonexistent_video'})
        
        self.assertEqual(response.status_code, 500)
        # Check for generic error message
        self.assertIn(b'Failed to fetch video information', response.data)
        # Check that we don't see exception details
        self.assertNotIn(b'Traceback', response.data)
        self.assertNotIn(b'NameError', response.data)

if __name__ == '__main__':
    unittest.main()
