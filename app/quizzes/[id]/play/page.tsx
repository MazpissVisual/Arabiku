'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Quiz, Question } from '@/lib/types'
import { Loader2, X, Check, Trophy, RotateCcw, Home, Gamepad2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import confetti from 'canvas-confetti'

export default function QuizPlay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  // Data State
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  
  // Game State
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(1) // Avoid division by zero
  const [showTimeUp, setShowTimeUp] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState, timeLeft])

  const handleTimeUp = () => {
    setShowTimeUp(true)
    setTimeout(() => {
        setGameState('result')
        setShowTimeUp(false)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    async function init() {
      const { data: qz } = await supabase.from('quizzes').select('*').eq('id', id).single()
      if (qz) setQuiz(qz)

      const { data: qs } = await supabase.from('questions').select('*').eq('quiz_id', id)
      if (qs && qs.length > 0) {
          const shuffled = [...qs].sort(() => Math.random() - 0.5)
          setQuestions(shuffled)
      }
      setLoading(false)
    }
    init()
  }, [id])

  const handleStart = () => {
    const time = questions.length * 120 // 2 minutes per question
    setTimeLeft(time)
    setTotalTime(time)
    setGameState('playing')
  }

  const handleAnswer = (option: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(option)
    setIsAnswered(true)

    const currentQ = questions[currentIndex]
    const isCorrect = option === currentQ.correct_answer

    if (isCorrect) {
        setCorrectCount(c => c + 1)
        confetti({
           particleCount: 50,
           spread: 60,
           origin: { y: 0.8 },
           colors: ['#2a9d8f', '#e9c46a']
        })
    }

    // Auto next after delay
    setTimeout(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(i => i + 1)
            setSelectedAnswer(null)
            setIsAnswered(false)
        } else {
            setGameState('result')
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            })
        }
    }, 1500)
  }

  if (loading) {
    return (
        <div className="h-screen relative flex items-center justify-center p-6 bg-[url('/bg-main.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/20 z-0 fixed"></div>
            <Loader2 className="animate-spin text-[#FBC02D] relative z-10" size={60} />
        </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
        <div className="h-screen relative flex flex-col items-center justify-center p-6 text-center bg-[url('/bg-main.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40 z-0 fixed"></div>
            <div className="relative z-10 bg-[#FFF9C4] p-10 rounded-[3rem] border-4 border-[#FBC02D] shadow-2xl max-w-sm w-full">
                <div className="w-24 h-24 bg-[#FBC02D] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                    <Gamepad2 size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-[#E65100] uppercase mb-2">KUIS KOSONG</h2>
                <p className="text-[#F57F17] font-bold mb-8">Maaf, belum ada soal tersedia.</p>
                <Link href="/quizzes" className="inline-block bg-[#E65100] text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all">
                  KEMBALI
                </Link>
            </div>
        </div>
    )
  }

  // --- Intro Screen ---
  if (gameState === 'intro') {
      return (
          <div className="h-screen relative flex flex-col items-center justify-center p-4 text-center bg-[url('/bg-main.jpg')] bg-cover bg-center overflow-hidden">
              <div className="absolute inset-0 bg-black/20 z-0 fixed"></div>
              
              <div className="relative z-10 w-full max-w-xl scale-[0.9] md:scale-100 origin-center">
                  <div className="bg-[#FFF9C4] px-6 py-4 rounded-[2rem] border-4 border-[#FBC02D] shadow-2xl mb-4 transform -rotate-1 mx-auto w-fit">
                      <h1 className="text-3xl md:text-5xl font-black text-[#E65100] uppercase tracking-wide drop-shadow-sm mb-1">
                          {quiz.title}
                      </h1>
                      <div className="inline-block bg-[#FBC02D] px-4 py-1.5 rounded-full border-2 border-white">
                        <p className="text-white font-black text-lg leading-none">{questions.length} SOAL SIAP!</p>
                      </div>
                  </div>

                  <div className="relative group max-w-sm mx-auto">
                      <div className="absolute inset-0 bg-[#E65100] rounded-[2.5rem] translate-y-2 opacity-60"></div>
                      <div className="absolute inset-0 bg-[#FFB300] rounded-[2.5rem] translate-y-1.5 border-b-6 border-[#E65100]"></div>
                      
                      <div className="relative bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4] border-4 border-[#FFFFFF] rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center shadow-inner">
                          <div className="w-24 h-24 bg-[#FBC02D] rounded-full flex items-center justify-center shadow-lg mb-6 border-4 border-white animate-bounce">
                              <span className="text-5xl drop-shadow-md">🚀</span>
                          </div>
                          
                          <div className="w-full space-y-3">
                              <button 
                                onClick={handleStart}
                                className="w-full bg-[#E65100] hover:bg-[#BF360C] text-white py-4 rounded-2xl font-black text-xl shadow-lg transform active:scale-95 transition-all uppercase tracking-widest border-b-4 border-black/20"
                              >
                                  MULAI BELAJAR 🚀
                              </button>
                              
                              <Link href="/quizzes" className="block text-[#F57F17] font-black text-base hover:text-[#E65100] transition-colors pt-1">
                                  KEMBALI KE MENU
                              </Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )
  }

  // --- Result Screen ---
  if (gameState === 'result') {
      const finalScore = Math.round((correctCount / questions.length) * 100)
      let message = "Terus Belajar!"
      let emotion = "💪"
      if (finalScore >= 80) { message = "Luar Biasa!"; emotion = "👑" }
      else if (finalScore >= 60) { message = "Bagus Sekali!"; emotion = "⭐" }

      return (
          <div className="h-screen relative flex flex-col items-center justify-center p-4 text-center bg-[url('/bg-main.jpg')] bg-cover bg-center overflow-hidden">
              <div className="absolute inset-0 bg-black/30 z-0 fixed"></div>
              
              <div className="relative z-10 w-full max-w-lg scale-[0.9] md:scale-100 origin-center">
                  <div className="absolute inset-0 bg-[#E65100] rounded-[3rem] translate-y-3 opacity-60"></div>
                  <div className="absolute inset-0 bg-[#FFB300] rounded-[3rem] translate-y-2 border-b-8 border-[#E65100]"></div>
                  
                  <div className="relative bg-[#FFF9C4] p-8 md:p-10 rounded-[3rem] border-4 border-white shadow-inner flex flex-col items-center">
                      <div className="relative mb-6">
                          <div className="absolute inset-0 bg-[#FBC02D] blur-3xl opacity-40 animate-pulse"></div>
                          <div className="relative w-28 h-28 bg-[#FBC02D] rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                            <Trophy size={56} className="text-white drop-shadow-lg" />
                            <span className="absolute -top-3 -right-3 text-4xl animate-bounce">{emotion}</span>
                          </div>
                      </div>
                      
                      <h2 className="text-5xl font-black text-[#E65100] mb-1 drop-shadow-sm leading-none">{finalScore}</h2>
                      <p className="text-[#F57F17] font-black text-lg mb-8 uppercase tracking-widest">{message}</p>
                      
                      <div className="w-full space-y-3">
                          <button 
                            onClick={() => window.location.reload()}
                            className="w-full bg-white hover:bg-gray-50 text-[#E65100] font-black py-3.5 rounded-2xl border-2 border-[#FBC02D] shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                          >
                              <RotateCcw size={22} strokeWidth={3} /> ULANGI KUIS
                          </button>
                          
                          <Link href="/quizzes" className="block w-full">
                            <button className="w-full bg-[#E65100] hover:bg-[#BF360C] text-white font-black py-3.5 rounded-2xl border-b-4 border-black/20 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                                <Home size={22} strokeWidth={3} /> KEMBALI KE MENU
                            </button>
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      )
  }

  // --- Playing Screen ---
  const currentQ = questions[currentIndex]
  
  return (
    <div className="h-screen relative flex flex-col p-4 bg-[url('/bg-main.jpg')] bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-black/10 z-0 fixed"></div>

      <div className="relative z-10 flex flex-col flex-1 h-full max-w-3xl mx-auto w-full origin-top scale-[0.95] md:scale-100">
        {/* Header Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-3 mb-4 w-full shrink-0">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowExitConfirm(true)}>
                  <div className="bg-[#FFF9C4] p-2.5 rounded-xl border-2 border-[#FBC02D] text-[#E65100] shadow-md active:scale-90 transition-all">
                      <X size={20} className="md:size-6" strokeWidth={3} />
                  </div>
              </button>
              <div className="bg-[#FFF9C4]/90 px-4 py-1.5 rounded-xl border-2 border-[#FBC02D] shadow-md flex items-center gap-2">
                  <Star className="text-[#E65100]" size={18} fill="currentColor" strokeWidth={3} />
                  <span className="text-lg font-black text-[#E65100]">{Math.round((correctCount / questions.length) * 100)}</span>
              </div>
            </div>

            {/* Timer Display (Center on Mobile & Desktop) */}
            <div className="col-span-2 md:col-start-2 md:col-span-1 order-3 md:order-2">
                 <div className="bg-[#FFF9C4] p-1.5 rounded-full border-2 border-[#FBC02D] shadow-md relative flex items-center h-8">
                    <div className="h-full bg-[#FBC02D]/20 rounded-full overflow-hidden flex-1 relative min-w-[100px]">
                        <div 
                            className={cn(
                                "h-full transition-all duration-1000 ease-linear border-r-2 border-white",
                                (timeLeft / totalTime) < 0.2 
                                    ? "bg-red-500 animate-pulse" 
                                    : "bg-gradient-to-r from-[#FFEB3B] to-[#FBC02D]"
                            )}
                            style={{ width: `${(timeLeft / totalTime) * 100}%` }}
                        ></div>
                    </div>
                    
                    <div className={cn(
                        "absolute left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full border-2 border-white text-white font-black text-xs shadow-md min-w-[60px] text-center transition-colors",
                        (timeLeft / totalTime) < 0.2 ? "bg-red-600 scale-110" : "bg-[#E65100]"
                    )}>
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end order-2 md:order-3">
                 <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                    <span className="text-white font-black text-xs uppercase opacity-90 whitespace-nowrap">
                        Soal {currentIndex + 1}/{questions.length}
                    </span>
                 </div>
            </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col w-full min-h-0 justify-center">
            {/* Question Card */}
            <div className="relative group mb-6 shrink-0">
                {/* 3D Depth */}
                <div className="absolute inset-0 bg-[#E65100] translate-y-3 opacity-60 rounded-[3rem]"></div>
                <div className="absolute inset-0 bg-[#FFB300] translate-y-2 border-b-8 border-[#E65100] rounded-[3rem]"></div>

                <div className="relative bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4] rounded-[3rem] p-8 md:p-10 border-4 border-white shadow-inner flex items-center justify-center min-h-[180px] md:min-h-[220px] text-center">
                    <h2 className="text-2xl md:text-4xl font-black text-[#E65100] leading-tight uppercase tracking-tight">
                        {currentQ.question_text}
                    </h2>
                    <div className="absolute top-4 left-10 w-16 h-8 bg-white/40 rounded-full rotate-[-20deg] blur-[2px]"></div>
                </div>
            </div>

            {/* Answers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-4">
                {['a', 'b', 'c', 'd'].map((optKey) => {
                    const optionText = (currentQ as any)[`option_${optKey}`]
                    const isSelected = selectedAnswer === optKey
                    const isCorrectAnswer = currentQ.correct_answer === optKey
                    
                    let depthColor = "bg-[#E65100]"
                    let faceColor = "bg-gradient-to-b from-[#FFFDE7] to-[#FFF9C4]"
                    let textColor = "text-[#E65100]"
                    let borderColor = "border-white"
                    let bottomBorder = "border-[#FBC02D]"
                    
                    if (isAnswered) {
                        if (isCorrectAnswer) {
                            depthColor = "bg-green-700"
                            faceColor = "bg-green-500"
                            textColor = "text-white"
                            borderColor = "border-green-300"
                            bottomBorder = "border-green-700"
                        } else if (isSelected && !isCorrectAnswer) {
                            depthColor = "bg-red-700"
                            faceColor = "bg-red-500"
                            textColor = "text-white"
                            borderColor = "border-red-300"
                            bottomBorder = "border-red-700"
                        } else {
                            depthColor = "bg-gray-200"
                            faceColor = "bg-gray-100"
                            textColor = "text-gray-300"
                            borderColor = "border-gray-50"
                            bottomBorder = "border-gray-200"
                        }
                    } else if (isSelected) {
                        depthColor = "bg-[#BF360C]"
                        faceColor = "bg-[#E65100]"
                        textColor = "text-white"
                        borderColor = "border-[#FFCCBC]"
                        bottomBorder = "border-[#BF360C]"
                    }

                    const hoverClass = !isAnswered ? "hover:-translate-y-1 hover:rotate-1 hover:scale-[1.02]" : ""

                    return (
                        <button
                          key={optKey}
                          onClick={() => handleAnswer(optKey)}
                          disabled={isAnswered}
                          className={cn(
                              "relative group/btn transform transition-all duration-200 active:scale-95",
                              hoverClass
                          )}
                        >
                            <div className={cn("absolute inset-0 translate-y-1.5 rounded-2xl opacity-60", depthColor)}></div>
                            <div className={cn("absolute inset-0 translate-y-1 rounded-2xl border-b-6", bottomBorder)}></div>
                            
                            <div className={cn(
                                "relative py-5 px-8 rounded-2xl font-black text-xl border-4 flex items-center justify-between transition-all",
                                faceColor, textColor, borderColor
                            )}>
                                <span className="flex-1 text-left line-clamp-2 pr-4">{optionText}</span>
                                <div className="flex-shrink-0">
                                    {isAnswered && isCorrectAnswer && <Check className="text-white drop-shadow-md" size={32} strokeWidth={4} />}
                                    {isAnswered && isSelected && !isCorrectAnswer && <X className="text-white drop-shadow-md" size={32} strokeWidth={4} />}
                                </div>
                                {!isAnswered && <div className="absolute top-2 left-4 w-8 h-4 bg-white/30 rounded-full rotate-[-20deg] blur-[1px]"></div>}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Time's Up Popup */}
      {showTimeUp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/40 animate-in fade-in duration-300">
              <div className="bg-[#FFF9C4] p-10 rounded-[3rem] border-4 border-[#FBC02D] shadow-2xl max-w-sm w-full text-center scale-up-center">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg animate-bounce">
                      <X size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-[#E65100] uppercase mb-2">WAKTU HABIS!</h2>
                  <p className="text-[#F57F17] font-bold mb-4">Yah, waktunya sudah habis. Ayo lihat skormu!</p>
              </div>
          </div>
      )}

      {/* Custom Exit Confirmation Modal */}
      {showExitConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 backdrop-blur-sm bg-black/60 animate-in fade-in duration-300">
              <div className="bg-[#FFF9C4] p-8 md:p-10 rounded-[3rem] border-4 border-[#FBC02D] shadow-2xl max-w-md w-full text-center scale-up-center relative overflow-hidden">
                  <div className="w-20 h-20 bg-[#FBC02D] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                      <Gamepad2 size={40} className="text-white" />
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-[#E65100] uppercase mb-3 leading-tight">YAKIN INGIN KELUAR?</h2>
                  <p className="text-[#F57F17] font-bold mb-8">Yah, sayang banget kalau berhenti sekarang. Skormu tidak akan disimpan lho!</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                         onClick={() => setShowExitConfirm(false)}
                         className="flex-1 bg-white hover:bg-gray-50 text-[#F57F17] font-extrabold py-3.5 rounded-2xl border-2 border-[#FBC02D] transition-all active:scale-95"
                      >
                          BATAL
                      </button>
                      <button 
                         onClick={() => router.push('/quizzes')}
                         className="flex-1 bg-[#E65100] hover:bg-[#BF360C] text-white font-extrabold py-3.5 rounded-2xl border-b-4 border-black/20 shadow-lg transition-all active:scale-95"
                      >
                          YA, KELUAR
                      </button>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-8 w-12 h-6 bg-white/40 rounded-full rotate-[-20deg] blur-[2px]"></div>
              </div>
          </div>
      )}

      <style jsx global>{`
        .border-b-6 { border-bottom-width: 6px; }
        .scale-up-center {
            animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
        }
        @keyframes scale-up-center {
            0% { transform: scale(0.5); }
            100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
