'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Quiz } from '@/lib/types'
import { Plus, Pencil, Trash2, Gamepad2, Loader2, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuizzes(data || [])
    } catch (error: any) {
      toast.error('Gagal memuat kuis: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah anda yakin ingin menghapus kuis ini beserta seluruh soalnya?')) return

    try {
        // Delete questions first (though cascade might handle this, let's be safe if not configured)
        await supabase.from('questions').delete().eq('quiz_id', id)
        
        const { error } = await supabase.from('quizzes').delete().eq('id', id)
        if (error) throw error
      
        setQuizzes(quizzes.filter(q => q.id !== id))
        toast.success('Kuis berhasil dihapus')
    } catch (error: any) {
      toast.error('Gagal menghapus: ' + error.message)
    }
  }

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#e76f51]" /></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Kuis</h1>
        <Link 
          href="/admin/quizzes/create" 
          className="bg-[#e76f51] hover:bg-[#d05d40] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} /> Buat Kuis Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-xl border border-gray-100 text-center text-gray-400">
                <Gamepad2 size={48} className="mx-auto mb-4 opacity-20" />
                <p>Belum ada kuis yang dibuat.</p>
            </div>
        ) : (
            quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                    <div className="h-32 bg-gradient-to-br from-orange-100 to-yellow-50 relative flex items-center justify-center">
                         {quiz.thumbnail_url ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={quiz.thumbnail_url} alt={quiz.title} className="w-full h-full object-cover" />
                         ) : (
                             <Trophy size={48} className="text-orange-200" />
                         )}
                         <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => handleDelete(quiz.id)}
                                className="p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-50"
                             >
                                 <Trash2 size={16} />
                             </button>
                         </div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{quiz.description || "Tidak ada deskripsi"}</p>
                        
                        <Link 
                            href={`/admin/quizzes/${quiz.id}`}
                            className="block w-full text-center bg-gray-50 hover:bg-[#f4a261] hover:text-white text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Kelola Soal
                        </Link>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  )
}
