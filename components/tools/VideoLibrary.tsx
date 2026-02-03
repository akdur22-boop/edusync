import React, { useState, useEffect } from 'react';
import { api } from '../../services/mockApi';
import { VideoResource } from '../../types';
import { Button } from '../Button';
import { Youtube, Search, PlayCircle, ThumbsUp, Filter, BookOpen } from 'lucide-react';

export const VideoLibrary: React.FC = () => {
  const [allVideos, setAllVideos] = useState<VideoResource[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoResource[]>([]);
  
  // Filters
  const [selectedExam, setSelectedExam] = useState<'Tümü' | 'YKS' | 'LGS'>('Tümü');
  const [selectedSubject, setSelectedSubject] = useState<string>('Tümü');
  const [selectedLevel, setSelectedLevel] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setAllVideos(api.getVideoLibrary());
  }, []);

  useEffect(() => {
    let result = allVideos;

    if (selectedExam !== 'Tümü') {
      if (selectedExam === 'YKS') {
        result = result.filter(v => v.examType === 'TYT' || v.examType === 'AYT');
      } else {
        result = result.filter(v => v.examType === selectedExam);
      }
    }

    if (selectedSubject !== 'Tümü') {
      result = result.filter(v => v.subject === selectedSubject);
    }

    if (selectedLevel !== 'Tümü') {
      result = result.filter(v => v.level === selectedLevel);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.channelName.toLowerCase().includes(q) || 
        v.title.toLowerCase().includes(q) ||
        v.subject.toLowerCase().includes(q)
      );
    }

    setFilteredVideos(result);
  }, [allVideos, selectedExam, selectedSubject, selectedLevel, searchQuery]);

  const uniqueSubjects = Array.from(new Set(allVideos.map(v => v.subject)));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <Youtube className="w-8 h-8 text-red-600" /> Video Kütüphanesi
          </h2>
          <p className="text-gray-500 mt-1">Hangi dersi hangi hocadan dinlemen gerektiğini keşfet.</p>
        </div>
        
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
              type="text" 
              placeholder="Kanal veya konu ara..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
         <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mr-2">
            <Filter className="w-4 h-4" /> Filtrele:
         </div>
         
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {['Tümü', 'YKS', 'LGS'].map(exam => (
               <button
                  key={exam}
                  onClick={() => setSelectedExam(exam as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                     selectedExam === exam 
                        ? 'bg-red-50 text-red-600 border border-red-100' 
                        : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                  }`}
               >
                  {exam}
               </button>
            ))}
         </div>

         <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

         <select 
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 border-transparent hover:bg-gray-100 outline-none cursor-pointer w-full md:w-auto"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
         >
            <option value="Tümü">Tüm Dersler</option>
            {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
         </select>

         <select 
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 border-transparent hover:bg-gray-100 outline-none cursor-pointer w-full md:w-auto"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
         >
            <option value="Tümü">Tüm Seviyeler</option>
            <option value="Temel">Temel (Sıfırdan)</option>
            <option value="Orta">Orta Seviye</option>
            <option value="İleri">İleri / Derece</option>
         </select>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredVideos.map(video => (
            <div key={video.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden flex flex-col h-full">
               {/* Card Header (Thumbnail Mockup) */}
               <div className="h-32 bg-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
                  {/* Abstract Pattern */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                     <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  <div className="absolute top-3 left-3 flex gap-2">
                     <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase text-white/90 ${
                        video.examType === 'LGS' ? 'bg-orange-500' : 'bg-blue-600'
                     }`}>
                        {video.examType}
                     </span>
                     <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-white/20 backdrop-blur-sm text-white">
                        {video.subject}
                     </span>
                  </div>
               </div>

               <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${video.avatarColor}`}>
                           {video.channelName.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold text-gray-900 text-sm line-clamp-1">{video.channelName}</div>
                           <div className="text-xs text-gray-500">{video.style}</div>
                        </div>
                     </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 mb-2 leading-tight group-hover:text-red-600 transition-colors">
                     {video.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        video.level === 'Temel' ? 'bg-green-50 text-green-700 border-green-100' :
                        video.level === 'Orta' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                        'bg-purple-50 text-purple-700 border-purple-100'
                     }`}>
                        {video.level} Seviye
                     </span>
                     {video.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-100">
                           #{tag}
                        </span>
                     ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <ThumbsUp className="w-3.5 h-3.5" /> {video.likes.toLocaleString()}
                     </div>
                     <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
                     >
                        Kanala Git <Youtube className="w-3.5 h-3.5" />
                     </a>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {filteredVideos.length === 0 && (
         <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Sonuç Bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
         </div>
      )}
    </div>
  );
};
