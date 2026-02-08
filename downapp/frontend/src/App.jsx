import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import VideoCard from './components/VideoCard';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

function App() {
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleSearch = async (url) => {
    setIsLoading(true);
    setError(null);
    setVideo(null);
    setCurrentUrl(url);

    try {
      const response = await axios.post('/api/info', { url });
      setVideo(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch video info. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!currentUrl) return;

    setIsDownloading(true);
    try {
      const response = await axios.post('/api/download', {
        url: currentUrl
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Try to get filename from content-disposition header if available, otherwise default
      // Note: CORS might block accessing some headers unless exposed
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'video.mp4';
      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Failed to download video. It might be restricted or too large.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg text-white flex flex-col pt-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          U-Downloader
        </h1>
      </motion.div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 w-full bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col justify-start mt-6">
        <VideoCard
          video={video}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </div>

      <div className="py-6 text-slate-600 text-xs text-center w-full">
        <p>Free • No Watermark • High Quality</p>
      </div>
    </div>
  );
}

export default App;
