import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from './Button';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {isSubmitted ? (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-6">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Talebiniz Alındı!</h2>
            <p className="text-gray-600">Uzman ekibimiz en kısa sürede size dönüş yapacaktır.</p>
          </div>
        ) : (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Talep Edin</h2>
            <p className="text-gray-600 mb-6">Kurumunuz için en uygun çözümü birlikte planlayalım.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input 
                  required
                  type="text" 
                  id="fullname"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Adınız Soyadınız"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
                <input 
                  required
                  type="tel" 
                  id="phone"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="0555 555 55 55"
                />
              </div>

              <div>
                <label htmlFor="students" className="block text-sm font-medium text-gray-700 mb-1">Öğrenci Sayısı</label>
                <select 
                  required
                  id="students"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="0-50">0 - 50</option>
                  <option value="50-200">50 - 200</option>
                  <option value="200-500">200 - 500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                <input 
                  required
                  type="email" 
                  id="email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="ornek@kurum.com"
                />
              </div>

              <Button type="submit" className="w-full mt-2">
                Gönder
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};