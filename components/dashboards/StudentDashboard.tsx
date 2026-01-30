import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/mockApi';
import { analyzePerformance } from '../../services/aiService';
import { Result, AIAnalysis } from '../../types';
import { Button } from '../Button';
import { Brain, PlusCircle, History } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
};
