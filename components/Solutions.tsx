import React from 'react';
import { Button } from './Button';
import { GraduationCap, Users, User, CheckCircle } from 'lucide-react';

export const Solutions: React.FC = () => {
  return (
    <section id="solutions" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Tek Platform, Üç Farklı Deneyim</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Her kullanıcı tipi için özelleştirilmiş, modern ve kullanıcı dostu arayüzler ile herkes ihtiyacı olan veriye anında ulaşır.
          </p>
        </div>

        <div className="space-y-24">
          {/* Teacher Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 group">
            <div className="flex-1 order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary-200 rounded-3xl transform rotate-3 scale-95 group-hover:rotate-6 transition-transform duration-500 opacity-30"></div>
              <div className="w-full bg-white border border-gray-100 rounded-3xl relative overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
                 <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=2070" className="w-full h-[400px] object-cover opacity-90" alt="Teacher Dashboard" />
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md p-6 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 text-lg">12-A Sınıfı Başarısı</span>
                    <span className="text-white bg-green-500 px-3 py-1 rounded-full text-xs font-bold">+12%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-100 rounded-xl text-primary-600 shadow-sm">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Eğitmenler ve Koçlar</h3>
              </div>
              <h4 className="text-xl text-gray-800 font-semibold mb-6 leading-relaxed">Eğitim Yönetiminde Veriye Dayalı Profesyonel Yaklaşım</h4>
              <ul className="space-y-4 mb-8">
                {[
                  "Tek panelden tüm öğrencilerin akademik durumunu izleyin.",
                  "Otomatik ödev atamaları ve kontrol sistemleri oluşturun.",
                  "Haftalık analiz raporları oluşturmak için zaman harcamayın.",
                  "Öğrenci bazlı özelleştirilmiş çalışma planları hazırlayın."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="border-primary-200 text-primary-700 hover:bg-primary-50 hover:border-primary-300">Detaylı İncele</Button>
            </div>
          </div>

          {/* Student Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 group">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 shadow-sm">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Öğrenciler</h3>
              </div>
              <h4 className="text-xl text-gray-800 font-semibold mb-6">Kendi Başarı Hikayeni Yaz</h4>
              <ul className="space-y-4 mb-8">
                {[
                  "Günlük hedeflerini gör ve tamamladıkça işaretle.",
                  "Eksik konularını grafiklerle gör, nokta atışı çalış.",
                  "Sınav takvimini ve ders programını her an cebinde taşı.",
                  "Yapay zeka önerileri ile çalışma verimini artır."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300">Öğrenci Panelini Gör</Button>
            </div>
            <div className="flex-1 relative">
               <div className="absolute inset-0 bg-emerald-200 rounded-3xl transform -rotate-3 scale-95 group-hover:-rotate-6 transition-transform duration-500 opacity-30"></div>
              <div className="w-full bg-white border border-gray-100 rounded-3xl relative overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070" className="w-full h-[400px] object-cover" alt="Student Mobile App" />
                {/* Simulated Overlay */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 bg-white/90 backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/40">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <GraduationCap />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Türev Testi</div>
                            <div className="text-xs text-gray-500">Matematik • 40 Soru</div>
                        </div>
                        <div className="ml-auto text-emerald-600 font-bold text-lg">95%</div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-gray-100 rounded-full"><div className="w-[95%] h-full bg-emerald-500 rounded-full"></div></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Parent Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 group">
            <div className="flex-1 order-2 lg:order-1 relative">
                <div className="absolute inset-0 bg-orange-200 rounded-3xl transform rotate-3 scale-95 group-hover:rotate-6 transition-transform duration-500 opacity-30"></div>
               <div className="w-full bg-white border border-gray-100 rounded-3xl relative overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=2067" className="w-full h-[400px] object-cover" alt="Parent View" />
                <div className="absolute top-6 left-6 bg-white p-5 rounded-2xl shadow-xl max-w-xs animate-float">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-orange-200">
                           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">Oğuz'un Gelişimi</div>
                            <div className="text-xs text-green-600 font-medium">Bu hafta harika gidiyor!</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-orange-50 p-2 rounded-lg">
                            <div className="text-xs text-gray-500">Devamsızlık</div>
                            <div className="font-bold text-gray-900">0 Gün</div>
                        </div>
                         <div className="bg-orange-50 p-2 rounded-lg">
                            <div className="text-xs text-gray-500">Son Deneme</div>
                            <div className="font-bold text-gray-900">420 Puan</div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600 shadow-sm">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Veliler</h3>
              </div>
              <h4 className="text-xl text-gray-800 font-semibold mb-6">Endişe Etmeyin, Takipte Kalın</h4>
              <ul className="space-y-4 mb-8">
                {[
                    "Çocuğunuzun çalışma saatlerini ve gelişimini anlık izleyin.",
                    "Öğretmen yorumlarına ve analizlerine doğrudan erişin.",
                    "Eksik olduğu konuları görerek doğru desteği sağlayın.",
                    "Ödeme takibi ve kurumsal bilgilendirmeleri alın."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300">Veli Bilgilendirme Sistemi</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};