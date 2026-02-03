'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Category } from '@/lib/types'
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react'
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
                    <Link key={cat.id} href={`/materials/${cat.id}`} className="group relative block w-full transform transition-all duration-300 hover:scale-105 active:scale-95">
                        {/* Shadow/Depth */}
                        <div className="absolute inset-0 bg-[#E65100] rounded-3xl translate-y-3 opacity-60"></div>
                        <div className="absolute inset-0 bg-[#FFB300] rounded-3xl translate-y-2 border-b-8 border-[#E65100]"></div>
                        
                        {/* Main Card Content */}
                        <div className="relative bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4] border-4 border-[#FFFFFF] rounded-3xl p-6 h-48 flex flex-col items-center justify-center text-center gap-4 shadow-inner">
                             <div className="w-20 h-20 bg-[#FBC02D] rounded-full flex items-center justify-center text-white border-4 border-[#FFF59D] shadow-md group-hover:rotate-[15deg] transition-all duration-300">
                                 <span className="text-4xl font-bold">{cat.name.charAt(0)}</span>
                             </div>
                             <h2 className="text-2xl font-black text-[#E65100] uppercase tracking-wide drop-shadow-sm group-hover:text-[#BF360C] transition-colors">{cat.name}</h2>
                        </div>
                        
                        {/* Shine Effect */}
                        <div className="absolute top-4 right-4 w-12 h-6 bg-white/40 rounded-full rotate-[-20deg] blur-[2px]"></div>
                    </Link>
                ))
            )}
        </div>
      </div>
    </div>
  )
}
