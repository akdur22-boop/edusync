import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, LogIn } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  onLoginClick: () => void;
  onDemoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onDemoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Özellikler', href: '#features' },
    { label: 'Çözümler', href: '#solutions' },
    { label: 'Referanslar', href: '#testimonials' },
    { label: 'İletişim', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:bg-primary-700 transition-colors">
              E
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
              EduSync<span className="text-primary-600">Pro</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-600 relative group py-2"
              >
                <span className="group-hover:text-primary-600 transition-colors">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onLoginClick}
              className="flex items-center gap-2 hover:bg-primary-50 text-gray-700 hover:text-primary-700"
            >
              <LogIn className="w-4 h-4" />
              Giriş Yap
            </Button>
            <Button onClick={onDemoClick} className="shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all">
              Demo İste
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-xl animate-in slide-in-from-top-5 z-40">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                className="text-base font-medium text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" onClick={() => {
                onLoginClick();
                setIsMobileMenuOpen(false);
              }} className="w-full justify-center">
                Giriş Yap
              </Button>
              <Button className="w-full justify-center" onClick={() => {
                onDemoClick();
                setIsMobileMenuOpen(false);
              }}>
                Demo İste
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};