'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Material } from '@/lib/types'
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          categories (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMaterials(data || [])
    } catch (error: any) {
      toast.error('Gagal memuat materi: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah anda yakin ingin menghapus materi ini?')) return

    try {
      const { error } = await supabase.from('materials').delete().eq('id', id)
      if (error) throw error
      
      setMaterials(materials.filter(m => m.id !== id))
      toast.success('Materi berhasil dihapus')
    } catch (error: any) {
      toast.error('Gagal menghapus: ' + error.message)
    }
  }

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" /></div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Materi</h1>
        <Link 
          href="/admin/materials/create" 
          className="bg-[#e76f51] hover:bg-[#d05d40] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus size={18} /> Tambah Materi
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Judul</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Kategori</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Arab</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Terjemahan</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Belum ada materi. Silakan tambah materi baru.
                  </td>
                </tr>
              ) : (
                materials.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                        {item.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                        ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                                <ImageIcon size={18} />
                            </div>
                        )}
                        {item.title}
                    </td>
                    <td className="px-6 py-4">{(item as any).categories?.name || '-'}</td>
                    <td className="px-6 py-4 font-arabic text-lg text-right w-32" dir="rtl">{item.arabic_text}</td>
                    <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{item.translation}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/materials/${item.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={16} />
                        </Link>
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
