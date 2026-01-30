import React from 'react';
import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center text-white font-bold">
                E
              </div>
              <span className="text-xl font-bold text-white">
                EduSync<span className="text-primary-500">Pro</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Eğitim koçları, öğretmenler ve kurumlar için geliştirilmiş, veri odaklı öğrenci takip ve analiz platformu.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Özellikler</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Öğretmenler İçin</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Öğrenciler İçin</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Bülten</h4>
            <p className="text-sm text-gray-400 mb-4">Eğitim trendlerinden haberdar olun.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="bg-gray-800 border-none rounded px-3 py-2 text-sm w-full focus:ring-1 focus:ring-primary-500 text-white"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded text-sm transition-colors">
                Abone Ol
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© 2024 EduSync Pro. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};