import React, { useState } from 'react';
import { 
  Book, 
  Search, 
  Tag, 
  Clock, 
  Eye, 
  FileText, 
  Plus, 
  ChevronRight, 
  Sparkles,
  Loader2,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { MOCK_ARTICLES } from '../constants';
import { Article } from '../types';
import { useToast } from './Toast';

export const KnowledgeBase: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();

  const categories = ['All', 'Network', 'VoIP', 'Security', 'Billing', 'SOP'];

  const filteredArticles = articles.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      return matchesSearch && matchesCategory;
  });

  const handleAIQuery = () => {
      if (!searchTerm) return;
      setIsGenerating(true);
      // Mock AI generation
      setTimeout(() => {
          setIsGenerating(false);
          addToast('AI has summarized the relevant documentation.', 'success');
      }, 1500);
  };

  const handleGenerateSOP = () => {
      const newSOP: Article = {
          id: `sop-${Date.now()}`,
          title: 'Draft: ' + (searchTerm || 'New Standard Operating Procedure'),
          category: 'SOP',
          tags: ['draft', 'ai-generated'],
          content: '## Objective\nTo standardize the process of...\n\n## Prerequisites\n- Admin access\n\n## Steps\n1. [AI Generated Step 1]\n2. [AI Generated Step 2]',
          author: 'NetServe AI',
          lastUpdated: new Date().toISOString().split('T')[0],
          views: 0
      };
      setArticles(prev => [newSOP, ...prev]);
      setSelectedArticle(newSOP);
      addToast('Draft SOP generated from tickets.', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Book className="w-8 h-8 text-indigo-600" /> Knowledge Base
             </h1>
             <p className="text-slate-500">Centralized repository for SOPs, troubleshooting, and documentation.</p>
          </div>
          <div className="flex gap-2">
              <button 
                onClick={handleGenerateSOP}
                className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
              >
                  <Sparkles className="w-4 h-4" /> AI Draft SOP
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                  <Plus className="w-4 h-4" /> New Article
              </button>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
           {/* Sidebar Categories */}
           <div className="w-full lg:w-64 bg-white rounded-xl border border-slate-200 p-4 shrink-0 h-fit">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
               <div className="space-y-1">
                   {categories.map(cat => (
                       <button 
                         key={cat}
                         onClick={() => setSelectedCategory(cat)}
                         className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex justify-between items-center transition-colors ${
                             selectedCategory === cat ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                         }`}
                       >
                           {cat}
                           {cat !== 'All' && <span className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">{articles.filter(a => a.category === cat).length}</span>}
                       </button>
                   ))}
               </div>
           </div>

           {/* Main Content */}
           <div className="flex-1 flex flex-col min-h-0">
               {/* Search & AI Bar */}
               <div className="relative mb-6">
                   <input 
                     type="text" 
                     placeholder="Ask a question or search keywords (e.g., 'How to config VLAN')..." 
                     className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleAIQuery()}
                   />
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                   {searchTerm && (
                       <button 
                         onClick={handleAIQuery}
                         className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                       >
                           {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                           Ask AI
                       </button>
                   )}
               </div>

               {isGenerating && (
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2">
                       <div className="flex gap-4">
                           <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                               <Sparkles className="w-5 h-5 text-indigo-600" />
                           </div>
                           <div className="space-y-2 w-full">
                               <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                               <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                               <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                           </div>
                       </div>
                   </div>
               )}

               {/* Article List / Reader */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex">
                   {selectedArticle ? (
                       <div className="flex-1 flex flex-col h-full animate-in fade-in">
                           <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                               <div>
                                   <button onClick={() => setSelectedArticle(null)} className="text-xs text-indigo-600 hover:underline mb-2 font-medium">← Back to Results</button>
                                   <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedArticle.title}</h2>
                                   <div className="flex items-center gap-4 text-xs text-slate-500">
                                       <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {selectedArticle.category}</span>
                                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated: {selectedArticle.lastUpdated}</span>
                                       <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {selectedArticle.views} views</span>
                                   </div>
                               </div>
                               <button className="px-3 py-1.5 border border-slate-200 rounded hover:bg-white text-sm text-slate-600">Edit</button>
                           </div>
                           <div className="p-8 overflow-y-auto flex-1 prose prose-slate max-w-none">
                               {selectedArticle.content.split('\n').map((line, i) => (
                                   <p key={i} className="mb-4 text-slate-700 leading-relaxed">{line}</p>
                               ))}
                           </div>
                       </div>
                   ) : (
                       <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
                           {filteredArticles.map(article => (
                               <div 
                                 key={article.id}
                                 onClick={() => setSelectedArticle(article)}
                                 className="p-5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer bg-slate-50 hover:bg-white group"
                               >
                                   <div className="flex justify-between items-start mb-2">
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                           article.category === 'SOP' ? 'bg-purple-100 text-purple-700' :
                                           article.category === 'Security' ? 'bg-red-100 text-red-700' :
                                           'bg-blue-100 text-blue-700'
                                       }`}>
                                           {article.category}
                                       </span>
                                       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                   </div>
                                   <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{article.title}</h3>
                                   <p className="text-xs text-slate-500 line-clamp-2 mb-3">{article.content}</p>
                                   <div className="flex flex-wrap gap-2">
                                       {article.tags.map(tag => (
                                           <span key={tag} className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">#{tag}</span>
                                       ))}
                                   </div>
                               </div>
                           ))}
                           {filteredArticles.length === 0 && (
                               <div className="col-span-full py-12 text-center text-slate-400">
                                   <Book className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                   <p>No articles found. Try a different search.</p>
                               </div>
                           )}
                       </div>
                   )}
               </div>
           </div>
       </div>
    </div>
  );
};