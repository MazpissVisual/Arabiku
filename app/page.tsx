'use client';

import Link from "next/link";

export default function Home() {


  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center p-4 relative bg-[url('/bg-main.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Overlay for better text readability if needed, keeping it subtle */}
      <div className="absolute inset-0 bg-black/10 z-0"></div>

      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-md gap-8">
        {/* Header / Logo Area */}
        <div className="flex flex-col items-center mb-4">
            <h1 className="text-6xl md:text-7xl font-extrabold text-[#FFF176] drop-shadow-[0_4px_0_#F57F17] tracking-tight mb-2 stroke-text">
                Arabiku
            </h1>
            <div className="bg-[#FFF9C4]/90 px-6 py-2 rounded-full border-4 border-[#FBC02D] shadow-lg transform -rotate-2">
                <p className="text-lg font-bold text-[#E65100]">Belajar Bahasa Arab</p>
            </div>
        </div>

        {/* Menu Buttons Stack */}
        <div className="flex flex-col w-full gap-5 px-6">
            
            <Link href="/materials" className="w-full btn-float">
                <button className="w-full relative group transform transition-all duration-200 hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 bg-[#F57F17] rounded-full translate-y-2 group-active:translate-y-0 opacity-40 transition-all"></div>
                    <div className="absolute inset-0 bg-[#FBC02D] rounded-full translate-y-1.5 border-b-4 border-[#F57F17] group-active:translate-y-0.5 group-active:border-b-0 transition-all"></div>
                    <div className="relative bg-gradient-to-b from-[#FFF59D] to-[#FBC02D] px-6 py-4 rounded-full border-4 border-[#FFF9C4] text-[#E65100] font-black text-2xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 group-active:translate-y-1 transition-all">
                        <span className="drop-shadow-sm">Mulai Belajar</span>
                    </div>
                    {/* Shine Effect */}
                    <div className="absolute top-2 right-10 w-8 h-3 bg-white/40 rounded-full rotate-[-20deg] blur-[1px]"></div>
                </button>
            </Link>

            <Link href="/quizzes" className="w-full btn-float-delay-1">
                <button className="w-full relative group transform transition-all duration-200 hover:scale-105 active:scale-95">
                    <div className="absolute inset-0 bg-[#F57F17] rounded-full translate-y-2 group-active:translate-y-0 opacity-40 transition-all"></div>
                    <div className="absolute inset-0 bg-[#FBC02D] rounded-full translate-y-1.5 border-b-4 border-[#F57F17] group-active:translate-y-0.5 group-active:border-b-0 transition-all"></div>
                    <div className="relative bg-gradient-to-b from-[#FFF59D] to-[#FBC02D] px-6 py-4 rounded-full border-4 border-[#FFF9C4] text-[#E65100] font-black text-2xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-3 group-active:translate-y-1 transition-all">
                        <span className="drop-shadow-sm">Latihan Quiz</span>
                    </div>
                     {/* Shine Effect */}
                     <div className="absolute top-2 right-10 w-8 h-3 bg-white/40 rounded-full rotate-[-20deg] blur-[1px]"></div>
                </button>
            </Link>

             {/* Tutorial Button (Disabled/Coming Soon style) */}
            <div className="w-full relative opacity-90 cursor-not-allowed grayscale-[0.3] btn-float-delay-2">
                <div className="absolute inset-0 bg-[#F57F17] rounded-full translate-y-2 opacity-40"></div>
                <div className="absolute inset-0 bg-[#FBC02D] rounded-full translate-y-1.5 border-b-4 border-[#F57F17]"></div>
                <div className="relative bg-gradient-to-b from-[#FFF59D] to-[#FBC02D] px-6 py-4 rounded-full border-4 border-[#FFF9C4] text-[#E65100] font-black text-2xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-3">
                    Tutorial
                    <span className="text-[10px] absolute top-[-5px] right-[-5px] text-white bg-red-500 border-2 border-white px-2 py-0.5 rounded-full shadow-sm animate-bounce">Coming Soon</span>
                </div>
            </div>
            
             {/* Exit Button (Optional, redirects to Google or closes tab? For web, maybe just Home) */}
            {/* <div className="w-full">...</div> */}
        </div>

        {/* Footer / Admin Link */}
        <div className="mt-8">
            <Link href="/admin/login">
                <button className="text-white/80 font-bold hover:text-white hover:underline text-sm shadow-black drop-shadow-md">
                   Login Guru / Admin
                </button>
            </Link>
        </div>
      </main>
      
    </div>
  );
}
