'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Category } from '@/lib/types'
import { ArrowLeft, BookOpen, Loader2, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MaterialsIndex() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3]">
            <Loader2 className="animate-spin text-[#e76f51]" size={40} />
        </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-[url('/bg-main.jpg')] bg-cover bg-center bg-no-repeat p-6 overflow-x-hidden">
       {/* Overlay */}
       <div className="absolute inset-0 bg-black/20 z-0 fixed"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <Link href="/" className="bg-[#FFF9C4] p-3 rounded-full border-4 border-[#FBC02D] text-[#E65100] shadow-lg active:scale-95 transition-all hover:rotate-[-10deg]">
                <ArrowLeft size={32} strokeWidth={3} />
            </Link>
            <div className="bg-[#FFF9C4]/90 px-8 py-4 rounded-3xl border-4 border-[#FBC02D] shadow-xl">
                 <h1 className="text-3xl md:text-4xl font-black text-[#E65100] uppercase tracking-wide drop-shadow-sm">
                    Pilih Materi
                </h1>
                <p className="text-[#F57F17] font-bold text-lg mt-1">Mau belajar apa hari ini?</p>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-20">
            {categories.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border-4 border-dashed border-[#FBC02D]">
                    <p className="text-[#E65100] font-bold text-xl">Belum ada kategori materi.</p>
                </div>
            ) : (
                categories.map((cat, idx) => (
                    <Link key={cat.id} href={`/materials/${cat.id}`} className="group relative block w-full transform transition-all duration-300 hover:scale-105 active:scale-95 h-full">
                        {/* Shadow/Depth */}
                        <div className="absolute inset-0 bg-[#E65100] rounded-[2.5rem] translate-y-3 opacity-60"></div>
                        <div className="absolute inset-0 bg-[#FFB300] rounded-[2.5rem] translate-y-2 border-b-8 border-[#E65100]"></div>
                        
                        {/* Main Card Content */}
                        <div className="relative bg-[#FFF9C4] border-4 border-white rounded-[2.5rem] overflow-hidden flex flex-col h-80 shadow-inner">
                             {/* Top Banner Area */}
                             <div className="h-[45%] bg-[#FFFDE7] flex items-center justify-center relative border-b-2 border-[#FBC02D]/20 transition-colors group-hover:bg-white/80">
                                 <div className="w-20 h-20 bg-[#FBC02D] rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-300">
                                     <GraduationCap size={44} strokeWidth={2.5} className="drop-shadow-md" />
                                 </div>
                                 
                                 {/* Decorative Shine */}
                                 <div className="absolute top-3 left-6 w-10 h-4 bg-white/40 rounded-full rotate-[-20deg] blur-[1px]"></div>
                             </div>

                             {/* Bottom Content Area */}
                             <div className="p-5 pt-3 flex flex-col items-center flex-1 text-center bg-gradient-to-b from-[#FFF9C4] to-[#FFF176]/30">
                                 <div className="mb-4 flex-1 flex flex-col justify-center">
                                     <h2 className="text-base md:text-xl font-black text-[#E65100] uppercase tracking-tight drop-shadow-sm group-hover:text-[#BF360C] transition-colors leading-tight mb-1 line-clamp-2">{cat.name}</h2>
                                     <p className="text-[#8D6E63] text-xs font-bold leading-tight line-clamp-2 opacity-80 px-2">
                                         {cat.description || "Mari belajar kosa kata baru bersama Arabiku! 🚀"}
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
                ))
            )}
        </div>
      </div>
    </div>
  )
}
