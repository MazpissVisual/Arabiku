'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Quiz, Question } from '@/lib/types'
import { ArrowLeft, Plus, Save, Trash2, CheckCircle2, Loader2, Image as ImageIcon, GripVertical, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// DND Kit Imports
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// Sortable Item Component
function SortableQuestion({ 
    q, 
    idx, 
    onDelete,
    onEdit 
}: { 
    q: Question, 
    idx: number, 
    onDelete: (id: number) => void,
    onEdit: (q: Question) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: q.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: 'relative' as const,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className={cn(
                "bg-white p-5 rounded-xl border border-gray-100 flex gap-4 group hover:border-orange-200 transition-colors",
                isDragging ? "shadow-xl border-orange-200 ring-2 ring-orange-100" : "shadow-sm"
            )}
        >
            <div 
                {...attributes} 
                {...listeners} 
                className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 flex items-center shrink-0"
            >
                <GripVertical size={20} />
            </div>

            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                {idx + 1}
            </div>

            <div className="flex-1">
                <p className="font-medium text-gray-800 mb-3">{q.question_text}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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

            <div className="flex flex-col gap-2">
                <button 
                    onClick={() => onEdit(q)}
                    className="text-gray-300 hover:text-blue-500 transition-colors p-1"
                    title="Edit Soal"
                >
                    <Pencil size={18} />
                </button>
                <button 
                    onClick={() => onDelete(q.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Hapus Soal"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default function QuizDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  
  // Question Form State
  const [editingId, setEditingId] = useState<number | null>(null)
  const [qText, setQText] = useState('')
  const [optA, setOptA] = useState('')
  const [optB, setOptB] = useState('')
  const [optC, setOptC] = useState('')
  const [optD, setOptD] = useState('')
  const [correct, setCorrect] = useState<'a'|'b'|'c'|'d'>('a')
  const [qImage, setQImage] = useState('')
  const [qAudio, setQAudio] = useState('')
  const [optAImg, setOptAImg] = useState('')
  const [optBImg, setOptBImg] = useState('')
  const [optCImg, setOptCImg] = useState('')
  const [optDImg, setOptDImg] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

      // Fetch Questions ordered by order_index
      const { data: qData, error: qError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id)
        .order('order_index', { ascending: true })

      if (qData) setQuestions(qData)
    } catch (error: any) {
        toast.error('Gagal memuat data: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setQText('')
    setOptA('')
    setOptB('')
    setOptC('')
    setOptD('')
    setCorrect('a')
    setQImage('')
    setQAudio('')
    setOptAImg('')
    setOptBImg('')
    setOptCImg('')
    setOptDImg('')
  }

  const handleEditClick = (q: Question) => {
    setEditingId(q.id)
    setQText(q.question_text)
    setOptA(q.option_a)
    setOptB(q.option_b)
    setOptC(q.option_c)
    setOptD(q.option_d)
    setCorrect(q.correct_answer)
    setQImage(q.image_url || '')
    setQAudio(q.audio_url || '')
    setOptAImg(q.option_a_image || '')
    setOptBImg(q.option_b_image || '')
    setOptCImg(q.option_c_image || '')
    setOptDImg(q.option_d_image || '')
    
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
        if (editingId) {
            // Update Existing
            const { data, error } = await supabase.from('questions').update({
                question_text: qText,
                option_a: optA,
                option_b: optB,
                option_c: optC,
                option_d: optD,
                correct_answer: correct,
                image_url: qImage || null,
                audio_url: qAudio || null,
                option_a_image: optAImg || null,
                option_b_image: optBImg || null,
                option_c_image: optCImg || null,
                option_d_image: optDImg || null
            }).eq('id', editingId).select().single()

            if (error) throw error
            
            setQuestions(questions.map(q => q.id === editingId ? data : q))
            toast.success('Soal berhasil diperbarui')
        } else {
            // Add New
            const { data, error } = await supabase.from('questions').insert({
                quiz_id: parseInt(id),
                question_text: qText,
                option_a: optA,
                option_b: optB,
                option_c: optC,
                option_d: optD,
                correct_answer: correct,
                order_index: questions.length,
                image_url: qImage || null,
                audio_url: qAudio || null,
                option_a_image: optAImg || null,
                option_b_image: optBImg || null,
                option_c_image: optCImg || null,
                option_d_image: optDImg || null
            }).select().single()

            if (error) throw error

            setQuestions([...questions, data])
            toast.success('Soal berhasil ditambahkan')
        }
        
        resetForm()
    } catch (error: any) {
        toast.error('Gagal menyimpan soal: ' + error.message)
    } finally {
        setSubmitting(false)
    }
  }

  const handleDeleteQuestion = async (qId: number) => {
      if(!confirm("Hapus soal ini?")) return
      try {
          const { error } = await supabase.from('questions').delete().eq('id', qId)
          if (error) throw error
          
          setQuestions(questions.filter(q => q.id !== qId))
          if (editingId === qId) resetForm()
          
          toast.success("Soal dihapus")
      } catch (error: any) {
          toast.error(error.message)
      }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      const newQuestions = arrayMove(questions, oldIndex, newIndex);
      setQuestions(newQuestions);

      // Update in Supabase
      try {
        const updates = newQuestions.map((q, index) => ({
          id: q.id,
          order_index: index,
        }));

        const updatePromises = updates.map(u => 
            supabase.from('questions').update({ order_index: u.order_index }).eq('id', u.id)
        );
        
        const results = await Promise.all(updatePromises);
        const errors = results.filter(r => r.error);
        
        if (errors.length > 0) throw new Error("Beberapa urutan gagal disimpan");

        toast.success("Urutan berhasil diperbarui");
      } catch (error: any) {
        toast.error("Gagal menyimpan urutan: " + error.message);
        fetchData();
      }
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#e76f51]" /></div>
  }

  if (!quiz) return <div>Kuis tidak ditemukan</div>

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8 px-4 sm:px-0">
        <Link href="/admin/quizzes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2 transition-colors">
            <ArrowLeft size={16} /> Kembali ke Daftar Kuis
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
                <p className="text-gray-500 mt-1">{quiz.description}</p>
            </div>
            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium text-sm border border-orange-200">
                {questions.length} Soal
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
        {/* Left Column: Form Question */}
        <div className="lg:col-span-1">
            <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm border sticky top-4 transition-all duration-300",
                editingId ? "border-blue-200 ring-2 ring-blue-50" : "border-gray-100"
            )}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                        {editingId ? (
                            <><Pencil size={18} className="text-blue-500" /> Edit Soal</>
                        ) : (
                            <><Plus size={18} className="text-[#e76f51]" /> Tambah Soal</>
                        )}
                    </h2>
                    {editingId && (
                        <button 
                            onClick={resetForm}
                            className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                        >
                            <X size={14} /> Batal
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pertanyaan</label>
                        <textarea 
                            value={qText}
                            onChange={e => setQText(e.target.value)}
                            className="w-full px-3 py-2 mt-1 rounded-lg border border-gray-300 focus:border-[#e76f51] focus:ring-2 focus:ring-orange-100 outline-none text-sm resize-none text-gray-900 placeholder-gray-400 transition-all"
                            rows={3}
                            placeholder="Tulis pertanyaan..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">URL Gambar Soal</label>
                            <input 
                                type="text"
                                value={qImage}
                                onChange={e => setQImage(e.target.value)}
                                className="w-full px-3 py-1.5 mt-1 rounded-lg border border-gray-300 text-xs outline-none"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">URL Audio Soal</label>
                            <input 
                                type="text"
                                value={qAudio}
                                onChange={e => setQAudio(e.target.value)}
                                className="w-full px-3 py-1.5 mt-1 rounded-lg border border-gray-300 text-xs outline-none"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pilihan Jawaban</label>
                         {['a', 'b', 'c', 'd'].map((opt) => (
                             <div key={opt}>
                                 <div className="flex items-center gap-2">
                                     <div className={cn(
                                         "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                                         correct === opt ? "bg-green-500 text-white shadow-md scale-110" : "bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200"
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
                                            "flex-1 px-3 py-2 rounded-md border text-sm outline-none text-gray-900 placeholder-gray-400 transition-all",
                                            correct === opt ? "border-green-500 bg-green-50/30" : "border-gray-300 focus:border-orange-300"
                                        )}
                                        placeholder={`Teks Pilihan ${opt.toUpperCase()}`}
                                        required
                                     />
                                 </div>
                                 <div className="pl-9 pb-2">
                                    <input 
                                        type="text"
                                        value={opt === 'a' ? optAImg : opt === 'b' ? optBImg : opt === 'c' ? optCImg : optDImg}
                                        onChange={e => {
                                            if(opt === 'a') setOptAImg(e.target.value)
                                            if(opt === 'b') setOptBImg(e.target.value)
                                            if(opt === 'c') setOptCImg(e.target.value)
                                            if(opt === 'd') setOptDImg(e.target.value)
                                        }}
                                        className="w-full px-3 py-1 rounded border border-gray-200 text-[10px] outline-none"
                                        placeholder={`URL Gambar Pilihan ${opt.toUpperCase()} (Opsional)`}
                                    />
                                 </div>
                             </div>
                         ))}
                    </div>

                    <div className="pt-2">
                         <p className="text-[10px] text-gray-400 mb-3 italic">* Klik huruf (A/B/C/D) untuk mengatur kunci jawaban.</p>
                         <button 
                            type="submit" 
                            disabled={submitting}
                            className={cn(
                                "w-full text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-50",
                                editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-[#2a9d8f] hover:bg-[#21867a]"
                            )}
                         >
                             {submitting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? <Save size={16} /> : <Plus size={16} />)}
                             {submitting ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah ke Kuis')}
                         </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Right Column: List of Questions with DND */}
        <div className="lg:col-span-2">
            {questions.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center text-gray-400">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-medium">Belum ada soal ditambahkan.</p>
                    <p className="text-sm">Gunakan form di samping untuk mulai membuat soal.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 px-2 uppercase tracking-widest font-bold">
                        <span>Daftar Soal</span>
                        <span>Drag handle untuk urutkan</span>
                    </div>
                    
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext 
                            items={questions.map(q => q.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {questions.map((q, idx) => (
                                    <SortableQuestion 
                                        key={q.id} 
                                        q={q} 
                                        idx={idx} 
                                        onDelete={handleDeleteQuestion}
                                        onEdit={handleEditClick} 
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
