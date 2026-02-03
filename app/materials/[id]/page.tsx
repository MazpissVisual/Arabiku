'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Material, Category } from '@/lib/types'
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Home, RotateCcw, BookOpen, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MaterialViewer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [materials, setMaterials] = useState<Material[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [viewState, setViewState] = useState<'intro' | 'playing' | 'completed'>('intro')

  const currentMaterial = materials[currentIndex]
  const progress = materials.length > 0 ? ((currentIndex + 1) / materials.length) * 100 : 0

  useEffect(() => {
    fetchData()
    // Pre-load voices for mobile browsers
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }
  }, [])

  const fetchData = async () => {
    try {
        setLoading(true)
        
        // 1. Fetch Category Details first
        const { data: catData, error: catError } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single()
            
        if (catError) throw catError
        setCategory(catData)

        // 2. Fetch Materials for this category
        const { data, error } = await supabase
            .from('materials')
            .select('*')
            .eq('category_id', id)
            .eq('is_published', true)
            .order('title') // or any other ordering
        
        if (error) throw error
        setMaterials(data || [])
    } catch (error: any) {
        console.error('Error fetching data:', error)
        // toast.error('Gagal memuat materi') // Temporarily removed to avoid missing import
    } finally {
        setLoading(false)
    }
  }

  const nextSlide = () => {
    if (currentIndex < materials.length - 1) {
        setCurrentIndex(prev => prev + 1)
    } else {
        setViewState('completed')
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1)
    }
  }

  const speakArabic = (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      
      // Stop current speech
      window.speechSynthesis.cancel();

      // Small delay helps mobile browsers reset the engine
      setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(text);
          
          // Get available voices
          const voices = window.speechSynthesis.getVoices();
          
          // Try to find a specific Arabic voice
          const arabicVoice = voices.find(v => v.lang.includes('ar-SA')) || 
                        voices.find(v => v.lang.includes('ar')) ||
                        voices.find(v => v.name.toLowerCase().includes('arabic'));

          if (arabicVoice) {
              utterance.voice = arabicVoice;
          }
          
          utterance.lang = 'ar-SA';
          utterance.rate = 0.9;
          utterance.pitch = 1;

          window.speechSynthesis.speak(utterance);
      }, 50);
  }

  if (loading) {
      return (
          <div className="min-h-screen bg-[#fdf6e3] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                {/* Loader2 removed to avoid missing import if not present */}
                <div className="animate-spin text-[#e76f51] h-12 w-12 border-4 border-[#e76f51] border-t-transparent rounded-full" />
                <p className="text-gray-500 font-medium animate-pulse">Memuat materi...</p>
              </div>
          </div>
      )
  }

  if (materials.length === 0 && !loading) {
    return (
        <div className="min-h-screen bg-[#fdf6e3] flex flex-col items-center justify-center p-6 text-center">
             <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-400">
                <span className="text-4xl">📭</span>
             </div>
             <h1 className="text-2xl font-bold text-gray-800 mb-2">Belum ada materi</h1>
             <p className="text-gray-500 mb-8 max-w-sm">
                Materi untuk kategori ini belum tersedia. Silakan cek kembali nanti atau pilih kategori lain.
             </p>
             <Link href="/materials" className="px-6 py-3 bg-[#e76f51] text-white rounded-xl font-medium shadow-lg shadow-orange-500/20 hover:bg-[#d05d40] transition-all">
                Kembali ke Daftar
             </Link>
        </div>
    )
  }



  return (
    <div className="h-screen bg-[#fdf6e3] flex flex-col overflow-hidden relative bg-[url('/bg-main.jpg')] bg-cover bg-center bg-no-repeat">
       {/* Overlay */}
       <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none"></div>

      {/* Header / Navbar */}
      <div className="px-6 py-4 shrink-0 flex items-center justify-between z-20">
         <Link href="/materials" className="p-3 bg-[#FFF9C4] border-4 border-[#FBC02D] rounded-full shadow-lg hover:rotate-[-10deg] transition-all text-[#E65100] active:scale-95">
             <ArrowLeft size={28} strokeWidth={3} />
         </Link>
          {viewState === 'playing' && (
              <div className="flex flex-col items-center flex-1 mx-2 min-w-0">
                  <div className="bg-[#FFF9C4]/90 px-4 py-1.5 md:px-6 md:py-2 rounded-full border-2 md:border-4 border-[#FBC02D] shadow-md mb-2 max-w-full">
                     <h1 className="font-black text-[#E65100] text-sm sm:text-lg uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">{category?.name}</h1>
                  </div>
                  <div className="w-full max-w-xs h-3 md:h-4 bg-[#FFF9C4] border-2 border-[#FBC02D] rounded-full overflow-hidden shadow-inner flex-shrink-0">
                      <div className="h-full bg-gradient-to-r from-[#FFB74D] to-[#E65100] transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                         <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50"></div>
                      </div>
                  </div>
              </div>
          )}
         <div className="w-10"></div> {/* Spacer */}
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-6xl mx-auto min-h-0 relative z-10">
        
        {/* VIEW STATE: INTRO */}
        {viewState === 'intro' && (
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 text-center max-w-lg w-full border-4 border-white animate-in zoom-in duration-300 relative">
                 {/* Decorative Top Border */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#FFF9C4] border-8 border-white rounded-full flex items-center justify-center shadow-md z-10">
                     <span className="text-5xl font-black text-[#E65100] drop-shadow-sm">{category?.name.charAt(0)}</span>
                </div>
                
                <div className="mt-12 space-y-4">
                     <div>
                        <h2 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-1">Bab:</h2>
                        <h1 className="text-4xl font-extrabold text-[#37474F] tracking-tight">{category?.name}</h1>
                     </div>
                    
                    <p className="text-gray-600 text-lg leading-relaxed font-medium bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                        {category?.description || "Selamat datang! Di bab ini kita akan mempelajari kosa kata baru yang menarik. Siapkan dirimu!"}
                    </p>

                    <div className="pt-4">
                        <button 
                            onClick={() => setViewState('playing')}
                            className="w-full relative group transform transition-all duration-100 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-[#D84315] rounded-2xl translate-y-2 opacity-100 transition-all"></div>
                            <div className="relative bg-[#FF7043] hover:bg-[#FF5722] text-white py-4 rounded-2xl font-black text-xl border-b-4 border-[#BF360C] shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider group-active:translate-y-2 group-active:border-b-0 transition-all">
                                Mulai Belajar
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW STATE: COMPLETED */}
        {viewState === 'completed' && (
             <div className="bg-white rounded-[2rem] shadow-2xl p-5 md:p-6 max-w-md w-full text-center relative border-[6px] border-[#8D6E63] animate-in zoom-in duration-300 mx-4 mt-2 md:mt-6 overflow-visible">
                
                {/* Floating Badge Icon - Compact */}
                <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 w-20 h-20 md:w-28 md:h-28 bg-[#E1F5FE] border-[6px] border-[#8D6E63] rounded-full flex items-center justify-center shadow-lg z-10">
                     <span className="text-4xl md:text-5xl drop-shadow-sm filter">🎉</span>
                </div>
                
                <div className="mt-8 md:mt-12 space-y-2 md:space-y-3">
                     <div>
                        <h2 className="text-[#E65100] font-black uppercase tracking-widest text-[10px] md:text-xs mb-1">Misi Selesai!</h2>
                        <h1 className="text-2xl md:text-3xl font-black text-[#37474F] tracking-tight">Luar Biasa!</h1>
                     </div>
                    
                    <div className="text-[#5D4037] text-sm md:text-base leading-relaxed font-medium bg-[#FFF3E0] p-3 rounded-xl border-2 border-[#FFE0B2] mb-3 md:mb-5">
                        <p>Kamu telah menaklukkan bab <span className="text-[#E65100] font-black">{category?.name}</span>.</p>
                        <p className="text-xs md:text-sm mt-1 opacity-80 font-bold">Siap untuk tantangan berikutnya?</p>
                    </div>

                    <div className="space-y-2 md:space-y-3 pt-1">
                        {/* Quiz Button (Primary) */}
                        <Link href="/quizzes" className="block w-full relative group transform transition-all duration-100 active:scale-95">
                            <div className="absolute inset-0 bg-[#D84315] rounded-xl translate-y-1"></div>
                            <div className="relative bg-[#FF7043] hover:bg-[#FF5722] text-white py-2.5 md:py-3 rounded-xl font-black text-base md:text-lg border-b-4 border-[#BF360C] shadow-md flex items-center justify-center gap-2 uppercase tracking-wider group-active:translate-y-1 group-active:border-b-0 transition-all">
                                <span>🚀</span> Uji Kemampuan (Quiz)
                            </div>
                        </Link>

                        {/* Back Button (Secondary) */}
                        <Link href="/materials" className="block w-full relative group transform transition-all duration-100 active:scale-95">
                             <div className="absolute inset-0 bg-[#8D6E63] rounded-xl translate-y-1"></div>
                             <div className="relative bg-[#D7CCC8] hover:bg-[#BCAAA4] text-[#5D4037] py-2 md:py-2.5 rounded-xl font-bold text-sm md:text-base border-b-4 border-[#5D4037] shadow-md flex items-center justify-center gap-2 group-active:translate-y-1 group-active:border-b-0 transition-all">
                                Kembali ke Menu
                             </div>
                        </Link>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW STATE: PLAYING (DUAL FLIP CARD MODE) */}
        {viewState === 'playing' && currentMaterial && (
            <div className="relative w-full max-w-5xl mx-auto flex-1 flex flex-col md:flex-row gap-4 md:gap-8 min-h-0 my-4 perspective-1000">
                
                {/* --- LEFT CARD (Image <-> Example 2) --- */}
                <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="relative w-full md:w-1/2 h-full cursor-pointer group"
                >
                    <div 
                        className={cn(
                            "w-full h-full relative transition-all duration-700 ease-in-out [transform-style:preserve-3d]",
                            isFlipped ? "[transform:rotateY(180deg)]" : ""
                        )}
                    >
                        {/* FRONT: Image */}
                        <div 
                            className={cn(
                                "absolute inset-0 w-full h-full bg-white rounded-[2.5rem] shadow-xl border-[6px] border-[#8D6E63] overflow-hidden [backface-visibility:hidden] flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-white to-[#FFF3E0]",
                                isFlipped ? "pointer-events-none" : ""
                            )}
                        >
                            <div className="relative w-full h-full p-4 flex items-center justify-center">
                                {/* Decorative floating icon */}
                                <div className="absolute top-0 right-0 p-3 bg-orange-100 rounded-full text-orange-500 opacity-50">
                                    <BookOpen size={24} />
                                </div>
                                
                                {currentMaterial.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={currentMaterial.image_url} 
                                        alt={currentMaterial.title} 
                                        className="w-full h-full object-contain drop-shadow-lg transform transition-transform group-hover:scale-105 duration-500" 
                                    />
                                ) : (
                                    <div className="text-gray-300 text-8xl font-black opacity-20">?</div>
                                )}
                            </div>
                            
                            {/* Tap Hint */}
                            <div className="absolute bottom-6 text-[#8D6E63]/50 text-sm font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                <RotateCw size={16} /> Balik Kartu
                            </div>
                        </div>

                        {/* BACK: Example 2 */}
                        <div 
                            className={cn(
                                "absolute inset-0 w-full h-full bg-[#FFF8E1] rounded-[2.5rem] shadow-xl border-[6px] border-[#8D6E63] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col p-6 md:p-8",
                                !isFlipped ? "pointer-events-none" : ""
                            )}
                        >
                             <div className="flex justify-between items-center mb-6 border-b-2 border-[#FFE0B2] pb-4">
                                <span className="text-sm font-black text-[#FFB74D] uppercase tracking-wider">Contoh 2 (Tambahan)</span>
                                {currentMaterial.example_sentence_2 && (
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); speakArabic(currentMaterial.example_sentence_2 || ''); }}
                                        className="p-3 text-white bg-[#E65100] rounded-full shadow-lg border-2 border-white hover:bg-[#EF6C00] transition-transform active:scale-95"
                                    >
                                        <Volume2 size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-center text-center py-2">
                                {currentMaterial.example_sentence_2 ? (
                                    <>
                                        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3E2723] leading-tight font-arabic mb-3 sm:mb-6" dir="rtl">
                                            {currentMaterial.example_sentence_2}
                                        </p>
                                        <div className="bg-white/50 p-2.5 sm:p-4 rounded-xl border border-[#FFE0B2]">
                                            <p className="text-sm sm:text-lg font-bold text-[#E65100] mb-0.5 sm:mb-2 italic">
                                                {currentMaterial.example_reading_2}
                                            </p>
                                            <p className="text-[#5D4037] font-medium text-xs sm:text-base">
                                                "{currentMaterial.example_meaning_2 || '-'}"
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-50 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-[#FFE0B2] rounded-full flex items-center justify-center mb-4 text-[#E65100]">
                                            <BookOpen size={32} />
                                        </div>
                                        <p className="font-bold text-[#8D6E63] text-lg">Hanya ada satu contoh.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT CARD (Text <-> Example 1) --- */}
                <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="relative w-full md:w-1/2 h-full cursor-pointer group"
                >
                    <div 
                        className={cn(
                            "w-full h-full relative transition-all duration-700 ease-in-out [transform-style:preserve-3d]",
                            isFlipped ? "[transform:rotateY(180deg)]" : ""
                        )}
                    >
                        {/* FRONT: Text */}
                        <div 
                            className={cn(
                                "absolute inset-0 w-full h-full bg-white rounded-[2.5rem] shadow-xl border-[6px] border-[#8D6E63] overflow-hidden [backface-visibility:hidden] flex flex-col items-center justify-center p-6 md:p-8 relative",
                                isFlipped ? "pointer-events-none" : ""
                            )}
                        >
                             <button 
                                onClick={(e) => { e.stopPropagation(); speakArabic(currentMaterial.arabic_text); }}
                                className="absolute top-6 right-6 p-4 text-white bg-[#E65100] rounded-full shadow-lg border-4 border-white hover:bg-[#EF6C00] transition-transform active:scale-95 z-20"
                                title="Dengarkan"
                             >
                                <Volume2 size={28} />
                             </button>

                            <div className="flex-1 flex flex-col justify-center items-center w-full">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#3E2723] leading-tight drop-shadow-sm font-arabic mb-6 md:mb-8 text-center">
                                    {currentMaterial.arabic_text}
                                </h1>
                                <div className="bg-[#FFF3E0] px-6 py-2.5 rounded-full border border-[#FFE0B2] mb-4 transform group-hover:scale-105 transition-transform">
                                    <p className="text-lg md:text-xl font-bold text-[#E65100] tracking-wide lowercase">
                                        {currentMaterial.reading || '-'}
                                    </p>
                                </div>
                                <p className="text-[#5D4037] font-bold text-2xl md:text-3xl capitalize mt-2 border-b-4 border-[#FFE0B2] pb-1">
                                    {currentMaterial.translation}
                                </p>
                            </div>
                        </div>

                        {/* BACK: Example 1 */}
                        <div 
                            className={cn(
                                "absolute inset-0 w-full h-full bg-[#FFF8E1] rounded-[2.5rem] shadow-xl border-[6px] border-[#8D6E63] overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col p-6 md:p-8",
                                !isFlipped ? "pointer-events-none" : ""
                            )}
                        >
                            <div className="flex justify-between items-center mb-6 border-b-2 border-[#FFE0B2] pb-4">
                                <span className="text-sm font-black text-[#FFB74D] uppercase tracking-wider">Contoh 1 (Utama)</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); speakArabic(currentMaterial.example_sentence || ''); }}
                                    className="p-3 text-white bg-[#E65100] rounded-full shadow-lg border-2 border-white hover:bg-[#EF6C00] transition-transform active:scale-95"
                                >
                                    <Volume2 size={20} />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col justify-center text-center py-2">
                                {currentMaterial.example_sentence ? (
                                    <>
                                        <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3E2723] leading-tight font-arabic mb-3 sm:mb-6" dir="rtl">
                                            {currentMaterial.example_sentence}
                                        </p>
                                        <div className="bg-white/50 p-2.5 sm:p-4 rounded-xl border border-[#FFE0B2]">
                                            <p className="text-sm sm:text-lg font-bold text-[#E65100] mb-0.5 sm:mb-2 italic">
                                                {currentMaterial.example_reading}
                                            </p>
                                            <p className="text-[#5D4037] font-medium text-xs sm:text-base">
                                                "{currentMaterial.example_meaning || '-'}"
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-50">Belum ada contoh.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>

      {/* Navigation Controls (Only in playing state) */}
      {viewState === 'playing' && (
        <div className="pb-6 px-6 max-w-lg mx-auto w-full flex items-center justify-between gap-4 shrink-0 z-20">
            <button 
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="w-16 h-16 bg-[#FFF8E1] rounded-2xl border-b-[6px] border-[#FFB300] shadow-lg flex items-center justify-center text-[#F57F17] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFFDE7] active:border-b-0 active:translate-y-[6px] transition-all"
            >
                <ChevronLeft size={36} strokeWidth={3} />
            </button>
            
            <div className="px-4 py-2 md:px-6 md:py-3 bg-[#3E2723] rounded-full border-4 border-[#8D6E63] shadow-lg whitespace-nowrap">
                <span className="font-black text-[#FFECB3] text-lg md:text-2xl tracking-widest leading-none flex items-center justify-center">
                    {currentIndex + 1} <span className="text-[#A1887F] text-sm md:text-xl mx-1">/</span> {materials.length}
                </span>
            </div>

            <button 
                onClick={nextSlide}
                className="h-16 px-6 bg-gradient-to-b from-[#FF7043] to-[#F4511E] rounded-2xl border-b-[6px] border-[#BF360C] shadow-lg flex items-center justify-center gap-2 text-white font-black text-xl hover:brightness-110 active:border-b-0 active:translate-y-[6px] transition-all disabled:opacity-50"
            >
                {currentIndex === materials.length - 1 ? (
                    <span className="uppercase tracking-wider">Selesai</span>
                ) : (
                    <ChevronRight size={36} strokeWidth={3} />
                )}
            </button>
        </div>
      )}
    </div>
  )
}
