import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, isLoading }) => {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url.trim()) {
            onSearch(url.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-lg shadow-lg"
                        placeholder="Paste Link (TikTok, Insta...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Analyze Video'}
                </button>
            </form>
        </motion.div>
    );
};

export default SearchBar;
