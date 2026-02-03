'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Quiz, Question } from '@/lib/types'
import { ArrowLeft, Plus, Save, Trash2, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function QuizDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  
  // New Question Form State
  const [qText, setQText] = useState('')
  const [optA, setOptA] = useState('')
  const [optB, setOptB] = useState('')
  const [optC, setOptC] = useState('')
  const [optD, setOptD] = useState('')
  const [correct, setCorrect] = useState<'a'|'b'|'c'|'d'>('a')
  const [addingQ, setAddingQ] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      // Fetch Quiz Info
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single()
      
      if (quizError) throw quizError
      setQuiz(quizData)

      // Fetch Questions
      const { data: qData, error: qError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id)
        .order('created_at', { ascending: true })

      if (qData) setQuestions(qData)
    } catch (error: any) {
        toast.error('Gagal memuat data: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingQ(true)

    try {
        const { data, error } = await supabase.from('questions').insert({
            quiz_id: parseInt(id),
            question_text: qText,
            option_a: optA,
            option_b: optB,
            option_c: optC,
            option_d: optD,
            correct_answer: correct
        }).select().single()

        if (error) throw error

        setQuestions([...questions, data])
        toast.success('Soal berhasil ditambahkan')
        
        // Reset form
        setQText('')
        setOptA('')
        setOptB('')
        setOptC('')
        setOptD('')
        setCorrect('a')
    } catch (error: any) {
        toast.error('Gagal menambah soal: ' + error.message)
    } finally {
        setAddingQ(false)
    }
  }

  const handleDeleteQuestion = async (qId: number) => {
      if(!confirm("Hapus soal ini?")) return
      try {
          const { error } = await supabase.from('questions').delete().eq('id', qId)
          if (error) throw error
          setQuestions(questions.filter(q => q.id !== qId))
          toast.success("Soal dihapus")
      } catch (error: any) {
          toast.error(error.message)
      }
  }

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#e76f51]" /></div>
  }

  if (!quiz) return <div>Kuis tidak ditemukan</div>

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <Link href="/admin/quizzes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft size={16} /> Kembali ke Daftar Kuis
        </Link>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
                <p className="text-gray-500 mt-1">{quiz.description}</p>
            </div>
            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium text-sm">
                {questions.length} Soal
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Add Question */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-[#e76f51]" /> Tambah Soal
                </h2>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Pertanyaan</label>
                        <textarea 
                            value={qText}
                            onChange={e => setQText(e.target.value)}
                            className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-400 focus:border-[#e76f51] outline-none text-sm resize-none text-gray-900 placeholder-gray-400"
                            rows={3}
                            placeholder="Tulis pertanyaan..."
                            required
                        />
                    </div>

                    <div className="space-y-3">
                         <label className="text-xs font-semibold text-gray-500 uppercase">Pilihan Jawaban</label>
                         {['a', 'b', 'c', 'd'].map((opt) => (
                             <div key={opt} className="flex items-center gap-2">
                                 <div className={cn(
                                     "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                     correct === opt ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500 cursor-pointer"
                                 )} onClick={() => setCorrect(opt as any)}>
                                     {opt.toUpperCase()}
                                 </div>
                                 <input 
                                    type="text"
                                    value={opt === 'a' ? optA : opt === 'b' ? optB : opt === 'c' ? optC : optD}
                                    onChange={e => {
                                        if(opt === 'a') setOptA(e.target.value)
                                        if(opt === 'b') setOptB(e.target.value)
                                        if(opt === 'c') setOptC(e.target.value)
                                        if(opt === 'd') setOptD(e.target.value)
                                    }}
                                    className={cn(
                                        "flex-1 px-3 py-2 rounded-md border text-sm outline-none text-gray-900 placeholder-gray-400",
                                        correct === opt ? "border-green-500 bg-green-50/50" : "border-gray-400"
                                    )}
                                    placeholder={`Pilihan ${opt.toUpperCase()}`}
                                    required
                                 />
                             </div>
                         ))}
                    </div>

                    <div className="pt-2">
                         <p className="text-xs text-gray-400 mb-2">* Klik huruf (A/B/C/D) untuk set kunci jawaban.</p>
                         <button 
                            type="submit" 
                            disabled={addingQ}
                            className="w-full bg-[#2a9d8f] hover:bg-[#21867a] text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                         >
                             {addingQ ? <Loader2 className="animate-spin" size={16} /> : 'Tambah ke Kuis'}
                         </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Right Column: List of Questions */}
        <div className="lg:col-span-2 space-y-4">
            {questions.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400">
                    <p>Belum ada soal ditambahkan.</p>
                </div>
            ) : (
                questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-5 rounded-xl border border-gray-100 flex gap-4 group hover:border-orange-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {idx + 1}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-800 mb-3">{q.question_text}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className={cn("px-3 py-1.5 rounded-lg", q.correct_answer === 'a' ? "bg-green-100 text-green-700 font-medium" : "bg-gray-50 text-gray-500")}>
                                    A. {q.option_a}
                                </div>
                                <div className={cn("px-3 py-1.5 rounded-lg", q.correct_answer === 'b' ? "bg-green-100 text-green-700 font-medium" : "bg-gray-50 text-gray-500")}>
                                    B. {q.option_b}
                                </div>
                                <div className={cn("px-3 py-1.5 rounded-lg", q.correct_answer === 'c' ? "bg-green-100 text-green-700 font-medium" : "bg-gray-50 text-gray-500")}>
                                    C. {q.option_c}
                                </div>
                                <div className={cn("px-3 py-1.5 rounded-lg", q.correct_answer === 'd' ? "bg-green-100 text-green-700 font-medium" : "bg-gray-50 text-gray-500")}>
                                    D. {q.option_d}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors self-start"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  )
}
