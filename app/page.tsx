'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Gamepad2, GraduationCap, PlayCircle, Lock, Monitor, X } from "lucide-react";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Auto-expand every time they land on Home, unless they minimize it in this current viewing
    const timer = setTimeout(() => setIsExpanded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleMinimize = () => {
    setIsExpanded(false);
    sessionStorage.setItem('fsWidgetMinimized', 'true');
  };

  // Prevent hydration mismatch
  if (!mounted) return (
    <div className="h-screen w-full bg-[#E65100]"></div>
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
      {/* Optimized Background Image */}
      <Image
        src="/bg-main.jpg"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
        quality={75}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 z-[5] fixed"></div>

      <main className="relative z-10 flex flex-col items-center w-full max-w-sm gap-10 md:gap-12 responsive-game-scale origin-center transition-transform duration-500 pt-12 md:pt-0">
        {/* Header / Logo Area */}
        <div className="flex flex-col items-center mb-2 md:mb-8 text-center">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-[#FFF176] drop-shadow-[0_4px_0_#F57F17] md:drop-shadow-[0_6px_0_#F57F17] tracking-tighter mb-4 md:mb-6 stroke-text animate-pulse-slow">
                Arabiku
            </h1>
            <div className="bg-[#FFF9C4]/90 px-10 py-2.5 md:px-10 md:py-3 rounded-[2rem] border-2 md:border-4 border-[#FBC02D] shadow-xl transform -rotate-1">
                <p className="text-lg sm:text-xl md:text-2xl font-black text-[#E65100] uppercase tracking-widest leading-none">Belajar Bahasa Arab</p>
            </div>
        </div>

        {/* Menu Buttons Stack */}
        <div className="flex flex-col w-full gap-4 md:gap-6 px-1">
            
            {/* Start Learning Button */}
            <Link href="/materials" className="w-full btn-float group">
                <button className="w-full relative transform transition-all duration-200 group-hover:scale-105 active:scale-95 text-left">
                    <div className="absolute inset-0 bg-[#E65100] rounded-2xl translate-y-1.5 opacity-50 group-hover:opacity-70 transition-all"></div>
                    <div className="absolute inset-0 bg-[#FBC02D] rounded-2xl translate-y-1 border-b-4 md:border-b-6 border-[#E65100]"></div>
                    
                    <div className="relative bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4] p-3.5 md:p-5 rounded-2xl border-2 md:border-4 border-white flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md border-2 border-white/50">
                                <GraduationCap size={24} className="md:size-7" strokeWidth={2.5} />
                            </div>
                            <span className="text-[#E65100] font-black text-xl md:text-2xl uppercase tracking-tighter">Mulai Belajar</span>
                        </div>
                        <PlayCircle size={26} className="text-[#FBC02D] md:size-8 group-hover:translate-x-1 transition-transform" />
                        
                        {/* Shine Effect */}
                        <div className="absolute top-1 left-4 w-10 h-3 md:w-14 md:h-6 bg-white/40 rounded-full rotate-[-20deg] blur-[2px]"></div>
                    </div>
                </button>
            </Link>

            {/* Quiz Button */}
            <Link href="/quizzes" className="w-full btn-float-delay-1 group">
                <button className="w-full relative transform transition-all duration-200 group-hover:scale-105 active:scale-95 text-left">
                    <div className="absolute inset-0 bg-[#E65100] rounded-2xl translate-y-1.5 opacity-50 group-hover:opacity-70 transition-all"></div>
                    <div className="absolute inset-0 bg-[#FBC02D] rounded-2xl translate-y-1 border-b-4 md:border-b-6 border-[#E65100]"></div>
                    
                    <div className="relative bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4] p-3.5 md:p-5 rounded-2xl border-2 md:border-4 border-white flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md border-2 border-white/50">
                                <Gamepad2 size={24} className="md:size-7" strokeWidth={2.5} />
                            </div>
                            <span className="text-[#E65100] font-black text-xl md:text-2xl uppercase tracking-tighter">Latihan Quiz</span>
                        </div>
                        <PlayCircle size={26} className="text-[#FBC02D] md:size-8 group-hover:translate-x-1 transition-transform" />
                        
                        {/* Shine Effect */}
                        <div className="absolute top-1 left-4 w-10 h-3 md:w-14 md:h-6 bg-white/40 rounded-full rotate-[-20deg] blur-[2px]"></div>
                    </div>
                </button>
            </Link>

            {/* Tutorial Button */}
            <Link href="/tutorials" className="w-full btn-float-delay-2 group">
                <button className="w-full relative transform transition-all duration-200 group-hover:scale-105 active:scale-95 text-left">
                    <div className="absolute inset-0 bg-[#E65100] rounded-2xl translate-y-1.5 opacity-50 group-hover:opacity-70 transition-all"></div>
                    <div className="absolute inset-0 bg-[#FBC02D] rounded-2xl translate-y-1 border-b-4 md:border-b-6 border-[#E65100]"></div>
                    
                    <div className="relative bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4] p-3.5 md:p-5 rounded-2xl border-2 md:border-4 border-white flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-md border-2 border-white/50">
                                <PlayCircle size={24} className="md:size-7" strokeWidth={2.5} />
                            </div>
                            <span className="text-[#E65100] font-black text-xl md:text-2xl uppercase tracking-tighter">Tutorial</span>
                        </div>
                        <PlayCircle size={26} className="text-[#FBC02D] md:size-8 group-hover:translate-x-1 transition-transform" />
                        
                        {/* Shine Effect */}
                        <div className="absolute top-1 left-4 w-10 h-3 md:w-14 md:h-6 bg-white/40 rounded-full rotate-[-20deg] blur-[2px]"></div>
                    </div>
                </button>
            </Link>

            {/* Footer / Admin Link */}
            <div className="mt-16 md:mt-12 text-center">
                <Link href="/admin/login">
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white/30 text-white font-bold text-[10px] md:text-sm transition-all shadow-lg active:scale-95">
                       Login Guru / Admin 🔐
                    </button>
                </Link>
            </div>
        </div>
      </main>

      {/* Full Screen Recommendation Widget - Desktop Only (Hidden on Mobile) */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-[100]">
          {!isExpanded ? (
              /* Minimized Icon State */
              <button 
                  onClick={() => setIsExpanded(true)}
                  className="bg-[#FFF9C4] w-12 h-12 rounded-full border-4 border-[#FBC02D] shadow-[0_4px_0_#F57F17] flex items-center justify-center text-[#E65100] hover:scale-110 active:scale-95 transition-all animate-pulse shadow-lg"
                  title="Tips Belajar"
              >
                  <span className="font-black text-2xl">!</span>
              </button>
          ) : (
              /* Expanded Toast State */
              <div className="relative bg-[#FFF9C4] p-3.5 rounded-3xl border-4 border-[#FBC02D] shadow-[0_6px_0_#F57F17] flex gap-3 pr-10 max-w-[280px] animate-bounce-in">
                  <div className="bg-orange-500 w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 border-2 border-white/50 shadow-md">
                      <Monitor size={18} />
                  </div>
                  <div className="flex flex-col gap-1">
                      <p className="text-[#E65100] font-black uppercase text-[9px] tracking-wider bg-orange-100 self-start px-2 py-0.5 rounded-full border border-orange-200">💡 Tips Layar</p>
                      <p className="text-[#5D4037] text-[13px] font-bold leading-tight">
                          Tekan <span className="bg-white px-1 py-0.5 rounded border border-orange-200 text-orange-700 shadow-sm font-black italic">F11</span> untuk <b>Belajar Lebih Maksimal!</b>
                      </p>
                  </div>

                  <button 
                      onClick={handleMinimize}
                      className="absolute top-3 right-3 w-8 h-8 bg-white border-2 border-[#FBC02D] rounded-full flex items-center justify-center text-[#E65100] hover:scale-110 active:scale-90 transition-all shadow-sm"
                  >
                      <X size={18} strokeWidth={3} />
                  </button>
              </div>
          )}
      </div>

    </div>
  );
}
