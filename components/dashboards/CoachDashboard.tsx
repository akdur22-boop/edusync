import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/mockApi';
import { getDashboardData } from '../../services/dashboardService';
import { Student, DashboardData, ReportCard, Result, Question } from '../../types';
import { Button } from '../Button';
import { generateMonthlyReport } from '../../services/aiService';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  UserPlus, Search, ChevronRight, ArrowLeft, 
  User, Building2, Wand2, Loader2, CheckCircle2, 
  Wallet, Target, Layers, Plus, Trash2, CheckSquare, 
  AlignLeft, Save, X, FileQuestion, ChevronDown, Clock, Trophy
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
                <span>Net:</span> <span>{data.net.toFixed(2)}</span>
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

const StudentDetailView = ({ student, onBack }: { student: Student, onBack: () => void }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [report, setReport] = useState<ReportCard | null>(null);

  useEffect(() => {
     const data = api.getResults(student.id);
     setResults(data);
     const rep = generateMonthlyReport(data);
     setReport(rep);
  }, [student]);

  return (
     <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
        <div className="flex items-center gap-4 mb-6">
           <button onClick={onBack} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
           </button>
           <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
              <div className="flex gap-3 text-sm text-gray-500">
                 <span>{student.classGrade}</span>
                 <span>•</span>
                 <span>{student.studentNumber}</span>
              </div>
           </div>
        </div>
        
        {report ? (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-6">Ders Bazlı Performans</h3>
                     <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={report.lessonBreakdown} layout="vertical" margin={{left: 40}}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                              <XAxis type="number" domain={[0, 100]} hide />
                              <YAxis dataKey="lesson" type="category" axisLine={false} tickLine={false} width={100} tick={{fontSize: 12, fontWeight: 600}} />
                              <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                              <Bar dataKey="accuracy" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24}>
                                 {report.lessonBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#10b981' : entry.accuracy < 50 ? '#ef4444' : '#f59e0b'} />
                                 ))}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> Güçlü Konular
                     </h3>
                     <div className="space-y-3">
                        {report.topicBreakdown.strongest.map((t, i) => (
                           <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-100">
                              <div className="font-bold text-gray-900 text-sm">{t.topic}</div>
                              <div className="text-xs text-green-600 font-medium">{t.lesson} • %{t.accuracy} Başarı</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
           </div>
        ) : <div className="p-10 text-center text-gray-500">Veri yok.</div>}
     </div>
  );
};

