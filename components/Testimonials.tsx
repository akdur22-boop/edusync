import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Merve Kaya",
    role: "Eğitim Koçu",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    content: "EduSync Pro ile 40 öğrencimi aynı anda takip edebiliyorum. Eskiden saatler süren analiz işleri şimdi tek tıkla önümde. Kesinlikle tavsiye ederim.",
    rating: 5
  },
  {
    name: "Caner Yılmaz",
    role: "Kurum Müdürü",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    content: "Kurumumuzun veli memnuniyeti %40 arttı. Veliler çocuklarının durumunu şeffaf bir şekilde görebildikleri için çok mutlular. Teknoloji çağında olması gereken bu.",
    rating: 5
  },
  {
    name: "Selin Demir",
    role: "12. Sınıf Öğrencisi",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    content: "Hangi konuda eksiğim var, hangi derse daha çok çalışmalıyım grafikleriyle görüyorum. Hedeflerime ulaşmamda en büyük yardımcım.",
    rating: 4
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white relative">
       {/* Background decoration */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-50 skew-x-12 opacity-50 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3">Referanslar</h2>
          <h3 className="text-4xl font-bold text-gray-900">Bizi Kullananlar Ne Diyor?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 text-gray-100 w-12 h-12 group-hover:text-primary-50 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-8 italic leading-relaxed relative z-10">"{review.content}"</p>

              <div className="flex items-center gap-4 border-t pt-6 border-gray-50">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
                />
                <div>
                  <div className="font-bold text-gray-900">{review.name}</div>
                  <div className="text-sm text-primary-600 font-medium">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};