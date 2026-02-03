'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Quiz } from '@/lib/types'
import { ArrowLeft, Gamepad2, Loader2, Trophy, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function QuizzesIndex() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuizzes() {
      const { data } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false })
      if (data) setQuizzes(data)
      setLoading(false)
    }
    fetchQuizzes()
  }, [])

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3]">
            <Loader2 className="animate-spin text-[#e76f51]" size={40} />
        </div>
    )
  }

  return (
    <div className="h-screen relative bg-[url('/bg-main.jpg')] bg-cover bg-center bg-no-repeat p-4 md:p-8 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-0 fixed"></div>

      <div className="max-w-7xl mx-auto relative z-10 h-full flex flex-col">
        <header className="mb-2 flex flex-col md:flex-row items-center gap-4 text-center md:text-left shrink-0">
            <Link href="/" className="bg-[#FFF9C4] p-3 rounded-full border-4 border-[#FBC02D] text-[#E65100] shadow-lg active:scale-95 transition-all hover:rotate-[-10deg]">
                <ArrowLeft size={32} strokeWidth={3} />
            </Link>
            <div className="bg-[#FFF9C4]/90 px-8 py-3 rounded-3xl border-4 border-[#FBC02D] shadow-xl">
                 <h1 className="text-3xl md:text-4xl font-black text-[#E65100] uppercase tracking-wide drop-shadow-sm">
                    Ruang Kuis
                </h1>
                <p className="text-[#F57F17] font-bold text-lg leading-tight">Geser kuis kesukaanmu! 👉</p>
            </div>

            <div className="md:ml-auto bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/30 flex items-center gap-3">
                <Trophy className="text-yellow-400 drop-shadow-md" size={32} />
                <div className="text-left">
                  <p className="text-white/70 text-xs font-black uppercase leading-none">Skor Tertinggi</p>
                  <p className="text-white font-black text-xl leading-none">0 POIN</p>
                </div>
            </div>
        </header>

        {/* Horizontal Slider Container */}
        <div className="flex-1 flex items-center overflow-x-auto overflow-y-hidden snap-x snap-mandatory gap-6 md:gap-10 px-8 md:px-20 py-10 md:py-20 custom-scrollbar -mx-8 md:-mx-20">
            {quizzes.length === 0 ? (
                <div className="mx-auto flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-white/30 text-center px-20">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <Gamepad2 size={40} className="text-white/60" />
                    </div>
                    <p className="text-[#E65100] font-black text-2xl drop-shadow-md">Belum ada kuis tersedia.</p>
                </div>
            ) : (
                quizzes.map((quiz) => (
                    <div key={quiz.id} className="flex-shrink-0 w-[82vw] sm:w-[320px] md:w-[320px] snap-center">
                        <Link href={`/quizzes/${quiz.id}/play`} className="group relative block w-full transform transition-all duration-300 hover:scale-105 active:scale-95">
                            {/* Shadow/Depth */}
                            <div className="absolute inset-0 bg-[#E65100] rounded-[2.5rem] translate-y-3 opacity-60"></div>
                            <div className="absolute inset-0 bg-[#FFB300] rounded-[2.5rem] translate-y-2 border-b-8 border-[#E65100]"></div>
                            
                            {/* Main Card Content */}
                            <div className="relative bg-[#FFF9C4] border-4 border-white rounded-[2.5rem] overflow-hidden flex flex-col h-[340px] shadow-inner">
                                {/* Top Banner Area */}
                                <div className="h-[45%] bg-[#FFFDE7] relative overflow-hidden flex items-center justify-center border-b-2 border-[#FBC02D]/20 transition-colors group-hover:bg-white/80">
                                    {quiz.thumbnail_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={quiz.thumbnail_url} alt={quiz.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FBC02D] rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-300">
                                            <Gamepad2 className="w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-4 right-4 bg-white/90 p-1.5 md:p-2 rounded-full shadow-md text-[#FBC02D]">
                                        <Star size={16} className="md:size-5" fill="currentColor" />
                                    </div>

                                    {/* Decorative Shine */}
                                    <div className="absolute top-3 left-6 w-10 h-4 bg-white/40 rounded-full rotate-[-20deg] blur-[1px]"></div>
                                </div>

                                {/* Bottom Content Area */}
                                <div className="p-4 md:p-5 pt-3 flex flex-col items-center flex-1 text-center bg-gradient-to-b from-[#FFF9C4] to-[#FFF176]/30">
                                    <div className="mb-4 flex-1 flex flex-col justify-center">
                                        <h3 className="text-base md:text-lg font-black text-[#E65100] uppercase tracking-tight drop-shadow-sm group-hover:text-[#BF360C] transition-colors leading-tight mb-1 line-clamp-2">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-[#8D6E63] text-[10px] md:text-xs font-bold leading-tight line-clamp-2 opacity-80 px-2">
                                            {quiz.description || "Tantang dirimu dengan kuis ini dan kumpulkan skor sebanyak-banyaknya!"}
                                        </p>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <div className="w-full mt-auto">
                                        <div className="relative inline-block w-full">
                                            <div className="absolute inset-0 bg-[#E65100] rounded-xl translate-y-1 opacity-40"></div>
                                            <button className="relative w-full bg-[#F57F17] group-hover:bg-[#E65100] text-white text-[10px] md:text-xs font-black py-2.5 rounded-xl border-b-4 border-black/10 transition-all active:translate-y-1 uppercase tracking-wider">
                                                MULAI BELAJAR 🚀
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))
            )}
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          margin: 0 40px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 192, 45, 0.6);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 192, 45, 0.9);
        }
      `}</style>
    </div>
  )
}
