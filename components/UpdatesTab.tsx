import React, { useState, useMemo, useEffect } from 'react';
import { Update } from '../types';
import { Flame, Trophy, Clock, Heart, MessageCircle, Share2, Send, PenTool } from 'lucide-react';

interface UpdatesTabProps {
  updates?: Update[];
  onAddUpdate?: (update: Update) => void;
}

const UpdatesTab: React.FC<UpdatesTabProps> = ({ updates = [], onAddUpdate }) => {
  // Local state to handle both prop updates and new user posts
  const [items, setItems] = useState<Update[]>(updates);
  const [sortMethod, setSortMethod] = useState<'hot' | 'top' | 'new'>('hot');
  const [likedUpdateIds, setLikedUpdateIds] = useState<Set<string>>(new Set());

  // Form State
  const [newContent, setNewContent] = useState('');

  // Sync items when domain changes or parent updates updates
  useEffect(() => {
    setItems(updates);
  }, [updates]);

  const toggleLike = (id: string) => {
    const newSet = new Set(likedUpdateIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setLikedUpdateIds(newSet);
  };

  const handlePost = () => {
    if (!newContent.trim()) return;

    const newUpdate: Update = {
      id: `local-${Date.now()}`,
      author: {
        name: 'You',
        handle: '@you',
        avatarSeed: 'curious-builder',
      },
      content: newContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      type: 'community',
    };

    if (onAddUpdate) {
      onAddUpdate(newUpdate);
    } else {
      // Fallback for local state if no prop provided
      setItems(prev => [newUpdate, ...prev]);
    }
    
    setNewContent('');
    setSortMethod('new'); // Switch to new so they see their post
  };

  // Sorting Logic
  const sortedUpdates = useMemo(() => {
    const currentItems = [...items];
    
    switch (sortMethod) {
      case 'new':
        return currentItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case 'top':
        return currentItems.sort((a, b) => {
            const aLikes = a.likes + (likedUpdateIds.has(a.id) ? 1 : 0);
            const bLikes = b.likes + (likedUpdateIds.has(b.id) ? 1 : 0);
            return bLikes - aLikes;
        });
      case 'hot':
      default:
        // Simple "Hot" heuristic: Likes / Age in Hours (with a small decay factor)
        return currentItems.sort((a, b) => {
            const now = Date.now();
            const aAge = (now - new Date(a.timestamp).getTime()) / (1000 * 60 * 60);
            const bAge = (now - new Date(b.timestamp).getTime()) / (1000 * 60 * 60);
            // Add small offset to age to prevent division by zero or huge scores for "just now"
            const aScore = (a.likes + (likedUpdateIds.has(a.id) ? 1 : 0) + 1) / Math.pow(aAge + 1, 1.5);
            const bScore = (b.likes + (likedUpdateIds.has(b.id) ? 1 : 0) + 1) / Math.pow(bAge + 1, 1.5);
            return bScore - aScore;
        });
    }
  }, [items, sortMethod, likedUpdateIds]);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Create Post Section */}
      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-sketch-sm mb-8">
        <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 border border-black overflow-hidden flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=curious-builder`} alt="you" />
            </div>
            <div className="flex-1">
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Share an update, research finding, or project launch..."
                    className="w-full border-none outline-none resize-none text-lg bg-transparent placeholder-gray-400 mb-2 h-20 font-medium"
                />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-3 border-t border-dashed border-gray-200 pt-3">
                    <button 
                        onClick={handlePost}
                        disabled={!newContent.trim()}
                        className="bg-ethBlue text-white px-5 py-1.5 rounded-lg font-bold shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center gap-2 text-sm"
                    >
                        Post Update <Send className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Feed Header / Sorter */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-heading hidden md:block">Latest Activity</h3>
        <div className="flex p-1 bg-gray-100 rounded-lg border border-gray-200 w-full md:w-auto">
            {[
                { id: 'hot', label: 'Hot', icon: Flame },
                { id: 'top', label: 'Top', icon: Trophy },
                { id: 'new', label: 'New', icon: Clock },
            ].map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => setSortMethod(opt.id as any)}
                    className={`
                        flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold transition-all
                        ${sortMethod === opt.id 
                            ? 'bg-white text-black shadow-sm border border-gray-200' 
                            : 'text-gray-500 hover:text-gray-700'}
                    `}
                >
                    <opt.icon className={`w-4 h-4 ${sortMethod === opt.id ? 'text-ethBlue' : ''}`} />
                    {opt.label}
                </button>
            ))}
        </div>
      </div>

      {items.length === 0 ? (
         <div className="text-center py-20 animate-in fade-in border-2 border-dashed border-gray-200 rounded-xl">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <PenTool className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 font-heading">No updates yet</h3>
            <p className="text-gray-500">Be the first to share what's happening!</p>
          </div>
      ) : (
        /* Feed List */
        <div className="flex flex-col gap-4">
            {sortedUpdates.map((update) => {
                const isLiked = likedUpdateIds.has(update.id);
                const currentLikes = update.likes + (isLiked ? 1 : 0);

                return (
                    <div key={update.id} className="bg-white border-2 border-black rounded-xl p-5 shadow-sketch-sm hover:shadow-sketch transition-all">
                        <div className="flex gap-4">
                            
                            {/* Vote Column */}
                            <div className="flex flex-col items-center gap-1 pt-1">
                                <button 
                                    onClick={() => toggleLike(update.id)}
                                    className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100 text-gray-400'}`}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                                <span className={`text-sm font-bold ${isLiked ? 'text-black' : 'text-gray-500'}`}>{currentLikes}</span>
                            </div>

                            {/* Content Column */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 border border-black">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${update.author.avatarSeed}`} alt="avatar" />
                                        </div>
                                        <span className="font-bold text-sm">{update.author.name}</span>
                                        <span className="text-gray-400 text-xs">{update.author.handle}</span>
                                        <span className="text-gray-300 text-xs">•</span>
                                        <span className="text-gray-400 text-xs">{formatTime(update.timestamp)}</span>
                                    </div>
                                </div>

                                <p className="text-gray-800 font-medium leading-relaxed mb-3 whitespace-pre-wrap">
                                    {update.content}
                                </p>

                                <div className="flex items-center gap-4">
                                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-xs font-bold transition-colors">
                                        <MessageCircle className="w-4 h-4" />
                                        {update.comments} Comments
                                    </button>
                                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 text-xs font-bold transition-colors">
                                        <Share2 className="w-4 h-4" />
                                        Share
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
      )}
    </div>
  );
};

export default UpdatesTab;