import React, { useState, useRef } from 'react';
import { Calculator, RotateCcw, TrendingUp, Award, BookOpen, ChevronDown, Check, X as XIcon } from 'lucide-react';
import { calculateLGS, calculateYKS, ExamResult, ScoreInput } from '../../services/scoreService';
import { Button } from '../Button';

export const ScoreCalculator: React.FC = () => {
  const [examType, setExamType] = useState<'LGS' | 'YKS'>('YKS');
  const [yksType, setYksType] = useState<'SAY' | 'EA' | 'SOZ'>('SAY');
  const [inputs, setInputs] = useState<Record<string, ScoreInput>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  
  // Ref for scrolling to results on mobile
  const resultsRef = useRef<HTMLDivElement>(null);

  // Constants for Form Generation
  const lgsSubjects = [
    { id: 'turkce', label: 'Türkçe', q: 20 },
    { id: 'matematik', label: 'Matematik', q: 20 },
    { id: 'fen', label: 'Fen Bilimleri', q: 20 },
    { id: 'inkilap', label: 'T.C. İnkılap', q: 10 },
    { id: 'din', label: 'Din Kültürü', q: 10 },
    { id: 'ingilizce', label: 'İngilizce', q: 10 },
  ];

  const tytSubjects = [
    { id: 'tyt_turkce', label: 'TYT Türkçe', q: 40 },
    { id: 'tyt_sosyal', label: 'TYT Sosyal', q: 20 },
    { id: 'tyt_mat', label: 'TYT Matematik', q: 40 },
    { id: 'tyt_fen', label: 'TYT Fen', q: 20 },
  ];

  const aytSubjects = {
    SAY: [
      { id: 'ayt_mat', label: 'AYT Matematik', q: 40 },
      { id: 'ayt_fiz', label: 'AYT Fizik', q: 14 },
      { id: 'ayt_kim', label: 'AYT Kimya', q: 13 },
      { id: 'ayt_biyo', label: 'AYT Biyoloji', q: 13 },
    ],
    EA: [
      { id: 'ayt_mat', label: 'AYT Matematik', q: 40 },
      { id: 'ayt_edeb', label: 'AYT Edebiyat', q: 24 },
      { id: 'ayt_tar1', label: 'AYT Tarih-1', q: 10 },
      { id: 'ayt_cog1', label: 'AYT Coğrafya-1', q: 6 },
    ],
    SOZ: [
      { id: 'ayt_edeb', label: 'AYT Edebiyat', q: 24 },
      { id: 'ayt_tar1', label: 'AYT Tarih-1', q: 10 },
      { id: 'ayt_cog1', label: 'AYT Coğrafya-1', q: 6 },
      { id: 'ayt_tar2', label: 'AYT Tarih-2', q: 11 },
      { id: 'ayt_cog2', label: 'AYT Coğrafya-2', q: 11 },
      { id: 'ayt_fel', label: 'AYT Felsefe', q: 12 },
      { id: 'ayt_din', label: 'AYT Din K.', q: 6 },
    ]
  };

  const handleInputChange = (subject: string, field: 'correct' | 'incorrect', value: string) => {
    let val = parseInt(value);
    if (isNaN(val)) val = 0;
    
    // Prevent negative numbers
    if (val < 0) val = 0;

    // Optional: Validation against max questions could go here

    setInputs(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [field]: val
      }
    }));
  };

  const calculate = () => {
    if (examType === 'LGS') {
      setResult(calculateLGS(inputs));
    } else {
      setResult(calculateYKS(inputs, yksType));
    }

    // Smooth scroll to results on mobile
    setTimeout(() => {
      if (window.innerWidth < 1024 && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const clear = () => {
    setInputs({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reusable Input Row Component for Better Mobile Layout
  const SubjectRow = ({ sub, type }: { sub: { id: string, label: string, q: number }, type: 'LGS' | 'TYT' | 'AYT' }) => {
    const correct = inputs[sub.id]?.correct || '';
    const incorrect = inputs[sub.id]?.incorrect || '';
    const net = Math.max(0, (Number(correct) || 0) - ((Number(incorrect) || 0) * (type === 'LGS' ? 0.33 : 0.25))).toFixed(2);

    return (
      <div className="p-3 sm:p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow grid grid-cols-12 gap-3 items-center group">
        {/* Label Section */}
        <div className="col-span-12 sm:col-span-4 flex items-center justify-between sm:justify-start gap-2 mb-1 sm:mb-0 border-b sm:border-b-0 border-gray-100 pb-2 sm:pb-0">
          <div className="font-bold text-gray-800 text-sm sm:text-base flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${Number(correct) > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            {sub.label}
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md sm:hidden">
            Max: {sub.q}
          </span>
        </div>

        {/* Inputs Section */}
        <div className="col-span-6 sm:col-span-3 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Check className="w-3.5 h-3.5 text-green-600" />
          </div>
          <input 
            type="number" 
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Doğru" 
            max={sub.q}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all placeholder:text-gray-400 text-gray-900"
            onChange={(e) => handleInputChange(sub.id, 'correct', e.target.value)}
            value={correct}
          />
        </div>

        <div className="col-span-6 sm:col-span-3 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <XIcon className="w-3.5 h-3.5 text-red-500" />
          </div>
          <input 
            type="number" 
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="Yanlış" 
            max={sub.q}
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-400 text-gray-900"
            onChange={(e) => handleInputChange(sub.id, 'incorrect', e.target.value)}
            value={incorrect}
          />
        </div>

        {/* Net Section */}
        <div className="col-span-12 sm:col-span-2 flex items-center justify-end sm:justify-end sm:flex-col sm:items-end gap-1 mt-1 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
          <span className="text-xs text-gray-400 font-medium sm:hidden mr-auto">NET DEĞERİ</span>
          <div className={`font-black text-lg sm:text-xl ${Number(net) > 0 ? 'text-indigo-600' : 'text-gray-300'}`}>
            {net}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20 md:pb-12">
      {/* Header */}
      <div className="text-center space-y-3 px-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-2 shadow-sm">
          <Calculator className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Puan Hesaplama Robotu</h2>
        <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
          2025 sınav sistemi verilerine ve geçmiş yıl yığılımlarına göre anlık puan ve sıralama analizi.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mx-4 md:mx-0">
        
        {/* Main Tabs (LGS / YKS) */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => { setExamType('YKS'); setResult(null); }}
            className={`flex-1 py-4 md:py-6 text-center font-bold text-sm md:text-lg transition-all relative ${examType === 'YKS' ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            YKS (TYT-AYT)
            {examType === 'YKS' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => { setExamType('LGS'); setResult(null); }}
            className={`flex-1 py-4 md:py-6 text-center font-bold text-sm md:text-lg transition-all relative ${examType === 'LGS' ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            LGS (Lise Geçiş)
            {examType === 'LGS' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
        </div>

        <div className="p-4 md:p-8 lg:p-10">
          
          {/* YKS Sub-Tabs (SAY/EA/SOZ) */}
          {examType === 'YKS' && (
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1.5 rounded-xl inline-flex w-full md:w-auto shadow-inner">
                {(['SAY', 'EA', 'SOZ'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => { setYksType(type); calculate(); }}
                    className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all ${yksType === type ? 'bg-white shadow-sm text-indigo-700 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {type === 'SAY' ? 'Sayısal' : type === 'EA' ? 'Eşit Ağırlık' : 'Sözel'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* --- INPUTS COLUMN --- */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              
              {examType === 'YKS' ? (
                <>
                  {/* TYT Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <div className="bg-indigo-100 p-1.5 rounded-lg">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">Temel Yeterlilik (TYT)</h3>
                    </div>
                    <div className="space-y-3">
                      {tytSubjects.map(sub => <SubjectRow key={sub.id} sub={sub} type="TYT" />)}
                    </div>
                  </div>

                  {/* AYT Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 pt-4">
                      <div className="bg-purple-100 p-1.5 rounded-lg">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">Alan Yeterlilik (AYT)</h3>
                    </div>
                    <div className="space-y-3">
                      {aytSubjects[yksType].map(sub => <SubjectRow key={sub.id} sub={sub} type="AYT" />)}
                    </div>
                  </div>
                </>
              ) : (
                /* LGS Section */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <div className="bg-orange-100 p-1.5 rounded-lg">
                      <BookOpen className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">LGS Dersleri</h3>
                  </div>
                  <div className="space-y-3">
                    {lgsSubjects.map(sub => <SubjectRow key={sub.id} sub={sub} type="LGS" />)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                <Button variant="secondary" className="flex-1 gap-2 h-12 text-gray-600" onClick={clear}>
                  <RotateCcw className="w-4 h-4" /> Temizle
                </Button>
                <Button className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 h-12 text-lg shadow-indigo-200" onClick={calculate}>
                  <Calculator className="w-5 h-5" /> Hesapla
                </Button>
              </div>
            </div>

            {/* --- RESULTS COLUMN --- */}
            <div className="lg:col-span-5" ref={resultsRef}>
              <div className="lg:sticky lg:top-6 space-y-6">
                
                {/* Result Card */}
                {result ? (
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-900/20 relative overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">
                        <TrendingUp className="w-3 h-3 text-green-400" /> 2025 Simülasyonu
                      </div>
                      
                      <div className="mb-2 text-indigo-200 text-sm font-medium">Tahmini Puan</div>
                      <div className="text-5xl md:text-7xl font-black mb-8 tracking-tighter bg-gradient-to-b from-white to-indigo-100 text-transparent bg-clip-text drop-shadow-sm">
                        {result.score}
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 hover:bg-white/15 transition-colors">
                          <div className="text-indigo-200 text-xs mb-1.5 uppercase font-bold tracking-wide">Sıralama</div>
                          <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1.5">
                            <Award className="w-5 h-5 text-yellow-400" />
                            {result.ranking.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 hover:bg-white/15 transition-colors">
                          <div className="text-indigo-200 text-xs mb-1.5 uppercase font-bold tracking-wide">Dilim</div>
                          <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1.5">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            %{result.percentile}
                          </div>
                        </div>
                      </div>

                      <div className="bg-indigo-600/50 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center border border-indigo-500/30">
                        <span className="font-medium text-indigo-100 text-sm">Toplam Net</span>
                        <span className="font-bold text-2xl md:text-3xl text-white">{result.totalNet}</span>
                      </div>

                      <p className="mt-6 text-[10px] md:text-xs text-indigo-300/60 text-center leading-relaxed px-4">
                        * Sonuçlar, geçen yılın katsayıları ve standart sapma tahminleri kullanılarak oluşturulmuştur. Resmi sınav sonucuyla farklılık gösterebilir.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 text-gray-300">
                      <Calculator className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Sonuç Bekleniyor</h3>
                    <p className="text-sm text-gray-500 max-w-[250px] leading-relaxed">
                      Netlerinizi görmek ve sıralamanızı öğrenmek için formu doldurup hesapla butonuna basın.
                    </p>
                    <div className="mt-6 hidden md:block">
                      <ChevronDown className="w-6 h-6 text-gray-300 animate-bounce" />
                    </div>
                  </div>
                )}

                {/* Additional Info / Ads space mockup */}
                {result && (
                   <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 flex items-start gap-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600 shrink-0">
                         <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 text-sm mb-1">Koçluk Tavsiyesi</h4>
                         <p className="text-xs text-gray-600 leading-relaxed">
                            Bu netlerle hedefinize ulaşmak için Matematik dersinde konu eksiklerinizi tamamlamanız önerilir.
                         </p>
                      </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
