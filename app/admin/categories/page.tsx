'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Plus, Trash2, Edit2, Save, X, Layers, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Category } from '@/lib/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  
  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error('Gagal memuat kategori')
    } else {
      setCategories(data || [])
    }
    setLoading(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    setIsCreating(true)
    const slug = newCategoryName.toLowerCase().replace(/ /g, '-')
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{ 
          name: newCategoryName, 
          slug, 
          description: newCategoryDescription 
      }])
      .select()
      .single()

    if (error) {
      toast.error('Gagal membuat kategori: ' + error.message)
    } else {
      toast.success('Kategori berhasil dibuat')
      setCategories([data, ...categories])
      setNewCategoryName('')
      setNewCategoryDescription('')
    }
    setIsCreating(false)
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditDescription(category.description || '')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditDescription('')
  }

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return

    const slug = editName.toLowerCase().replace(/ /g, '-')
    
    const { error } = await supabase
      .from('categories')
      .update({ 
          name: editName, 
          slug, 
          description: editDescription 
      })
      .eq('id', id)

    if (error) {
      toast.error('Gagal update kategori: ' + error.message)
    } else {
      toast.success('Kategori berhasil diperbarui')
      setCategories(categories.map(c => c.id === id ? { ...c, name: editName, slug, description: editDescription } : c))
      setEditingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah anda yakin ingin menghapus kategori ini? Semua materi dalam kategori ini mungkin akan error atau hilang.')) return

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Gagal menghapus: Kategori mungkin sedang digunakan oleh materi.')
    } else {
      toast.success('Kategori berhasil dihapus')
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 rounded-xl text-[#e76f51]">
            <Layers size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Kategori</h1>
            <p className="text-gray-500">Buat, ubah, dan hapus kategori materi</p>
        </div>
      </div>

      {/* Add New Category Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah Kategori Baru</h2>
        <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex gap-4">
                <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nama Kategori (contoh: Hewan)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
                <button 
                    type="submit" 
                    disabled={isCreating || !newCategoryName}
                    className="bg-[#e76f51] hover:bg-[#d05d40] text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={20} />
                    Tambah
                </button>
            </div>
            <textarea 
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Deskripsi Kategori (opsional)"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
            />
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-600 w-1/4">Nama & Deskripsi</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 w-1/4 text-center">Slug</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 text-right w-1/6">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Memuat data...</td>
                        </tr>
                    ) : categories.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Belum ada kategori.</td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50/50 transition-colors align-top">
                                <td className="px-6 py-4">
                                    {editingId === category.id ? (
                                        <div className="space-y-2">
                                            <input 
                                                type="text" 
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-lg border border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-gray-900"
                                                autoFocus
                                            />
                                            <textarea 
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-lg border border-gray-400 focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-gray-900 text-sm resize-none"
                                                rows={2}
                                                placeholder="Deskripsi..."
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{category.name}</span>
                                            <span className="text-xs text-gray-500 line-clamp-2 mt-1">{category.description || '-'}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-500 font-mono">
                                        {category.slug || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {editingId === category.id ? (
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleUpdate(category.id)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Simpan"
                                            >
                                                <Save size={18} />
                                            </button>
                                            <button 
                                                onClick={handleCancelEdit}
                                                className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                                                title="Batal"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(category)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
        <AlertCircle size={18} className="shrink-0 mt-0.5" />
        <p>Perhatian: Mengubah nama kategori akan otomatis mengubah slug URL. Menghapus kategori dapat menyebabkan error pada materi yang menggunakannya kecuali materi tersebut dipindahkan atau dihapus terlebih dahulu.</p>
      </div>
    </div>
  )
}
