import React from 'react';
import { Button } from './Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-gray-900 text-white relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-600 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-primary-400 font-bold tracking-wide uppercase text-sm mb-3">İletişim</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Sorularınız mı var? <br/> Bize ulaşın.</h3>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Platformumuz hakkında daha fazla bilgi almak, kurumsal teklif istemek veya demo talep etmek için aşağıdaki formu doldurabilir veya iletişim kanallarımızdan bize ulaşabilirsiniz.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-primary-500/50 transition-colors">
                <div className="bg-primary-900/50 p-3 rounded-lg text-primary-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">E-Posta</div>
                  <div className="font-medium text-white">merhaba@edusyncpro.com</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-primary-500/50 transition-colors">
                <div className="bg-primary-900/50 p-3 rounded-lg text-primary-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Telefon</div>
                  <div className="font-medium text-white">+90 (212) 555 00 00</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-primary-500/50 transition-colors">
                <div className="bg-primary-900/50 p-3 rounded-lg text-primary-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Ofis</div>
                  <div className="font-medium text-white">Maslak, İstanbul</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl text-gray-900">
            <h3 className="text-2xl font-bold mb-6">Hemen Mesaj Gönderin</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="Ad" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyadınız</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="Soyad" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta Adresi</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="ornek@email.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                <textarea rows={4} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none" placeholder="Size nasıl yardımcı olabiliriz?"></textarea>
              </div>

              <Button size="lg" className="w-full gap-2 mt-2">
                <Send className="w-4 h-4" /> Gönder
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};