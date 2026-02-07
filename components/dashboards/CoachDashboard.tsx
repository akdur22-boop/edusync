import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/mockApi';
import { getDashboardData } from '../../services/dashboardService';
import { Student, DashboardData, ReportCard, Result, Question, Book, Assignment, ProgramItem } from '../../types';
import { Button } from '../Button';
import { generateMonthlyReport } from '../../services/aiService';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  UserPlus, Search, ChevronRight, ArrowLeft, 
  User, Building2, Wand2, Loader2, CheckCircle2, 
  Wallet, Target, Layers, Plus, Trash2, CheckSquare, 
  AlignLeft, Save, X, FileQuestion, ChevronDown, Clock, Trophy,
  LayoutGrid, List, MoreHorizontal, Mail, Phone, Calendar, 
  TrendingUp, TrendingDown, AlertCircle, BookOpen, PenTool,
  Sparkles, CheckCircle, ArrowUpRight, ArrowDownRight, BookOpenCheck,
  Send, CalendarDays, ChevronLeft
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend
} from 'recharts';

// --- TYPES & UTILS ---

interface CoachDashboardProps {
  activeTab?: string;
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-xl text-xs z-50 relative">
        <p className="font-bold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          {data.amount !== undefined && (
             <p className="text-gray-600 flex justify-between gap-4">
                <span>Tutar:</span> <span className="font-mono font-medium">{data.amount.toLocaleString('tr-TR')} TL</span>
             </p>
          )}
          {data.accuracy !== undefined && (
             <p className="text-gray-600 flex justify-between gap-4">
                <span>Başarı:</span> <span className="font-mono font-medium">%{data.accuracy}</span>
             </p>
          )}
          {data.net !== undefined && (
             <div className="border-t pt-1 mt-1 flex justify-between gap-4 font-bold text-primary-600">
                <span>Net:</span> <span>{Number(data.net).toFixed(2)}</span>
             </div>
          )}
           {data.value !== undefined && !data.net && (
             <div className="border-t pt-1 mt-1 flex justify-between gap-4 font-bold text-primary-600">
                <span>Değer:</span> <span>{data.value}</span>
             </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// --- SUB-COMPONENTS ---

const AddStudentModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (s: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '', surname: '', email: '', phone: '',
    school: '', classGrade: '12', examGoal: 'TYT',
    parentName: '', parentPhone: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      name: `${formData.name} ${formData.surname}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
       <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
       <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
          <div className="hidden md:flex w-1/3 bg-slate-900 p-8 flex-col justify-between relative overflow-hidden text-white shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 -ml-16 -mb-16"></div>
              <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/10">
                    <UserPlus className="w-6 h-6 text-primary-400" />
                 </div>
                 <h2 className="text-3xl font-bold mb-3 leading-tight">Yeni Öğrenci<br/>Kaydı</h2>
                 <p className="text-slate-400 text-sm leading-relaxed">Sisteme yeni bir öğrenci ekleyerek koçluk sürecini başlatın.</p>
              </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0 bg-white">
             <div className="px-6 py-4 md:px-8 md:py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 z-20">
                <h3 className="text-lg font-bold text-gray-900">Yeni Öğrenci Ekle</h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <form id="add-student-form" onSubmit={handleSubmit} className="space-y-8">
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest flex items-center gap-2"><User className="w-4 h-4" /> Öğrenci Kimliği</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Ad</label>
                            <input required placeholder="Örn: Ahmet" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 placeholder:text-gray-400" onChange={e => setFormData({...formData, name: e.target.value})} />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Soyad</label>
                            <input required placeholder="Örn: Yılmaz" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 placeholder:text-gray-400" onChange={e => setFormData({...formData, surname: e.target.value})} />
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest flex items-center gap-2 pt-6 border-t border-gray-50">
                         <Building2 className="w-4 h-4" /> İletişim & Okul
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Telefon</label>
                            <input required type="tel" placeholder="5XX XXX XX XX" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 placeholder:text-gray-400" onChange={e => setFormData({...formData, phone: e.target.value})} />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Sınıf</label>
                            <div className="relative">
                               <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer text-gray-900" onChange={e => setFormData({...formData, classGrade: e.target.value})}>
                                  <option>12. Sınıf</option><option>11. Sınıf</option><option>10. Sınıf</option><option>Mezun</option>
                                </select>
                               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex justify-end pt-4">
                      <Button onClick={handleSubmit}>Kaydı Tamamla</Button>
                   </div>
                </form>
             </div>
          </div>
       </div>
    </div>
  );
};

const ProgramView = () => {
   const [selectedStudentId, setSelectedStudentId] = useState('');
   const [students, setStudents] = useState<Student[]>([]);
   const [books, setBooks] = useState<Book[]>([]);
   const [programItems, setProgramItems] = useState<ProgramItem[]>([]);
   const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

   // Add Item Modal
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [selectedDayDate, setSelectedDayDate] = useState('');
   const [newItem, setNewItem] = useState({
      subject: 'Matematik',
      topic: '',
      bookId: '',
      type: 'study' as 'study' | 'test' | 'rest',
      questionTarget: 0,
      time: ''
   });

   useEffect(() => {
      setStudents(api.getStudents());
      setBooks(api.getBooks());
      
      // Set to start of current week (Monday)
      const d = new Date();
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
      const monday = new Date(d.setDate(diff));
      setCurrentWeekStart(monday);
   }, []);

   useEffect(() => {
      if(selectedStudentId) {
         const program = api.getStudyProgram(selectedStudentId);
         setProgramItems(program.items);
      } else {
         setProgramItems([]);
      }
   }, [selectedStudentId]);

   const getWeekDays = () => {
      const days = [];
      const start = new Date(currentWeekStart);
      for(let i=0; i<7; i++) {
         const d = new Date(start);
         d.setDate(start.getDate() + i);
         days.push(d);
      }
      return days;
   };

   const weekDays = getWeekDays();

   const handleAddItem = (e: React.FormEvent) => {
      e.preventDefault();
      if(!selectedStudentId || !selectedDayDate) return;

      const book = books.find(b => b.id === newItem.bookId);
      
      const addedItem = api.addProgramItem(selectedStudentId, {
         date: selectedDayDate,
         subject: newItem.subject,
         topic: newItem.topic,
         bookId: book?.id,
         bookName: book?.title,
         type: newItem.type,
         questionTarget: newItem.questionTarget || undefined,
         time: newItem.time || undefined
      });

      setProgramItems([...programItems, addedItem]);
      setIsAddModalOpen(false);
      setNewItem({ subject: 'Matematik', topic: '', bookId: '', type: 'study', questionTarget: 0, time: '' });
   };

   const handleDeleteItem = (itemId: string) => {
      if(selectedStudentId) {
         api.deleteProgramItem(selectedStudentId, itemId);
         setProgramItems(programItems.filter(i => i.id !== itemId));
      }
   };

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tight">Haftalık Program</h2>
               <p className="text-gray-500 mt-1">Öğrenciye özel ders ve çalışma planlaması yapın.</p>
            </div>
         </div>

         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-64">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Öğrenci Seçiniz</label>
               <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
               >
                  <option value="">Seçiniz...</option>
                  {students.map(s => (
                     <option key={s.id} value={s.id}>{s.name} ({s.classGrade})</option>
                  ))}
               </select>
            </div>

            {selectedStudentId && (
               <div className="flex items-center gap-4 ml-auto">
                  <Button variant="secondary" onClick={() => {
                     const d = new Date(currentWeekStart);
                     d.setDate(d.getDate() - 7);
                     setCurrentWeekStart(d);
                  }}>
                     <ChevronLeft className="w-4 h-4" /> Önceki
                  </Button>
                  <span className="font-bold text-gray-900 w-32 text-center">
                     {weekDays[0].getDate()} {weekDays[0].toLocaleDateString('tr-TR', {month:'short'})} - {weekDays[6].getDate()} {weekDays[6].toLocaleDateString('tr-TR', {month:'short'})}
                  </span>
                  <Button variant="secondary" onClick={() => {
                     const d = new Date(currentWeekStart);
                     d.setDate(d.getDate() + 7);
                     setCurrentWeekStart(d);
                  }}>
                     Sonraki <ChevronRight className="w-4 h-4" />
                  </Button>
               </div>
            )}
         </div>

         {selectedStudentId ? (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
               {weekDays.map((day, i) => {
                  const dateStr = day.toISOString().split('T')[0];
                  // Sort items by time (if exists) or fallback to end
                  const dayItems = programItems
                     .filter(item => item.date === dateStr)
                     .sort((a, b) => (a.time || '23:59').localeCompare(b.time || '23:59'));

                  return (
                     <div key={i} className="flex flex-col gap-3">
                        <div className={`p-3 rounded-xl border text-center ${
                           dateStr === new Date().toISOString().split('T')[0] 
                              ? 'bg-primary-50 border-primary-200 text-primary-700' 
                              : 'bg-white border-gray-200 text-gray-700'
                        }`}>
                           <div className="text-xs font-bold uppercase opacity-60">{day.toLocaleDateString('tr-TR', {weekday: 'long'})}</div>
                           <div className="text-lg font-black">{day.getDate()}</div>
                        </div>

                        <div className="flex-1 space-y-2 min-h-[150px] bg-gray-50/50 rounded-xl p-2 border border-dashed border-gray-200">
                           {dayItems.map(item => (
                              <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-sm relative group">
                                 <button onClick={() => handleDeleteItem(item.id)} className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                 </button>
                                 <div className="flex items-center gap-1 mb-1">
                                    {item.time && (
                                       <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                                          <Clock className="w-3 h-3" /> {item.time}
                                       </span>
                                    )}
                                 </div>
                                 <div className="font-bold text-gray-900">{item.subject}</div>
                                 <div className="text-xs text-gray-600 mb-1">{item.topic}</div>
                                 {item.bookName && (
                                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit mb-1">
                                       <BookOpen className="w-3 h-3" /> {item.bookName.length > 15 ? item.bookName.substring(0,15)+'...' : item.bookName}
                                    </div>
                                 )}
                                 {item.type === 'test' && item.questionTarget && (
                                    <div className="text-[10px] font-bold text-orange-600">Hedef: {item.questionTarget} Soru</div>
                                 )}
                                 {item.isCompleted && (
                                    <div className="absolute bottom-1 right-1">
                                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </div>
                                 )}
                              </div>
                           ))}
                           <button 
                              onClick={() => { setSelectedDayDate(dateStr); setIsAddModalOpen(true); }}
                              className="w-full py-2 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:bg-white hover:border-primary-300 hover:text-primary-600 transition-colors text-xs font-bold flex items-center justify-center gap-1"
                           >
                              <Plus className="w-3 h-3" /> Ekle
                           </button>
                        </div>
                     </div>
                  );
               })}
            </div>
         ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-gray-900">Program Oluşturmak için Öğrenci Seçin</h3>
               <p className="text-gray-500">Yukarıdaki menüden bir öğrenci seçerek haftalık planlamaya başlayın.</p>
            </div>
         )}

         {/* Add Item Modal */}
         {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
               <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                  
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                  <div className="flex justify-between items-center mb-8 relative z-10">
                     <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Program Ekle</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                           {selectedDayDate 
                              ? new Date(selectedDayDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }) 
                              : 'Yeni Görev Planla'}
                        </p>
                     </div>
                     <button 
                        onClick={() => setIsAddModalOpen(false)}
                        className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                     >
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <form onSubmit={handleAddItem} className="space-y-5 relative z-10">
                     <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Ders</label>
                           <div className="relative">
                              <select 
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 font-bold transition-all appearance-none cursor-pointer" 
                                 value={newItem.subject} 
                                 onChange={e => setNewItem({...newItem, subject: e.target.value})}
                              >
                                 {['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Tarih', 'Coğrafya', 'Felsefe', 'Din', 'İngilizce'].map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Saat</label>
                           <div className="relative">
                              <input 
                                 type="time" 
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 font-bold transition-all" 
                                 value={newItem.time} 
                                 onChange={e => setNewItem({...newItem, time: e.target.value})} 
                              />
                              <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Konu</label>
                        <input 
                           type="text" 
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 font-bold placeholder:text-gray-400 transition-all" 
                           placeholder="Örn: Türev, Gazlar..." 
                           value={newItem.topic} 
                           onChange={e => setNewItem({...newItem, topic: e.target.value})} 
                           required 
                        />
                     </div>
                     
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Kaynak Kitap (Opsiyonel)</label>
                        <div className="relative">
                           <select 
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 font-medium transition-all appearance-none cursor-pointer" 
                              value={newItem.bookId} 
                              onChange={e => setNewItem({...newItem, bookId: e.target.value})}
                           >
                              <option value="">Kitap Seçilmedi</option>
                              {books.filter(b => b.subject === newItem.subject).map(b => (
                                 <option key={b.id} value={b.id}>{b.title} ({b.publisher})</option>
                              ))}
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Tür</label>
                           <div className="relative">
                              <select 
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 font-medium transition-all appearance-none cursor-pointer" 
                                 value={newItem.type} 
                                 onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                              >
                                 <option value="study">Konu Çalışma</option>
                                 <option value="test">Soru Çözümü</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                           </div>
                        </div>
                        {newItem.type === 'test' && (
                           <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Soru Hedefi</label>
                              <input 
                                 type="number" 
                                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 font-bold placeholder:text-gray-400 transition-all" 
                                 value={newItem.questionTarget} 
                                 onChange={e => setNewItem({...newItem, questionTarget: Number(e.target.value)})} 
                              />
                           </div>
                        )}
                     </div>
                     
                     <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full shadow-xl shadow-primary-600/20 py-4 text-lg">
                           Programı Kaydet
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
};

const AssignmentsView = () => {
   const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
   const [students, setStudents] = useState<Student[]>([]);
   const [books, setBooks] = useState<Book[]>([]);
   
   // Form State
   const [selectedStudentId, setSelectedStudentId] = useState('');
   const [selectedBookId, setSelectedBookId] = useState('');
   const [testRange, setTestRange] = useState('');
   const [questionCount, setQuestionCount] = useState(10);
   const [dueDate, setDueDate] = useState('');

   useEffect(() => {
      setActiveAssignments(api.getAssignments());
      setStudents(api.getStudents());
      setBooks(api.getBooks());
   }, []);

   const handleCreateAssignment = (e: React.FormEvent) => {
      e.preventDefault();
      if(!selectedStudentId || !selectedBookId || !testRange || !dueDate) {
         alert("Lütfen tüm alanları doldurunuz.");
         return;
      }
      
      const student = students.find(s => s.id === selectedStudentId);
      const book = books.find(b => b.id === selectedBookId);

      if(student && book) {
         const newAssign = api.createAssignment({
            studentId: student.id,
            studentName: student.name,
            bookId: book.id,
            bookName: book.title,
            testRange,
            questionCount,
            dueDate
         });
         setActiveAssignments([newAssign, ...activeAssignments]);
         
         // Reset
         setTestRange('');
         setDueDate('');
      }
   };

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ödev Yönetimi</h2>
               <p className="text-gray-500 mt-1">Öğrencilere tanımlı kitaplardan ödev verin ve takibini yapın.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Assignment Form */}
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <BookOpenCheck className="w-5 h-5 text-primary-600" /> Yeni Ödev Ata
                  </h3>
                  <form onSubmit={handleCreateAssignment} className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Öğrenci</label>
                        <select 
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                           value={selectedStudentId}
                           onChange={e => setSelectedStudentId(e.target.value)}
                        >
                           <option value="">Seçiniz...</option>
                           {students.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.classGrade})</option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Kitap</label>
                        <select 
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                           value={selectedBookId}
                           onChange={e => setSelectedBookId(e.target.value)}
                        >
                           <option value="">Seçiniz...</option>
                           {books.map(b => (
                              <option key={b.id} value={b.id}>{b.title} - {b.publisher}</option>
                           ))}
                        </select>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Test / Sayfa Aralığı</label>
                        <input 
                           type="text" 
                           placeholder="Örn: Test 5 veya Sayfa 40-42" 
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 placeholder:text-gray-400"
                           value={testRange}
                           onChange={e => setTestRange(e.target.value)}
                        />
                     </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Soru Sayısı</label>
                        <input 
                           type="number"
                           min="1"
                           max="100"
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 placeholder:text-gray-400"
                           value={questionCount}
                           onChange={e => setQuestionCount(Number(e.target.value))}
                        />
                     </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Son Tarih</label>
                        <input 
                           type="date" 
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900"
                           value={dueDate}
                           onChange={e => setDueDate(e.target.value)}
                        />
                     </div>

                     <Button type="submit" className="w-full mt-2 gap-2"><Send className="w-4 h-4" /> Ödevi Gönder</Button>
                  </form>
               </div>
            </div>

            {/* Assignment List */}
            <div className="lg:col-span-8 space-y-6">
               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                     <h3 className="font-bold text-gray-900">Atanan Ödevler</h3>
                     <span className="text-sm text-gray-500">{activeAssignments.length} Ödev</span>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                           <tr>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Öğrenci</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Kitap / Test</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Son Tarih</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durum</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Puan</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {activeAssignments.map(a => (
                              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                 <td className="px-6 py-4 text-sm font-bold text-gray-900">{a.studentName}</td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{a.bookName}</div>
                                    <div className="text-xs text-gray-500">{a.testRange} ({a.questionCount} Soru)</div>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1.5">
                                       <Calendar className="w-3.5 h-3.5" /> {a.dueDate.split('-').reverse().join('.')}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                       a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                       {a.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-center font-bold text-gray-900">
                                    {a.score ? a.score : '-'}
                                 </td>
                              </tr>
                           ))}
                           {activeAssignments.length === 0 && (
                              <tr>
                                 <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Henüz ödev atanmamış.</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

const StudentDetailView = ({ student, onBack }: { student: Student, onBack: () => void }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [report, setReport] = useState<ReportCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = api.getResults(student.id);
    setResults(data);
    setReport(generateMonthlyReport(data));
    setLoading(false);
  }, [student.id]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="secondary" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Geri
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
          <p className="text-sm text-gray-500">{student.classGrade} • {student.studentNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 mb-4">
                  {student.name.charAt(0)}
               </div>
               <div className="font-bold text-lg text-gray-900">{student.examGoal} Hedefi</div>
               <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {student.status === 'active' ? 'Aktif Öğrenci' : 'Pasif Durumda'}
               </div>
            </div>
            <div className="space-y-3 text-sm">
               <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500">Kayıt Tarihi</span>
                  <span className="font-bold text-gray-900">{student.paymentInfo?.registrationDate || '-'}</span>
               </div>
               <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500">Veli</span>
                  <span className="font-bold text-gray-900">{student.parentName || '-'}</span>
               </div>
               <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-500">Telefon</span>
                  <span className="font-bold text-gray-900">{student.parentPhone || '-'}</span>
               </div>
            </div>
         </div>

         <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                  <h4 className="text-gray-500 font-bold text-xs uppercase mb-2">Genel Başarı</h4>
                  <div className="text-4xl font-black text-primary-600 mb-1">
                     %{report?.averageAccuracy || 0}
                  </div>
                  <div className="text-sm text-gray-400">Son 30 gün ortalaması</div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                  <h4 className="text-gray-500 font-bold text-xs uppercase mb-2">Çözülen Soru</h4>
                  <div className="text-4xl font-black text-blue-600 mb-1">
                     {report?.totalQuestions || 0}
                  </div>
                  <div className="text-sm text-gray-400">Bu ay toplamı</div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Son Deneme Sonuçları</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 font-bold text-gray-500">Tarih</th>
                           <th className="px-6 py-3 font-bold text-gray-500">Ders</th>
                           <th className="px-6 py-3 font-bold text-gray-500">Konu</th>
                           <th className="px-6 py-3 font-bold text-gray-500">Net</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {results.slice(0, 5).map(r => (
                           <tr key={r.id}>
                              <td className="px-6 py-3 text-gray-600">{r.date}</td>
                              <td className="px-6 py-3 font-medium text-gray-900">{r.lesson}</td>
                              <td className="px-6 py-3 text-gray-500">{r.topic}</td>
                              <td className="px-6 py-3 font-bold text-primary-600">{(r.correct - r.incorrect * 0.25).toFixed(2)}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const MockExamView = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">Deneme Sınavları</h2>
                 <p className="text-gray-500 mt-1">Kurumsal deneme sınavlarını planlayın ve sonuçlarını girin.</p>
              </div>
              <Button className="gap-2">
                 <FileQuestion className="w-4 h-4" /> Yeni Deneme Oluştur
              </Button>
           </div>
           
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                 <FileQuestion className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Deneme Oluşturulmadı</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                 Öğrencileriniz için TYT, AYT veya LGS formatında deneme sınavları oluşturabilir, optik form basabilir ve sonuçları buradan okutabilirsiniz.
              </p>
              <Button variant="outline">Örnek Şablon İndir</Button>
           </div>
        </div>
    );
};

// --- MAIN COACH DASHBOARD ---
export const CoachDashboard: React.FC<CoachDashboardProps> = ({ activeTab = 'overview' }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentViewMode, setStudentViewMode] = useState<'grid' | 'list'>('grid');
  const [spotlightTab, setSpotlightTab] = useState<'rising' | 'falling'>('rising');
  
  useEffect(() => {
    const d = getDashboardData();
    setData(d);
  }, []);

  useEffect(() => {
    setSelectedStudent(null);
  }, [activeTab]);

  if (selectedStudent) return <StudentDetailView student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  if (!data) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

  return (
    <div className="h-full">
      {activeTab === 'overview' && (
         <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Genel Bakış</h2>
                  <p className="text-gray-500 mt-1">Hoş geldiniz, bugün kurumunuzda işler yolunda görünüyor.</p>
               </div>
               <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-600 flex items-center gap-2">
                     <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString('tr-TR', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <Button className="h-9 text-sm" onClick={() => setIsAddModalOpen(true)}>+ Hızlı Ekle</Button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Modern KPI Cards */}
               {[
                  { label: "Aktif Öğrenci", val: data.stats.activeStudents7Days, icon: UserPlus, color: "text-primary-600", bg: "bg-primary-50", trend: "+2", trendUp: true },
                  { label: "Haftalık Soru", val: data.stats.weeklyQuestions.toLocaleString(), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%", trendUp: true },
                  { label: "Ort. Başarı", val: "%" + data.stats.avgAccuracy, icon: Target, color: "text-purple-600", bg: "bg-purple-50", trend: "-1.5%", trendUp: false },
                  { label: "Bekleyen Tahsilat", val: data.stats.pendingPayments, icon: Wallet, color: "text-orange-600", bg: "bg-orange-50", sub: "Kişi", trend: "Normal", trendUp: true },
               ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                     <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                           <stat.icon className="w-6 h-6" />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                           {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {stat.trend}
                        </div>
                     </div>
                     <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.val} <span className="text-lg text-gray-400 font-medium">{stat.sub}</span></h3>
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Main Chart */}
               <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-gray-900 text-lg">Kurum Başarı Trendi</h3>
                     <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary-500"></span> <span className="text-xs text-gray-500 font-medium">Net Ortalaması</span>
                     </div>
                  </div>
                  <div className="h-[320px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                           <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                           <Tooltip content={<CustomTooltip />} />
                           <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} fill="url(#colorNet)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
               
               {/* Focus Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                         <AlertCircle className="w-5 h-5 text-orange-500" /> İlgi Bekleyenler
                      </h3>
                      <div className="space-y-3">
                         {data.actions.length === 0 ? <p className="text-gray-500 text-sm">Harika! Her şey yolunda.</p> : data.actions.slice(0, 4).map(a => (
                            <div key={a.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all cursor-pointer group" onClick={() => {
                               const s = api.getStudentById(a.studentId);
                               if(s) setSelectedStudent(s);
                            }}>
                               <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{a.type === 'payment_due' ? 'Ödeme' : 'Akademik'}</span>
                                  <span className="text-[10px] text-gray-400">{a.date.split('-').slice(1).join('/')}</span>
                               </div>
                               <div className="font-bold text-gray-900 text-sm mb-0.5">{a.studentName}</div>
                               <div className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-700">{a.message}</div>
                            </div>
                         ))}
                      </div>
                      <Button variant="ghost" className="w-full mt-4 text-xs text-gray-500 hover:text-gray-900">Tümünü Gör</Button>
                  </div>
               </div>
            </div>

            {/* 1. AI Summary Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
               <div className="relative z-10 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-3 text-indigo-700 font-bold">
                        <Sparkles className="w-5 h-5" /> Haftalık Yapay Zeka Özeti
                     </div>
                     <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                        {data.aiSummary.insight} Genel motivasyonda artış gözleniyor ancak sayısal branşlardaki boş bırakma oranları hala kritik seviyede.
                     </p>
                  </div>
                  <div className="md:w-px md:bg-indigo-200"></div>
                  <div className="flex-1">
                     <h4 className="font-bold text-gray-900 mb-3 text-sm">Önerilen Aksiyonlar</h4>
                     <ul className="space-y-2">
                        {data.aiSummary.checklist.map((item, idx) => (
                           <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>

            {/* 2. Bottom Grid: Subject Analysis & Spotlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               {/* Subject Performance Card */}
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <BookOpen className="w-5 h-5 text-gray-400" /> Branş Bazlı Performans
                  </h3>
                  <div className="space-y-5">
                     {data.subjectStatuses.map((subject, idx) => (
                        <div key={idx}>
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-bold text-gray-700">{subject.subject}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                 subject.status === 'strong' ? 'bg-green-100 text-green-700' : 
                                 subject.status === 'risky' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                              }`}>%{subject.score}</span>
                           </div>
                           <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                 className={`h-full rounded-full ${
                                    subject.status === 'strong' ? 'bg-green-500' : 
                                    subject.status === 'risky' ? 'bg-red-500' : 'bg-blue-500'
                                 }`} 
                                 style={{ width: `${subject.score}%` }}
                              ></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Student Spotlights Card */}
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> Öne Çıkanlar
                     </h3>
                     <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold">
                        <button 
                           onClick={() => setSpotlightTab('rising')}
                           className={`px-3 py-1.5 rounded-md transition-all ${spotlightTab === 'rising' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                        >
                           Yükselenler
                        </button>
                        <button 
                           onClick={() => setSpotlightTab('falling')}
                           className={`px-3 py-1.5 rounded-md transition-all ${spotlightTab === 'falling' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                        >
                           Düşenler
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 space-y-3">
                     {(spotlightTab === 'rising' ? data.spotlights.risers : data.spotlights.fallers).map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
                           const s = api.getStudentById(student.id);
                           if(s) setSelectedStudent(s);
                        }}>
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${student.avatarColor}`}>
                                 {student.name.charAt(0)}
                              </div>
                              <div>
                                 <div className="font-bold text-gray-900 text-sm">{student.name}</div>
                                 <div className="text-xs text-gray-400">12. Sınıf</div>
                              </div>
                           </div>
                           <div className={`font-black text-sm flex items-center gap-1 ${spotlightTab === 'rising' ? 'text-green-600' : 'text-red-600'}`}>
                              {spotlightTab === 'rising' ? '+' : ''}{student.change} Net
                              {spotlightTab === 'rising' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               {/* Quick Activity Feed (Mock) */}
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <Clock className="w-5 h-5 text-gray-400" /> Son Aktiviteler
                  </h3>
                  <div className="space-y-0 relative">
                     {/* Vertical Line */}
                     <div className="absolute left-3.5 top-2 bottom-4 w-0.5 bg-gray-100"></div>
                     
                     {[
                        { time: '10 dk önce', msg: 'Ahmet Yılmaz TYT Denemesi girdi.', type: 'exam' },
                        { time: '45 dk önce', msg: 'Zeynep Kaya ödemesi alındı.', type: 'payment' },
                        { time: '2 saat önce', msg: 'Mehmet Hoca yeni ödev atadı.', type: 'homework' },
                        { time: '5 saat önce', msg: 'Sistem otomatik raporları oluşturdu.', type: 'system' },
                     ].map((activity, i) => (
                        <div key={i} className="flex gap-4 relative pb-6 last:pb-0">
                           <div className={`w-7 h-7 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 z-10 ${
                              activity.type === 'exam' ? 'bg-blue-100 text-blue-600' :
                              activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                              activity.type === 'homework' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                           }`}>
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-800">{activity.msg}</p>
                              <span className="text-xs text-gray-400">{activity.time}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>
         </div>
      )}
      
      {activeTab === 'students' && (
         <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
               <div>
                  <h2 className="text-2xl font-black text-gray-900">Öğrenci Portföyü</h2>
                  <p className="text-sm text-gray-500 font-medium">{api.getStudents().length} kayıtlı öğrenci listeleniyor.</p>
               </div>
               <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input placeholder="İsimle ara..." className="pl-10 pr-4 py-2.5 w-full md:w-64 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium text-gray-900 placeholder:text-gray-400" />
                  </div>
                  <div className="flex bg-white p-1 rounded-lg border border-gray-200 shrink-0">
                     <button onClick={() => setStudentViewMode('grid')} className={`p-2 rounded-md transition-colors ${studentViewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}><LayoutGrid className="w-4 h-4"/></button>
                     <button onClick={() => setStudentViewMode('list')} className={`p-2 rounded-md transition-colors ${studentViewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}><List className="w-4 h-4"/></button>
                  </div>
                  <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shrink-0 h-10"><UserPlus className="w-4 h-4" /> <span className="hidden sm:inline">Yeni Ekle</span></Button>
               </div>
            </div>

            {studentViewMode === 'grid' ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {api.getStudents().map(s => (
                     <div key={s.id} onClick={() => setSelectedStudent(s)} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-primary-50 rounded-bl-full -mr-4 -mt-4 z-0 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10 flex items-start justify-between mb-6">
                           <div className="w-14 h-14 rounded-2xl bg-gray-100 border-2 border-white shadow-md flex items-center justify-center text-xl font-bold text-gray-600">
                              {s.name.charAt(0)}
                           </div>
                           <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {s.status === 'active' ? 'Aktif' : 'Pasif'}
                           </span>
                        </div>
                        
                        <div className="relative z-10 mb-6">
                           <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{s.name}</h3>
                           <p className="text-sm text-gray-500 font-medium">{s.classGrade} • {s.examGoal}</p>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-2 mb-4">
                           <div className="bg-gray-50 p-2 rounded-xl text-center">
                              <div className="text-[10px] font-bold text-gray-400 uppercase">Ort. Net</div>
                              <div className="font-black text-gray-900 text-lg">45.2</div>
                           </div>
                           <div className="bg-gray-50 p-2 rounded-xl text-center">
                              <div className="text-[10px] font-bold text-gray-400 uppercase">Sıralama</div>
                              <div className="font-black text-gray-900 text-lg">#12</div>
                           </div>
                        </div>

                        <div className="relative z-10 flex gap-2">
                           <button className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-primary-600 transition-colors">Profili Gör</button>
                           <button className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"><Mail className="w-4 h-4" /></button>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Öğrenci</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Hedef / Sınıf</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durum</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Son Aktivite</th>
                           <th className="px-6 py-4"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {api.getStudents().map(s => (
                           <tr key={s.id} onClick={() => setSelectedStudent(s)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600">{s.name.charAt(0)}</div>
                                    <span className="font-bold text-gray-900 text-sm">{s.name}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-600">{s.classGrade} <span className="text-gray-300 mx-2">|</span> {s.examGoal}</td>
                              <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.status === 'active' ? 'Aktif' : 'Pasif'}</span></td>
                              <td className="px-6 py-4 text-sm text-gray-500 font-medium">2 gün önce</td>
                              <td className="px-6 py-4 text-right"><ChevronRight className="w-5 h-5 text-gray-400" /></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}
            
            {isAddModalOpen && <AddStudentModal onClose={() => setIsAddModalOpen(false)} onAdd={(d) => { api.addStudent(d); setData(getDashboardData()); }} />}
         </div>
      )}

      {activeTab === 'program' && <ProgramView />}
      
      {activeTab === 'assignments' && <AssignmentsView />}

      {activeTab === 'mock-exams' && <MockExamView />}
      
      {activeTab === 'finance' && (
         <div className="space-y-8 animate-in fade-in duration-500">
            {/* Same Finance View as before, just ensuring it renders */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-1">Ciro (Aylık)</p>
                  <h3 className="text-3xl font-black text-gray-900">{data.finance.monthlyRevenue.toLocaleString()} TL</h3>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-1">Toplam (Yıllık)</p>
                  <h3 className="text-3xl font-black text-gray-900">{data.finance.totalRevenueYear.toLocaleString()} TL</h3>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-1">Bekleyen</p>
                  <h3 className="text-3xl font-black text-orange-600">{data.finance.pendingAmount.toLocaleString()} TL</h3>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-1">Gecikmiş</p>
                  <h3 className="text-3xl font-black text-red-600">{data.finance.overdueAmount.toLocaleString()} TL</h3>
               </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-6">Gelir Akışı</h3>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={data.finance.revenueHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} />
                        <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'profile' && <div className="p-10 text-center text-gray-500">Profil ayarları yakında.</div>}
      {activeTab === 'settings' && <div className="p-10 text-center text-gray-500">Sistem ayarları yakında.</div>}
    </div>
  );
};

export default CoachDashboard;