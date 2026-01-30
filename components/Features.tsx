import React from 'react';
import { Target, BarChart3, MessageCircle, Calendar, ShieldCheck, Zap, Layers, Globe, Clock } from 'lucide-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: "Akıllı Hedef Takibi",
    description: "Öğrencileriniz için kişiselleştirilmiş hedefler belirleyin ve ilerlemelerini gerçek zamanlı, görsel grafiklerle takip edin.",
    icon: <Target className="w-6 h-6" />,
  },
  {
    title: "Derinlemesine Analitik",
    description: "Deneme sınavı sonuçları, ödev tamamlama oranları ve konu eksikliklerini yapay zeka destekli grafiklerle analiz edin.",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    title: "Entegre İletişim Hattı",
    description: "Veli ve öğrencilerle uygulama üzerinden güvenli mesajlaşma. WhatsApp grupları karmaşasına son verin, profesyonel kalın.",
    icon: <MessageCircle className="w-6 h-6" />,
  },
  {
    title: "Dinamik Programlama",
    description: "Sürükle bırak takvim ile etütleri, birebir görüşmeleri ve sınav tarihlerini çakışma olmadan kolayca planlayın.",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    title: "Otomatik Veli Raporları",
    description: "Velilere otomatik, periyodik raporlar gönderin. Çocuğunun durumu hakkında şeffaf bilgi sahibi olmalarını sağlayın.",
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: "AI Koç Asistanı",
    description: "Öğrenci verilerini arka planda analiz ederek size stratejik çalışma programı önerileri sunan akıllı yardımcı.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Çoklu Platform Desteği",
    description: "Web, tablet ve mobil uyumlu arayüz ile her yerden, her cihazdan erişim imkanı.",
    icon: <Layers className="w-6 h-6" />,
  },
  {
    title: "Online Sınav Entegrasyonu",
    description: "Farklı yayınların sonuçlarını tek havuzda toplayın, karmaşık excel dosyalarından kurtulun.",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    title: "Zaman Yönetimi",
    description: "Öğrencileriniz için pomodoro sayaçları ve etüt takip sistemleri ile verimli çalışma disiplini oluşturun.",
    icon: <Clock className="w-6 h-6" />,
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block mb-4 p-2 bg-primary-50 rounded-lg">
            <h2 className="text-primary-600 font-bold tracking-wide uppercase text-xs">Yetenekler</h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            Eğitim Koçları İçin <br/> <span className="text-primary-600">Süper Güçler</span>
          </h3>
          <p className="text-xl text-gray-600 leading-relaxed">
            Klasik takip yöntemlerini bir kenara bırakın. EduSync Pro, koçluk sürecinizi uçtan uca dijitalleştirerek size zaman kazandırır ve değer katar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-900/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-primary-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 ease-out z-0"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-md text-primary-600 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">{feature.description}</p>
              </div>
              
              {/* Bottom Line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary-600 transition-all duration-500 group-hover:w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};