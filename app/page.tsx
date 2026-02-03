'use client';

import Link from "next/link";
import { Gamepad2, GraduationCap, PlayCircle, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-2 relative bg-[url('/bg-main.jpg')] bg-cover bg-center bg-no-repeat overflow-hidden">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10 z-0 fixed"></div>

      <main className="relative z-10 flex flex-col items-center w-full max-w-sm gap-2 md:gap-8 responsive-game-scale origin-center transition-transform duration-500">
        {/* Header / Logo Area */}
        <div className="flex flex-col items-center mb-1 md:mb-4 text-center">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-[#FFF176] drop-shadow-[0_4px_0_#F57F17] md:drop-shadow-[0_6px_0_#F57F17] tracking-tighter mb-1 md:mb-4 stroke-text animate-pulse-slow">
                Arabiku
            </h1>
            <div className="bg-[#FFF9C4]/90 px-6 py-1.5 md:px-8 md:py-2.5 rounded-[2rem] border-2 md:border-4 border-[#FBC02D] shadow-xl transform -rotate-1">
                <p className="text-xs sm:text-base md:text-xl font-black text-[#E65100] uppercase tracking-widest leading-none">Belajar Bahasa Arab</p>
            </div>
        </div>

        {/* Menu Buttons Stack */}
        <div className="flex flex-col w-full gap-2 md:gap-6 px-1">
            
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

            {/* Tutorial Button (Disabled) */}
            <div className="w-full relative opacity-80 cursor-not-allowed group btn-float-delay-2 grayscale-[0.5]">
                <div className="absolute inset-0 bg-gray-400 rounded-2xl translate-y-1.5"></div>
                <div className="absolute inset-0 bg-gray-300 rounded-2xl translate-y-1 border-b-4 md:border-b-6 border-gray-400"></div>
                <div className="relative bg-white/90 p-3.5 md:p-5 rounded-2xl border-2 md:border-4 border-gray-100 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 border-2 border-white/50">
                            <Lock size={20} className="md:size-6" />
                        </div>
                        <span className="text-gray-400 font-black text-xl md:text-2xl uppercase tracking-tighter">Tutorial</span>
                    </div>
                    <span className="text-[10px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full border-2 border-white shadow-sm rotate-12">SOON</span>
                </div>
            </div>

            {/* Footer / Admin Link */}
            <div className="mt-1 md:mt-4 text-center">
                <Link href="/admin/login">
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white/30 text-white font-bold text-[10px] md:text-sm transition-all shadow-lg active:scale-95">
                       Login Guru / Admin 🔐
                    </button>
                </Link>
            </div>
        </div>
      </main>

      <style jsx global>{`
        .border-b-6 { border-bottom-width: 6px; }
        
        /* Height-based responsive scaling - Targeted for 1920x912 laptop */
        .responsive-game-scale {
            transform: scale(0.8);
        }

        @media (min-height: 600px) {
            .responsive-game-scale { transform: scale(0.9); }
        }

        @media (min-height: 800px) {
            .responsive-game-scale { transform: scale(1.0); }
        }

        /* The user's specific laptop height (912px) - Sweet spot scale */
        @media (min-height: 900px) {
            .responsive-game-scale { transform: scale(1.08); }
        }

        @media (min-height: 1000px) {
            .responsive-game-scale { transform: scale(1.2); }
        }

        /* Large External Monitors */
        @media (min-height: 1200px) {
            .responsive-game-scale { transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
