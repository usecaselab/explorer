import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { DomainData } from '../types';
import { Sparkles, Bot, Loader2, Lightbulb, Eraser, Pencil, ArrowBigUp, ArrowBigDown, Plus, User } from 'lucide-react';

interface BrainstormTabProps {
  data: DomainData;
}

interface GeneratedIdea {
  title: string;
  description: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  rationale?: string;
  author: string;
  votes: number;
  userVote: 'up' | 'down' | null;
  avatarSeed: string;
}

// Mock data for the "Community Gallery"
const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'm1',
    title: 'Hyperlocal DAO Treasuries',
    description: 'Small scale multisigs for street-level maintenance (cleaning, repairs) funded by neighbors, bypassing slow municipal allocation.',
    rationale: 'Solves the free-rider problem in neighborhoods.',
    author: '@urban_planner',
    votes: 42,
    userVote: null,
    avatarSeed: 'urban'
  },
  {
    id: 'm2',
    title: 'Zero-Knowledge Resume',
    description: 'A standard for proving work history and skills without revealing exact dates or previous employers, preventing bias.',
    author: '@privacy_first',
    votes: 28,
    userVote: 'up',
    avatarSeed: 'zk'
  },
  {
    id: 'm3',
    title: 'NFT Warranty Cards',
    description: 'Replace paper receipts with soulbound tokens that burn upon warranty expiration. Transferable only if the physical item is sold.',
    author: '@retail_rebel',
    votes: 15,
    userVote: null,
    avatarSeed: 'retail'
  }
];

