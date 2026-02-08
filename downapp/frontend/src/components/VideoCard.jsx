import React from 'react';
import { Play, Clock, User, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import DownloadButton from './DownloadButton';

const VideoCard = ({ video, onDownload, isDownloading }) => {
    if (!video) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-2xl overflow-hidden w-full mt-4"
        >
            <div className="flex flex-col">
                {/* Thumbnail Area */}
                <div className="w-full aspect-video bg-black relative">
                    {video.thumbnail ? (
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Film className="w-12 h-12" />
                        </div>
                    )}

                    {video.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDuration(video.duration)}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col gap-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-400/10 px-2 py-1 rounded-md">
                                {video.platform || 'Video'}
                            </span>
                            {video.uploader && (
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                    <User className="w-3 h-3" />
                                    <span className="truncate max-w-[120px]">{video.uploader}</span>
                                </div>
                            )}
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">
                            {video.title}
                        </h3>
                    </div>

                    <DownloadButton onDownload={onDownload} isDownloading={isDownloading} />
                </div>
            </div>
        </motion.div>
    );
};

// Helper to format seconds into MM:SS
const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default VideoCard;
