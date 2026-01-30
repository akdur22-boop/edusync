import React from 'react';
import { ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDemoClick }) => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-48 overflow-hidden bg-slate-50">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-[100px] opacity-60 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] opacity-50" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left pt-8 max-w-2xl lg:max-w-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-primary-100 text-primary-700 text-sm font-semibold mb-8 hover:shadow-md transition-shadow cursor-default animate-in slide-in-from-bottom-4 fade-in duration-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-600"></span>
              </span>
              Yapay Zeka Destekli Koçluk Asistanı
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1] animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-backwards delay-100">
              Eğitimi <br/>
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 gradient-text text-transparent">360 Derece</span> <br/>
              Yönetin.
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-backwards delay-200">
              Öğretmen, Öğrenci ve Veli arasındaki tüm süreçleri tek bir platformda birleştirin. Veriye dayalı analizlerle başarıyı şansa bırakmayın.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-backwards delay-300">
              <Button size="lg" className="w-full sm:w-auto gap-2 group h-14 px-8 text-lg shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-1 transition-all">
                Hemen Başlayın <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-lg gap-2 hover:bg-gray-50" onClick={onDemoClick}>
                <PlayCircle className="w-5 h-5 text-gray-500" /> Demo İste
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-medium text-gray-500 animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-backwards delay-500">
              <div className="flex items-center gap-2 group cursor-default">
                <div className="bg-emerald-100 rounded-full p-1 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 
                </div>
                <span className="group-hover:text-emerald-700 transition-colors">14 Gün Koşulsuz Şartsız İade İmkanı</span>
              </div>
              <div className="flex items-center gap-2 group cursor-default">
                <div className="bg-emerald-100 rounded-full p-1 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="group-hover:text-emerald-700 transition-colors">7/24 Teknik Destek</span>
              </div>
            </div>
          </div>

          {/* Right Image Column - Enlarged and Layered */}
          <div className="flex-1 relative w-full lg:min-w-[650px] animate-in slide-in-from-right-10 fade-in duration-1000 delay-300">
            <div className="relative group perspective-1000">
              
              {/* Instructor Image (Main Visual) */}
              <div className="relative w-full lg:w-[90%] lg:ml-auto h-[500px] lg:h-[600px] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl transform rotate-3 transition-transform duration-700 hover:rotate-1 hover:scale-105 z-10 bg-gray-100">
                 <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=988" 
                    alt="Professional Instructor" 
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
                 {/* Badge on Instructor Image */}
                 <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-white/50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uzman Koç</p>
                    <p className="font-bold text-gray-900">Dr. Ayşe Yılmaz</p>
                 </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 -z-10 lg:w-[90%] lg:ml-auto"></div>
              
              {/* Floating Element - Teacher Card */}
              <div className="absolute top-12 -left-4 lg:left-8 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-white/50 animate-float hover:scale-105 transition-transform duration-300 cursor-pointer z-20 hidden sm:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <span className="font-bold text-lg">E</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Eğitmen</div>
                    <div className="text-base font-bold text-gray-900">Emre Koç</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Haftalık Hedef</span>
                    <span className="text-green-600">%92</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-48">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-[92%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
              </div>

              {/* Floating Element - Student Stat */}
              <div className="absolute -bottom-8 right-4 lg:right-12 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-white/50 animate-float z-20 hidden sm:block" style={{animationDelay: '1.5s'}}>
                 <div className="flex gap-4 items-center">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">1,240</div>
                      <div className="text-sm text-gray-500 font-medium">Çözülen Soru</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};