const BrainstormTab: React.FC<BrainstormTabProps> = ({ data }) => {
  const [focus, setFocus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Gallery State
  const [gallery, setGallery] = useState<GalleryItem[]>(MOCK_GALLERY);

  // Editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<GeneratedIdea | null>(null);
  const [postedIndices, setPostedIndices] = useState<Set<number>>(new Set());

  const generateIdeas = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedIdeas([]);
    setEditingIndex(null);
    setPostedIndices(new Set());

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `You are a visionary product architect specializing in Ethereum and Web3 technologies. 
      Your goal is to generate innovative, non-obvious, and practical use case ideas based on a specific domain problem.
      Focus on high-impact solutions that leverage unique blockchain properties (decentralization, trustlessness, censorship resistance).`;

      const prompt = `
        Domain: ${data.title}
        Problem Statement: ${data.problemStatement}
        Existing Ideas to avoid (create something new): ${data.ideas.map(i => i.title).join(', ')}.
        
        User Focus/Constraint: ${focus || "General innovation suitable for hackathons or startups."}

        Generate 3 distinct use case ideas.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["title", "description"]
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const ideas = JSON.parse(text) as GeneratedIdea[];
        setGeneratedIdeas(ideas);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate ideas. Please check your API configuration or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditForm(generatedIdeas[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditForm(null);
  };

  const saveEditing = (index: number) => {
    if (editForm) {
        const newIdeas = [...generatedIdeas];
        newIdeas[index] = editForm;
        setGeneratedIdeas(newIdeas);
        setEditingIndex(null);
        setEditForm(null);
    }
  };

  const addToGallery = (index: number) => {
    const idea = generatedIdeas[index];
    
    const newItem: GalleryItem = {
        id: `local-${Date.now()}-${index}`,
        title: idea.title,
        description: idea.description,
        author: '@you',
        votes: 1,
        userVote: 'up',
        avatarSeed: 'curious-builder'
    };

    setGallery([newItem, ...gallery]);
    
    const newPosted = new Set(postedIndices);
    newPosted.add(index);
    setPostedIndices(newPosted);
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    setGallery(prevGallery => prevGallery.map(item => {
        if (item.id === id) {
            let newVotes = item.votes;
            let newUserVote = item.userVote;

            if (item.userVote === direction) {
                // Toggle off
                newUserVote = null;
                newVotes += (direction === 'up' ? -1 : 1);
            } else {
                // Remove previous vote impact if exists
                if (item.userVote === 'up') newVotes -= 1;
                if (item.userVote === 'down') newVotes += 1;
                
                // Apply new vote
                newUserVote = direction;
                newVotes += (direction === 'up' ? 1 : -1);
            }

            return {
                ...item,
                userVote: newUserVote,
                votes: newVotes
            };
        }
        return item;
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      
      {/* Control Panel */}
      <section className="bg-white border-2 border-black rounded-xl p-6 shadow-sketch relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Bot className="w-32 h-32" />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-ethBlue" />
                <h3 className="text-2xl font-bold font-heading">AI Co-Architect</h3>
            </div>
            
            <p className="text-gray-600 mb-6 max-w-2xl font-medium">
                Leverage Gemini to synthesize new concepts for <span className="font-bold text-black">{data.title}</span> based on the current problem statement.
            </p>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Focus Area (Optional)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={focus}
                            onChange={(e) => setFocus(e.target.value)}
                            placeholder="e.g. Focus on mobile-first privacy... or Use Zero Knowledge proofs..."
                            className="flex-1 border-2 border-black rounded-lg px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50"
                            onKeyDown={(e) => e.key === 'Enter' && generateIdeas()}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={generateIdeas}
                        disabled={isGenerating}
                        className="bg-black text-white px-6 py-3 rounded-lg font-bold shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 text-yellow-300" /> Generate Concepts
                            </>
                        )}
                    </button>
                    {generatedIdeas.length > 0 && (
                        <button 
                            onClick={() => setGeneratedIdeas([])}
                            className="px-4 py-3 text-gray-500 font-bold hover:text-red-500 flex items-center gap-2 transition-colors"
                        >
                            <Eraser className="w-4 h-4" /> Clear
                        </button>
                    )}
                </div>
                {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
            </div>
        </div>
      </section>

      {/* AI Results Area */}
      {generatedIdeas.length > 0 && (
        <section>
            <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="w-6 h-6 text-markerBlack" />
                <h3 className="text-2xl font-bold font-heading">Generated Drafts</h3>
                <span className="text-sm text-gray-500 font-medium ml-2">- Edit and post to the community gallery</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {generatedIdeas.map((idea, idx) => {
                    const isEditing = editingIndex === idx;
                    const isPosted = postedIndices.has(idx);

                    return (
                        <div key={idx} className={`
                            bg-[#FFFBEB] border-2 border-black p-6 shadow-sketch transition-all relative flex flex-col h-full gap-4
                            ${isEditing ? 'scale-105 z-20 rotate-0 shadow-sketch-hover' : 'hover:-translate-y-1 rotate-1 even:-rotate-1 hover:rotate-0 hover:z-10'}
                        `}>
                            {/* Sticky Note Pin */}
                            {!isEditing && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 border-2 border-black shadow-sm"></div>
                            )}

                            {isEditing ? (
                                /* Edit Mode */
                                <div className="flex flex-col gap-3 flex-1">
                                    <input 
                                        type="text" 
                                        value={editForm?.title || ''}
                                        onChange={(e) => setEditForm(prev => prev ? ({...prev, title: e.target.value}) : null)}
                                        className="w-full bg-white border border-black/20 rounded p-2 font-bold font-heading text-lg"
                                        placeholder="Title"
                                    />
                                    <textarea 
                                        value={editForm?.description || ''}
                                        onChange={(e) => setEditForm(prev => prev ? ({...prev, description: e.target.value}) : null)}
                                        className="w-full bg-white border border-black/20 rounded p-2 text-sm font-medium h-40 resize-none"
                                        placeholder="Description"
                                    />
                                    <div className="flex gap-2 mt-auto pt-2">
                                        <button onClick={() => saveEditing(idx)} className="flex-1 bg-black text-white text-xs font-bold py-2 rounded hover:bg-gray-800">Save</button>
                                        <button onClick={cancelEditing} className="flex-1 bg-transparent border border-black text-black text-xs font-bold py-2 rounded hover:bg-gray-100">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-xl font-heading leading-tight mb-2">{idea.title}</h4>
                                        <p className="text-gray-800 font-medium text-sm leading-relaxed">
                                            {idea.description}
                                        </p>
                                    </div>
                                    
                                    {!isPosted ? (
                                        <div className="flex gap-2 pt-2 border-t border-black/5 mt-auto">
                                            <button 
                                                onClick={() => startEditing(idx)}
                                                className="flex-1 flex items-center justify-center gap-1 py-2 rounded hover:bg-black/5 text-xs font-bold text-gray-700 transition-colors"
                                                title="Edit this idea"
                                            >
                                                <Pencil className="w-3 h-3" /> Edit
                                            </button>
                                            <button 
                                                onClick={() => addToGallery(idx)}
                                                className="flex-1 flex items-center justify-center gap-1 py-2 rounded text-xs font-bold transition-colors bg-black text-white hover:bg-gray-800"
                                                title="Post to Community Gallery"
                                            >
                                                <Plus className="w-3 h-3" /> Post
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-auto text-center py-2 bg-green-100 text-green-800 text-xs font-bold rounded border border-green-200">
                                            Added to Gallery!
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
      )}

      {/* Community Gallery Section */}
      <section>
         <div className="flex items-center gap-2 mb-6 pt-8 border-t-2 border-dashed border-gray-300">
            <User className="w-6 h-6 text-markerBlack" />
            <h3 className="text-2xl font-bold font-heading">Community Concepts</h3>
            <span className="text-sm text-gray-500 font-medium ml-2">- Vote on your favorites</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gallery.map((item) => (
                <div key={item.id} className="bg-white border-2 border-black rounded-xl p-5 shadow-sketch-sm hover:shadow-sketch hover:-translate-y-0.5 transition-all flex gap-4 group">
                    {/* Vote Widget */}
                    <div className="flex flex-col items-center gap-1 border-r border-gray-100 pr-4 min-w-[60px]">
                        <button 
                            onClick={() => handleVote(item.id, 'up')}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${item.userVote === 'up' ? 'text-ethBlue' : 'text-gray-400'}`}
                        >
                            <ArrowBigUp className={`w-8 h-8 ${item.userVote === 'up' ? 'fill-current' : ''}`} />
                        </button>
                        
                        <span className={`text-lg font-bold font-heading ${item.userVote === 'up' ? 'text-ethBlue' : item.userVote === 'down' ? 'text-red-500' : 'text-gray-600'}`}>
                            {item.votes}
                        </span>

                        <button 
                            onClick={() => handleVote(item.id, 'down')}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${item.userVote === 'down' ? 'text-red-500' : 'text-gray-400'}`}
                        >
                            <ArrowBigDown className={`w-8 h-8 ${item.userVote === 'down' ? 'fill-current' : ''}`} />
                        </button>
                    </div>

                    <div className="flex-1 py-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 border border-black overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.avatarSeed}`} alt="avatar" />
                            </div>
                            <span className="text-xs font-bold text-gray-500">{item.author}</span>
                        </div>
                        <h4 className="font-bold text-lg font-heading leading-tight mb-1 group-hover:text-ethBlue transition-colors">
                            {item.title}
                        </h4>
                        <p className="text-gray-700 text-sm font-medium leading-snug mb-2">
                            {item.description}
                        </p>
                        {item.rationale && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 italic">
                                {item.rationale}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </section>

    </div>
  );
};

export default BrainstormTab;