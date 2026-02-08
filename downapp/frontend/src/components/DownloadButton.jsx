import React from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';

const DownloadButton = ({ onDownload, isDownloading }) => {
    return (
        <button
            onClick={onDownload}
            disabled={isDownloading}
            className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isDownloading
                    ? 'bg-slate-700 cursor-wait text-slate-300'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                }`}
        >
            {isDownloading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Download className="w-5 h-5" />
                    <span>Download High Quality</span>
                </>
            )}
        </button>
    );
};

export default DownloadButton;
