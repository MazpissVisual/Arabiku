'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function CreateQuizPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  // Optional: Thumbnail upload skipped for brevity, but easy to add similar to Materials

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
        const { data, error } = await supabase.from('quizzes').insert({
            title,
            description,
        }).select().single()

        if (error) throw error

        toast.success('Kuis berhasil dibuat!')
        router.push(`/admin/quizzes/${data.id}`) // Redirect to manage questions immediately
    } catch (error: any) {
        toast.error('Gagal menyimpan: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/quizzes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft size={16} /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Buat Kuis Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Kuis</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-gray-900 placeholder-gray-400"
                    placeholder="Contoh: Kuis Hewan Level 1"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi (Opsional)</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none resize-none text-gray-900 placeholder-gray-400"
                    placeholder="Deskripsi singkat tentang kuis ini..."
                />
            </div>

            <div className="pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#e76f51] hover:bg-[#d05d40] text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Simpan & Tambah Soal</>}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