// --- MOCK EXAM VIEW (AI UPDATED) ---
const MockExamView = () => {
   const [examTitle, setExamTitle] = useState('');
   const [examType, setExamType] = useState('TYT');
   const [subject, setSubject] = useState('Matematik');
   
   const [tempQuestions, setTempQuestions] = useState<Question[]>([]);
   const [examQuestions, setExamQuestions] = useState<Question[]>([]);
   
   const [qType, setQType] = useState<'multiple_choice' | 'classic'>('multiple_choice');
   const [qText, setQText] = useState('');
   const [options, setOptions] = useState<string[]>(['', '', '', '', '']); 
   const [answer, setAnswer] = useState('');
   const [points, setPoints] = useState(5);

   // AI Generation State
   const [aiTopic, setAiTopic] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);

   const subjects = useMemo(() => {
      if (examType === 'LGS') {
         return ['Türkçe', 'Matematik', 'Fen Bilimleri', 'T.C. İnkılap Tarihi', 'Din Kültürü', 'İngilizce'];
      }
      return ['Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Edebiyat', 'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü'];
   }, [examType]);

   useEffect(() => {
      setSubject(subjects[0]);
   }, [examType, subjects]);

   const handleAddTemp = () => {
      if (tempQuestions.length >= 5) {
         alert("Anlık olarak en fazla 5 soru ekleyebilirsiniz.");
         return;
      }
      const remainingTotal = 20 - examQuestions.length;
      if (tempQuestions.length >= remainingTotal) {
         alert(`Limit aşılıyor. Sadece ${remainingTotal} soru daha ekleyebilirsiniz.`);
         return;
      }

      const newQ: Question = {
         id: Math.random().toString(36).substr(2, 9),
         text: qText,
         type: qType,
         points: points,
         options: qType === 'multiple_choice' ? options : undefined,
         answer: qType === 'multiple_choice' ? answer : undefined
      };

      setTempQuestions([...tempQuestions, newQ]);
      setQText('');
      setOptions(['', '', '', '', '']);
      setAnswer('');
   };

   const handleCommit = () => {
      if (examQuestions.length + tempQuestions.length > 20) {
         alert("Toplam 20 soru limitini aşıyorsunuz!");
         return;
      }
      setExamQuestions([...examQuestions, ...tempQuestions]);
      setTempQuestions([]);
   };

   const generateQuestionWithAI = async () => {
      if (!aiTopic) {
         alert("Lütfen bir konu başlığı giriniz.");
         return;
      }
      setIsGenerating(true);
      try {
         const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
         
         const prompt = `
         Sen Türkiye'deki sınav sistemine (MEB müfredatı, ÖSYM formatı) hakim uzman bir soru yazarısın.
         Aşağıdaki kriterlere göre **YENİ NESİL (BECERİ TEMELLİ)** bir soru hazırla:

         **Sınav Türü:** ${examType}
         **Ders:** ${subject}
         **Konu:** ${aiTopic}

         **Soru Yazım Kuralları (Kesinlikle Uygula):**
         1. **Yeni Nesil Formatı:** Soru asla sadece bilgi/ezber sormamalı. Bir kurgu, günlük hayat senaryosu, deney düzeneği veya görsel yorumlama içermelidir.
         2. **Metin Yapısı:** Soru metni, öğrencinin analiz etmesi gereken bir giriş parçası (hikaye/durum) ile başlamalıdır.
         3. **${subject === 'Matematik' || subject === 'Geometri' || subject === 'Fizik' ? 'Sayısal Kurgu:' : 'Sözel Kurgu:'}** 
            ${subject === 'Matematik' || subject === 'Geometri' || subject === 'Fizik' 
               ? 'Formülü doğrudan sorma. Bir problem durumu yarat (örneğin: market alışverişi, araç hızı, bir yapının mimarisi vb.) ve öğrencinin bu durumu matematiksel modele dökmesini iste.' 
               : 'Uzun bir paragraf, diyalog veya tarihsel bir anekdot vererek çıkarım yapılmasını iste.'}
         4. **Zorluk:** Orta-Zor seviye, düşündürücü.
         5. **Dil:** Akademik ve anlaşılır Türkçe.

         Çıktıyı SADECE aşağıdaki JSON formatında ver, başka hiçbir metin ekleme:
         {
            "questionText": "Buraya kurgusal senaryo ve soru kökünü bir bütün olarak yaz (paragrafları \\n ile ayır).",
            "options": ["A şıkkı (Mantıklı çeldirici)", "B şıkkı", "C şıkkı", "D şıkkı", "E şıkkı"],
            "correctOptionIndex": 0 (0=A, 1=B, etc.)
         }`;

         const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
               responseMimeType: "application/json",
               responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                     questionText: { type: Type.STRING },
                     options: { type: Type.ARRAY, items: { type: Type.STRING } },
                     correctOptionIndex: { type: Type.INTEGER }
                  }
               }
            }
         });

         let text = response.text || '{}';
         // Clean potential markdown code blocks if AI returns them despite config
         text = text.replace(/```json/g, '').replace(/```/g, '').trim();

         const json = JSON.parse(text);
         if (json.questionText) {
            setQText(json.questionText);
            
            let newOptions = [...json.options];
            while (newOptions.length < 5) newOptions.push("");
            newOptions = newOptions.slice(0, 5);
            setOptions(newOptions);

            const mapIndexToChar = ['A', 'B', 'C', 'D', 'E'];
            setAnswer(mapIndexToChar[json.correctOptionIndex] || 'A');
            setQType('multiple_choice');
         }

      } catch (error) {
         console.error("AI Generation Error:", error);
         alert("Soru oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
         setIsGenerating(false);
      }
   };

   return (
      <div className="animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
         
         <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8 border-b border-gray-100 pb-6">
            <div>
               <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Deneme Sınavı Oluşturucu</h2>
               <p className="text-gray-500 font-medium">Öğrencileriniz için özel, yeni nesil sorularla sınavlar hazırlayın.</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
               <div className="text-right px-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Soru Kotası</div>
                  <div className={`font-black text-xl ${examQuestions.length >= 20 ? 'text-red-500' : 'text-gray-900'}`}>
                     {examQuestions.length}<span className="text-gray-300 text-lg">/20</span>
                  </div>
               </div>
               <div className="h-10 w-10 relative">
                   <svg className="w-full h-full transform -rotate-90">
                       <circle cx="20" cy="20" r="16" stroke="#f3f4f6" strokeWidth="4" fill="transparent" />
                       <circle cx="20" cy="20" r="16" stroke={examQuestions.length >= 20 ? '#ef4444' : '#10b981'} strokeWidth="4" fill="transparent" 
                               strokeDasharray={100} strokeDashoffset={100 - (examQuestions.length * 100 / 20)} />
                   </svg>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                        <Layers className="w-5 h-5" />
                     </div>
                     <h3 className="font-bold text-gray-900">Sınav Detayları</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                     <div className="md:col-span-12 space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Deneme Başlığı</label>
                        <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 placeholder:text-gray-400" placeholder="Örn: TYT Matematik Karma" value={examTitle} onChange={e => setExamTitle(e.target.value)} />
                     </div>
                     <div className="md:col-span-6 space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Sınav Türü</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900" value={examType} onChange={e => setExamType(e.target.value)}>
                           <option value="TYT">TYT</option><option value="AYT">AYT</option><option value="LGS">LGS</option>
                        </select>
                     </div>
                     <div className="md:col-span-6 space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Branş</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900" value={subject} onChange={e => setSubject(e.target.value)}>
                           {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                     <div className="flex items-center gap-2">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                           <Plus className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">Soru Oluşturucu</h3>
                     </div>
                     
                     <div className="bg-gray-200/50 p-1 rounded-xl flex items-center relative">
                        <button onClick={() => setQType('multiple_choice')} className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${qType === 'multiple_choice' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Test</button>
                        <button onClick={() => setQType('classic')} className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${qType === 'classic' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Klasik</button>
                     </div>
                  </div>

                  <div className="p-6 space-y-6">
                     <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                           <div className="bg-white p-1.5 rounded-lg shadow-sm">
                              <Wand2 className="w-4 h-4 text-purple-600" />
                           </div>
                           <span className="text-sm font-bold text-purple-900">AI Soru Asistanı (Yeni Nesil)</span>
                        </div>
                        <div className="flex gap-2">
                           <input 
                              className="flex-1 px-4 py-2 bg-white border border-purple-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-900 placeholder:text-gray-400"
                              placeholder="Konu giriniz (Örn: Türev, Basınç, I. Dünya Savaşı)"
                              value={aiTopic}
                              onChange={(e) => setAiTopic(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && generateQuestionWithAI()}
                           />
                           <Button onClick={generateQuestionWithAI} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap">
                              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Oluştur'}
                           </Button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Soru Metni</label>
                        <textarea 
                           className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl min-h-[120px] outline-none resize-y focus:border-primary-500 text-gray-900 placeholder:text-gray-400" 
                           placeholder="Soru metni..."
                           value={qText}
                           onChange={e => setQText(e.target.value)}
                        />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8">
                           {qType === 'multiple_choice' ? (
                              <div className="space-y-3">
                                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Şıklar</p>
                                 <div className="space-y-2">
                                    {['A', 'B', 'C', 'D', 'E'].map((opt, i) => (
                                       <div key={opt} className={`flex items-center gap-3 p-1.5 rounded-xl border transition-all ${answer === opt ? 'bg-green-50 border-green-200' : 'bg-white border-transparent'}`}>
                                          <div 
                                             onClick={() => setAnswer(opt)}
                                             className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${answer === opt ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                          >
                                             {opt}
                                          </div>
                                          <input 
                                             className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 placeholder:text-gray-400"
                                             placeholder={`Seçenek ${opt}...`}
                                             value={options[i]}
                                             onChange={e => {
                                                const newOpts = [...options];
                                                newOpts[i] = e.target.value;
                                                setOptions(newOpts);
                                             }}
                                          />
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           ) : (
                              <div className="h-full flex flex-col justify-center items-center bg-orange-50/50 rounded-2xl border border-orange-100 p-6 text-center">
                                 <AlignLeft className="w-6 h-6 text-orange-600 mb-2" />
                                 <h4 className="text-sm font-bold text-orange-900">Klasik Mod</h4>
                              </div>
                           )}
                        </div>

                        <div className="md:col-span-4 flex flex-col gap-4">
                           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block text-center">Puan</label>
                              <div className="flex items-center justify-center gap-2">
                                 <button onClick={() => setPoints(Math.max(1, points-1))} className="w-8 h-8 bg-white border border-gray-200 rounded-lg text-gray-900">-</button>
                                 <input type="number" className="w-16 bg-transparent text-center font-black text-2xl outline-none text-gray-900" value={points} onChange={e => setPoints(Number(e.target.value))} />
                                 <button onClick={() => setPoints(points+1)} className="w-8 h-8 bg-white border border-gray-200 rounded-lg text-gray-900">+</button>
                              </div>
                           </div>
                           <Button onClick={handleAddTemp} disabled={tempQuestions.length >= 5 || !qText} className="flex-1 w-full justify-center">Ekle</Button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
               <div className={`transition-all duration-500 ${tempQuestions.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                  <div className="bg-amber-50 rounded-3xl p-1 border-2 border-amber-100/50 shadow-xl relative overflow-hidden">
                      <div className="bg-white/40 backdrop-blur-md rounded-[20px] p-5">
                         <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-amber-900 font-bold"><Clock className="w-5 h-5" /> Taslak</div>
                            <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold">{tempQuestions.length}/5</span>
                         </div>
                         <div className="space-y-2 mb-4">
                            {tempQuestions.map((q, i) => (
                               <div key={q.id} className="bg-white p-3 rounded-xl border border-amber-100 flex justify-between items-center">
                                  <div className="truncate text-sm font-medium max-w-[200px] text-gray-900">{q.text}</div>
                                  <button onClick={() => setTempQuestions(tempQuestions.filter(t => t.id !== q.id))}><Trash2 className="w-4 h-4 text-red-400" /></button>
                               </div>
                            ))}
                         </div>
                         <Button onClick={handleCommit} className="w-full bg-amber-500 hover:bg-amber-600 text-white">Listeye Aktar</Button>
                      </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col flex-1 min-h-[500px]">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                     <h3 className="font-bold text-gray-900 flex items-center gap-2"><CheckSquare className="w-5 h-5" /> Sorular</h3>
                     <p className="text-xs text-gray-400 font-medium">Toplam: {examQuestions.reduce((a, q) => a + q.points, 0)}p</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                     {examQuestions.map((q, i) => (
                        <div key={q.id} className="p-4 border border-gray-100 rounded-2xl bg-white hover:shadow-md transition-all relative group">
                           <div className="flex justify-between mb-2">
                              <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md">#{i+1}</span>
                              <span className="text-xs font-bold text-gray-400">{q.points}p</span>
                           </div>
                           <p className="text-sm text-gray-800 font-medium mb-3">{q.text}</p>
                           {q.type === 'multiple_choice' && q.options && (
                              <div className="grid grid-cols-2 gap-2 pl-2 border-l-2 border-gray-100">
                                 {q.options.map((opt, idx) => (
                                    <div key={idx} className={`text-xs p-1.5 rounded-lg flex gap-2 ${['A','B','C','D','E'][idx] === q.answer ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-500'}`}>
                                       <span>{['A','B','C','D','E'][idx]})</span> <span className="truncate">{opt}</span>
                                    </div>
                                 ))}
                              </div>
                           )}
                           <button onClick={() => setExamQuestions(examQuestions.filter(t => t.id !== q.id))} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     ))}
                  </div>
                  <div className="p-4 border-t border-gray-100">
                     <Button className="w-full gap-2 h-12" disabled={examQuestions.length === 0}><Save className="w-5 h-5" /> Kaydet & Yayınla</Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export const CoachDashboard: React.FC<CoachDashboardProps> = ({ activeTab = 'overview' }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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
         <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* KPI Cards */}
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Aktif Öğrenci</p>
                     <h3 className="text-2xl font-black text-gray-900">{data.stats.activeStudents7Days}</h3>
                  </div>
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600"><UserPlus className="w-6 h-6" /></div>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Haftalık Soru</p>
                     <h3 className="text-2xl font-black text-gray-900">{data.stats.weeklyQuestions.toLocaleString()}</h3>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><CheckCircle2 className="w-6 h-6" /></div>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ort. Başarı</p>
                     <h3 className="text-2xl font-black text-gray-900">%{data.stats.avgAccuracy}</h3>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Target className="w-6 h-6" /></div>
               </div>
               <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tahsilat</p>
                     <h3 className="text-2xl font-black text-gray-900">{data.stats.pendingPayments} Kişi</h3>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><Wallet className="w-6 h-6" /></div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6">Haftalık Trend</h3>
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                 <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                           <XAxis dataKey="date" axisLine={false} tickLine={false} />
                           <YAxis axisLine={false} tickLine={false} />
                           <Tooltip content={<CustomTooltip />} />
                           <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fill="url(#colorNet)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Aksiyon Planı</h3>
                      <div className="space-y-3">
                         {data.actions.length === 0 ? <p className="text-gray-500">İşlem yok.</p> : data.actions.slice(0, 5).map(a => (
                            <div key={a.id} className="p-3 border rounded-xl flex justify-between items-start">
                               <div>
                                  <div className="text-xs font-bold text-gray-500 uppercase">{a.priority === 'high' ? 'Acil' : 'Normal'}</div>
                                  <div className="font-bold text-gray-900 text-sm">{a.studentName}</div>
                                  <div className="text-xs text-gray-600">{a.message}</div>
                               </div>
                               <button onClick={() => {
                                  const s = api.getStudentById(a.studentId);
                                  if(s) setSelectedStudent(s);
                               }} className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                         ))}
                      </div>
                  </div>
               </div>
            </div>
         </div>
      )}
      
      {activeTab === 'students' && (
         <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-900">Öğrenci Yönetimi</h2>
               <div className="flex gap-3">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input placeholder="Ara..." className="pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-400" />
                  </div>
                  <Button onClick={() => setIsAddModalOpen(true)} className="gap-2"><UserPlus className="w-4 h-4" /> Ekle</Button>
               </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                     <tr>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Öğrenci</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sınıf</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durum</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ödeme</th>
                        <th className="px-6 py-4"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {api.getStudents().map(s => (
                        <tr key={s.id} onClick={() => setSelectedStudent(s)} className="hover:bg-gray-50 cursor-pointer">
                           <td className="px-6 py-4 font-bold text-gray-900">{s.name}</td>
                           <td className="px-6 py-4 text-sm text-gray-600">{s.classGrade}</td>
                           <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.status}</span></td>
                           <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.paymentInfo?.paymentStatus === 'paid' ? 'Ödendi' : 'Bekliyor'}</td>
                           <td className="px-6 py-4 text-right"><ChevronRight className="w-5 h-5 text-gray-400" /></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            {isAddModalOpen && <AddStudentModal onClose={() => setIsAddModalOpen(false)} onAdd={(d) => { api.addStudent(d); setData(getDashboardData()); }} />}
         </div>
      )}

      {activeTab === 'mock-exams' && <MockExamView />}
      
      {activeTab === 'finance' && (
         <div className="space-y-8 animate-in fade-in duration-500">
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
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
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