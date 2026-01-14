import React, { useState } from 'react';
import { DomainData, Comment } from '../types';
import { MessageSquare, CornerDownRight, Send, Wallet } from 'lucide-react';

interface DiscussionTabProps {
  data: DomainData;
  walletConnected: boolean;
  connectWallet: () => void;
}

const DiscussionTab: React.FC<DiscussionTabProps> = ({ data, walletConnected, connectWallet }) => {
  const [comments, setComments] = useState<Comment[]>(data.discussion);
  const [newComment, setNewComment] = useState('');

  const handlePost = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      user: '@you', // Mock user
      text: newComment,
      timestamp: 'Just now'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="h-full flex flex-col relative min-h-[600px] border-2 border-black rounded-2xl bg-white overflow-hidden shadow-sketch">
      
      {/* Header inside the frame */}
      <div className="bg-gray-50 p-4 border-b-2 border-black flex justify-between items-center">
        <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-markerBlack" />
            <h3 className="font-bold font-heading text-lg text-markerBlack">Community Discussion</h3>
        </div>
        <div className="text-xs text-gray-500">{comments.length} comments</div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]">
        {comments.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
                <p className="text-xl">No discussions yet. Be the first!</p>
            </div>
        ) : (
            comments.map((comment) => (
            <div key={comment.id} className={`${comment.replyTo ? 'ml-12' : ''} group`}>
                {comment.replyTo && (
                <CornerDownRight className="w-5 h-5 text-gray-300 inline-block mr-2 -mt-8" />
                )}
                <div className="inline-block max-w-[85%]">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-lg font-heading text-markerBlack">{comment.user}</span>
                        <span className="text-xs text-gray-400 font-sans">{comment.timestamp}</span>
                    </div>
                    <div className="relative">
                         {/* Bubble Style */}
                        <div className="bg-white border-2 border-black rounded-2xl rounded-tl-none px-4 py-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                            <p className="text-lg leading-snug text-markerBlack">{comment.text}</p>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 border-t-2 border-black">
        {!walletConnected ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-gray-600 font-medium text-lg">Connect your wallet to join the discussion</p>
            <button 
              onClick={connectWallet}
              className="flex items-center gap-2 bg-ethBlue text-white px-6 py-3 rounded-xl border-2 border-black shadow-sketch hover:translate-y-[2px] hover:shadow-none transition-all font-bold font-heading"
            >
              <Wallet className="w-5 h-5" />
              Sign-in with Ethereum
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-black flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
                <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts on this problem?"
                className="w-full border-2 border-black rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[80px] text-lg font-medium bg-white text-markerBlack placeholder-gray-400"
                />
                <div className="flex justify-end">
                    <button 
                        onClick={handlePost}
                        disabled={!newComment.trim()}
                        className="bg-black text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        Post <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionTab;