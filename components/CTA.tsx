import React from 'react';
import { Button } from './Button';

export const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary-400 rounded-full blur-3xl opacity-30"></div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Eğitim Kalitenizi Yükseltmeye Hazır Mısınız?
        </h2>
        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
          30 gün boyunca ücretsiz deneyin. Kredi kartı gerekmez. Öğrenci başarısını artırmak hiç bu kadar kolay olmamıştı.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100 w-full sm:w-auto">
            Ücretsiz Hesap Oluştur
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
            Bize Ulaşın
          </Button>
        </div>
      </div>
    </section>
  );
};