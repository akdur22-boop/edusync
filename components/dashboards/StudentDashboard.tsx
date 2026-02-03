import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/mockApi';
import { analyzePerformance } from '../../services/aiService';
import { Result, AIAnalysis, Assignment, ProgramItem } from '../../types';
import { Button } from '../Button';
import { Brain, PlusCircle, History, BookOpenCheck, CheckCircle2, Clock, X, ChevronRight, CalendarDays, BookOpen, Youtube, MonitorPlay } from 'lucide-react';
import { VideoLibrary } from '../tools/VideoLibrary';

// Virtual Optical Form Component
const VirtualOpticalForm = ({ assignment, onClose, onSubmit }: { assignment: Assignment, onClose: () => void, onSubmit: (answers: string[]) => void }) => {
   const [answers, setAnswers] = useState<string[]>(Array(assignment.questionCount).fill(''));

   const handleOptionSelect = (qIndex: number, option: string) => {
      const newAnswers = [...answers];
      newAnswers[qIndex] = option;
      setAnswers(newAnswers);
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
         <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <div>
                  <h3 className="font-bold text-lg text-gray-900">{assignment.bookName}</h3>
                  <p className="text-sm text-gray-500">{assignment.testRange} • {assignment.questionCount} Soru</p>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {Array.from({ length: assignment.questionCount }).map((_, i) => (
                     <div key={i} className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <span className="text-sm font-bold text-gray-700 w-8">{i + 1}.</span>
                        <div className="flex gap-1.5">
                           {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                              <button
                                 key={opt}
                                 onClick={() => handleOptionSelect(i, opt)}
                                 className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                                    answers[i] === opt 
                                       ? 'bg-primary-600 text-white shadow-md scale-110' 
                                       : 'bg-white border border-gray-200 text-gray-500 hover:border-primary-300'
                                 }`}
                              >
                                 {opt}
                              </button>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
               <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <span>İşaretlenen: {answers.filter(a => a !== '').length}</span>
                  <span>Boş: {answers.filter(a => a === '').length}</span>
               </div>
               <Button onClick={() => onSubmit(answers)} className="w-full">Testi Bitir ve Gönder</Button>
            </div>
         </div>
      </div>
   );
};

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analysis' | 'homework' | 'program' | 'videos'>('analysis');
  const [results, setResults] = useState<Result[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [programItems, setProgramItems] = useState<ProgramItem[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    sourceName: '',
    lesson: 'Matematik',
    topic: '',
    testName: '',
    correct: 0,
    incorrect: 0,
    empty: 0,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user) {
      const data = api.getResults(user.id);
      setResults(data);
      setAnalysis(analyzePerformance(data));
      setAssignments(api.getAssignments(user.id));
      
      const program = api.getStudyProgram(user.id);
      setProgramItems(program.items);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newResult = api.addResult({
      ...formData,
      studentId: user.id
    });
    
    const updatedResults = [newResult, ...results];
    setResults(updatedResults);
    setAnalysis(analyzePerformance(updatedResults));
    
    // Reset form mostly
    setFormData(prev => ({ ...prev, topic: '', testName: '', correct: 0, incorrect: 0, empty: 0 }));
  };

  const handleSubmitAssignment = (answers: string[]) => {
      if(selectedAssignment) {
         const updatedAssignment = api.submitAssignment(selectedAssignment.id, answers);
         // Update local state
         setAssignments(assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
         setSelectedAssignment(null);
         alert(`Tebrikler! Testi tamamladınız. Puanınız: ${updatedAssignment.score}`);
      }
  };

  const handleToggleItem = (itemId: string) => {
      if(user) {
         const updatedItem = api.toggleProgramItem(user.id, itemId);
         if(updatedItem) {
            setProgramItems(programItems.map(i => i.id === itemId ? updatedItem : i));
         }
      }
  };

  // Group program by date
  const groupedProgram: Record<string, ProgramItem[]> = {};
  const today = new Date();
  // Get next 7 days for display
  const displayDays = [];
  for(let i=0; i<7; i++) {
     const d = new Date(today);
     d.setDate(today.getDate() + i);
     displayDays.push(d);
  }

  programItems.forEach(item => {
     if(!groupedProgram[item.date]) groupedProgram[item.date] = [];
     groupedProgram[item.date].push(item);
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex bg-white p-1 rounded-xl border border-gray-200 w-fit overflow-x-auto max-w-full">
         <button 
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'analysis' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
         >
            Analiz & Giriş
         </button>
         <button 
            onClick={() => setActiveTab('program')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'program' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
         >
            Çalışma Programım
         </button>
         <button 
            onClick={() => setActiveTab('homework')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'homework' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
         >
            Ödevlerim ({assignments.filter(a => a.status === 'pending').length})
         </button>
         <button 
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'videos' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
         >
            <MonitorPlay className="w-4 h-4" /> Video Kütüphanesi
         </button>
      </div>

      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* AI Analysis Card */}
          <div className="md:col-span-3 bg-gradient-to-r from-primary-50 to-white p-6 rounded-2xl border border-primary-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-xl">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">AI Performans Analizi</h3>
                <p className="text-gray-700 mb-2">{analysis?.recommendation}</p>
                {analysis?.weakTopics.length ? (
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-bold text-red-500 uppercase">Zayıf Konular:</span>
                    {analysis.weakTopics.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">{t}</span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="ml-auto text-center hidden md:block">
                <div className="text-3xl font-black text-primary-600">{analysis?.score}%</div>
                <div className="text-xs text-gray-500">Genel Başarı</div>
              </div>
            </div>
          </div>

          {/* Data Entry Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <PlusCircle className="w-5 h-5 text-gray-500" />
              <h3 className="font-bold text-gray-900">Veri Girişi</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Yayın Adı</label>
                <input required type="text" className="w-full p-2 border rounded-lg text-sm" value={formData.sourceName} onChange={e => setFormData({...formData, sourceName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ders</label>
                  <select className="w-full p-2 border rounded-lg text-sm bg-white" value={formData.lesson} onChange={e => setFormData({...formData, lesson: e.target.value})}>
                    <option>Matematik</option>
                    <option>Fizik</option>
                    <option>Kimya</option>
                    <option>Biyoloji</option>
                    <option>Türkçe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Konu</label>
                  <input required type="text" className="w-full p-2 border rounded-lg text-sm" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Test Adı / No</label>
                <input required type="text" className="w-full p-2 border rounded-lg text-sm" value={formData.testName} onChange={e => setFormData({...formData, testName: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-green-700 mb-1">Doğru</label>
                  <input required type="number" min="0" className="w-full p-2 border border-green-200 bg-green-50 rounded-lg text-sm" value={formData.correct} onChange={e => setFormData({...formData, correct: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-red-700 mb-1">Yanlış</label>
                  <input required type="number" min="0" className="w-full p-2 border border-red-200 bg-red-50 rounded-lg text-sm" value={formData.incorrect} onChange={e => setFormData({...formData, incorrect: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Boş</label>
                  <input required type="number" min="0" className="w-full p-2 border border-gray-200 bg-gray-50 rounded-lg text-sm" value={formData.empty} onChange={e => setFormData({...formData, empty: parseInt(e.target.value)})} />
                </div>
              </div>
              <Button type="submit" size="sm" className="w-full">Kaydet</Button>
            </form>
          </div>

          {/* History List */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gray-500" />
                <h3 className="font-bold text-gray-900">Çözüm Geçmişi</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3">Ders</th>
                    <th className="px-4 py-3">Konu</th>
                    <th className="px-4 py-3">D / Y / B</th>
                    <th className="px-4 py-3">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(r => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{r.date}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{r.lesson}</td>
                      <td className="px-4 py-3 text-gray-600">{r.topic}</td>
                      <td className="px-4 py-3">
                        <span className="text-green-600 font-bold">{r.correct}</span> / 
                        <span className="text-red-600 font-bold"> {r.incorrect}</span> / 
                        <span className="text-gray-400"> {r.empty}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-primary-600">
                        {(r.correct - r.incorrect * 0.25).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.length === 0 && (
                <p className="text-center py-8 text-gray-500">Henüz kayıt bulunmuyor.</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'program' && (
         <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {displayDays.map((day, i) => {
               const dateStr = day.toISOString().split('T')[0];
               const items = groupedProgram[dateStr] || [];
               const isToday = dateStr === new Date().toISOString().split('T')[0];

               return (
                  <div key={i} className={`bg-white rounded-2xl border ${isToday ? 'border-indigo-200 shadow-md ring-1 ring-indigo-100' : 'border-gray-100'} overflow-hidden`}>
                     <div className={`px-6 py-4 border-b flex justify-between items-center ${isToday ? 'bg-indigo-50/50' : 'bg-gray-50/50'}`}>
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-gray-200 text-gray-700'}`}>
                              {day.getDate()}
                           </div>
                           <div>
                              <div className="font-bold text-gray-900">{day.toLocaleDateString('tr-TR', {weekday: 'long'})}</div>
                              <div className="text-xs text-gray-500">{day.toLocaleDateString('tr-TR', {month: 'long', year: 'numeric'})}</div>
                           </div>
                        </div>
                        {items.length > 0 && (
                           <span className="text-xs font-medium text-gray-500">{items.filter(i => i.isCompleted).length}/{items.length} Tamamlandı</span>
                        )}
                     </div>
                     
                     <div className="p-4 space-y-3">
                        {items.length === 0 ? (
                           <div className="text-center py-4 text-gray-400 text-sm italic">Bugün için planlanmış çalışma yok. Dinlenme zamanı! 🎉</div>
                        ) : (
                           items.map(item => (
                              <div key={item.id} className={`flex items-center p-3 rounded-xl border transition-all ${item.isCompleted ? 'bg-green-50 border-green-100 opacity-60' : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm'}`}>
                                 <button 
                                    onClick={() => handleToggleItem(item.id)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${item.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-indigo-400'}`}
                                 >
                                    {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                                 </button>
                                 <div className="flex-1">
                                    <div className={`font-bold text-gray-900 ${item.isCompleted ? 'line-through text-gray-500' : ''}`}>{item.subject} <span className="font-normal text-gray-500 mx-1">•</span> {item.topic}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                       {item.bookName && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                                             <BookOpen className="w-3 h-3" /> {item.bookName}
                                          </span>
                                       )}
                                       {item.type === 'test' && item.questionTarget && (
                                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600 border border-orange-100">
                                             Target: {item.questionTarget} Soru
                                          </span>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      )}

      {activeTab === 'homework' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
           {assignments.sort((a,b) => (a.status === 'pending' ? -1 : 1)).map(assignment => (
              <div key={assignment.id} className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden group transition-all ${assignment.status === 'pending' ? 'bg-white border-gray-100 hover:shadow-lg' : 'bg-gray-50 border-gray-200 opacity-80'}`}>
                 {assignment.status === 'pending' && <div className="absolute top-0 right-0 w-20 h-20 bg-primary-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-125 transition-transform"></div>}
                 
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                       <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                          <BookOpenCheck className="w-6 h-6" />
                       </div>
                       <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {assignment.status === 'pending' ? 'Bekliyor' : 'Tamamlandı'}
                       </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{assignment.bookName}</h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">{assignment.testRange}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="bg-gray-50 p-2 rounded-lg text-center">
                          <div className="text-xs text-gray-500">Soru</div>
                          <div className="font-bold text-gray-900">{assignment.questionCount}</div>
                       </div>
                       <div className="bg-gray-50 p-2 rounded-lg text-center">
                          <div className="text-xs text-gray-500">Son Tarih</div>
                          <div className="font-bold text-gray-900">{assignment.dueDate.split('-').slice(1).join('/')}</div>
                       </div>
                    </div>

                    {assignment.status === 'pending' ? (
                       <Button onClick={() => setSelectedAssignment(assignment)} className="w-full gap-2 group-hover:bg-primary-700">
                          Sanal Optiği Aç <ChevronRight className="w-4 h-4" />
                       </Button>
                    ) : (
                       <div className="w-full py-2.5 text-center font-bold text-green-600 bg-green-50 rounded-lg flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Puan: {assignment.score}
                       </div>
                    )}
                 </div>
              </div>
           ))}
           {assignments.length === 0 && (
              <div className="col-span-full py-20 text-center">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <BookOpenCheck className="w-10 h-10" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">Henüz Ödev Yok</h3>
                 <p className="text-gray-500">Koçunuz tarafından atanan ödevler burada görünecektir.</p>
              </div>
           )}
        </div>
      )}

      {activeTab === 'videos' && <VideoLibrary />}

      {selectedAssignment && (
         <VirtualOpticalForm 
            assignment={selectedAssignment} 
            onClose={() => setSelectedAssignment(null)} 
            onSubmit={handleSubmitAssignment}
         />
      )}
    </div>
  );
};