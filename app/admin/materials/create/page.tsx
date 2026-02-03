'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Category } from '@/lib/types'
import { ArrowLeft, Upload, Loader2, Save, Plus, X, ZoomIn, RotateCw } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/cropImage'

export default function CreateMaterialPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  // Form State
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [arabicText, setArabicText] = useState('')
  const [translation, setTranslation] = useState('')
  const [reading, setReading] = useState('')
  const [exampleSentence, setExampleSentence] = useState('')
  const [exampleReading, setExampleReading] = useState('')
  const [exampleMeaning, setExampleMeaning] = useState('')
  
  // Second Example
  const [exampleSentence2, setExampleSentence2] = useState('')
  const [exampleReading2, setExampleReading2] = useState('')
  const [exampleMeaning2, setExampleMeaning2] = useState('')

  const [imageUrl, setImageUrl] = useState('')
  
  // Cropping State
  const [isCropping, setIsCropping] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  
  // New Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName) return
    
    const slug = newCategoryName.toLowerCase().replace(/ /g, '-')
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName, slug }])
        .select()
        .single()
    
    if (error) {
        toast.error('Gagal membuat kategori: ' + error.message)
    } else {
        toast.success('Kategori berhasil dibuat')
        setCategories([...categories, data])
        setCategoryId(data.id.toString())
        setIsAddingCategory(false)
        setNewCategoryName('')
    }
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setTempImageSrc(reader.result?.toString() || null)
        setIsCropping(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSaveCroppedImage = async () => {
    if (!tempImageSrc || !croppedAreaPixels) return

    try {
        setUploading(true)
        const croppedImageBlob = await getCroppedImg(
            tempImageSrc,
            croppedAreaPixels,
            rotation
        )

        if (!croppedImageBlob) throw new Error('Could not create cropped image')

        const fileName = `${Math.random()}.jpg`
        const filePath = `materials/${fileName}`

        // Upload Blob
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, croppedImageBlob)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('images').getPublicUrl(filePath)
        setImageUrl(data.publicUrl)
        
        setIsCropping(false)
        setTempImageSrc(null)
        setZoom(1)
        setRotation(0)
        
        toast.success('Gambar berhasil diproses dan diunggah')
    } catch (error: any) {
        toast.error('Gagal memproses gambar: ' + error.message)
    } finally {
        setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryId) {
        toast.error('Pilih kategori terlebih dahulu')
        return
    }

    setLoading(true)

    try {
        const { error } = await supabase.from('materials').insert({
            title,
            category_id: parseInt(categoryId),
            arabic_text: arabicText,
            translation,
            reading,
            example_sentence: exampleSentence,
            example_reading: exampleReading,
            example_meaning: exampleMeaning,
            example_sentence_2: exampleSentence2,
            example_reading_2: exampleReading2,
            example_meaning_2: exampleMeaning2,
            image_url: imageUrl,
            is_published: true
        })

        if (error) throw error

        toast.success('Materi berhasil disimpan!')
        router.push('/admin/materials')
    } catch (error: any) {
        toast.error('Gagal menyimpan: ' + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Cropper Modal */}
      {isCropping && tempImageSrc && (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Sesuaikan Gambar</h3>
                      <button onClick={() => setIsCropping(false)} className="text-gray-500 hover:text-gray-900">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="relative w-full h-80 bg-gray-900">
                      <Cropper
                          image={tempImageSrc}
                          crop={crop}
                          zoom={zoom}
                          rotation={rotation}
                          aspect={1} // Force 1:1 aspect ratio
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          onRotationChange={setRotation}
                      />
                  </div>

                  <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-gray-500">
                            <span className="flex items-center gap-1"><ZoomIn size={14}/> Zoom</span>
                            <span>{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e76f51]"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-gray-500">
                            <span className="flex items-center gap-1"><RotateCw size={14}/> Rotasi</span>
                            <span>{rotation}°</span>
                        </div>
                        <input
                            type="range"
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e76f51]"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => setIsCropping(false)}
                            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                          >
                             Batal
                          </button>
                          <button
                            onClick={handleSaveCroppedImage}
                            disabled={uploading}
                            className="flex-1 py-2.5 bg-[#e76f51] rounded-xl text-white font-medium hover:bg-[#d05d40] transition-colors flex items-center justify-center gap-2"
                          >
                             {uploading ? <Loader2 className="animate-spin" size={18} /> : 'Simpan & Upload'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <div className="mb-6">
        <Link href="/admin/materials" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft size={16} /> Kembali ke Daftar
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Tambah Materi Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center">
                <div className={cn(
                    "w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden",
                    imageUrl ? "border-green-300 bg-green-50" : "border-gray-300 hover:bg-gray-50"
                )}>
                    {imageUrl ? (
                        <>
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                            <button 
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </>
                    ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            <Upload className="text-gray-400 mb-2" size={32} />
                            <span className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</span>
                            <span className="text-xs text-gray-400 mt-1">Disarankan ukuran 500x500px (1:1), Maks 2MB</span>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={onSelectFile}
                                disabled={uploading}
                            />
                        </label>
                    )}
                    
                    {uploading && !isCropping && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                            <Loader2 className="animate-spin text-[#e76f51]" size={32} />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Materi</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-gray-900 placeholder-gray-400"
                        placeholder="Contoh: Buah-buahan"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <div className="flex gap-2">
                        <select 
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-gray-900"
                            required
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <button 
                            type="button"
                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {isAddingCategory && (
                     <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 flex gap-2 items-end animate-in fade-in slide-in-from-top-2">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-orange-800 mb-1">Nama Kategori Baru</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-orange-200 focus:border-orange-500 outline-none text-sm"
                                placeholder="Misal: Hewan"
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={handleCreateCategory}
                            className="bg-[#e76f51] hover:bg-[#d05d40] text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Simpan
                        </button>
                     </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Teks Arab</label>
                        <input 
                            type="text" 
                            dir="rtl"
                            value={arabicText}
                            onChange={(e) => setArabicText(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none font-arabic text-xl text-gray-900 placeholder-gray-400"
                            placeholder="تفاحة"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Arti Kata</label>
                        <input 
                            type="text" 
                            value={translation}
                            onChange={(e) => setTranslation(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-gray-900 placeholder-gray-400"
                            placeholder="Apel"
                            required
                        />
                    </div>
                    
                    <div className="md:col-span-2">
                         <label className="block text-sm font-medium text-gray-700 mb-2">Cara Baca (Transliterasi)</label>
                         <input 
                            type="text" 
                            value={reading}
                            onChange={(e) => setReading(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none font-medium text-gray-900 placeholder-gray-400"
                            placeholder="Contoh: Tuffāḥatun"
                        />
                    </div>

                    {/* Example 1 */}
                    <div className="md:col-span-2 border-t border-dashed border-gray-200 pt-4 mt-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-4">Contoh Penggunaan 1</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Kalimat Arab</label>
                                 <input 
                                    type="text" 
                                    dir="rtl"
                                    value={exampleSentence}
                                    onChange={(e) => setExampleSentence(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none font-arabic text-lg text-gray-900 placeholder-gray-400"
                                    placeholder="أَكَلْتُ تُفَّاحَةً لَذِيْذَةً"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Cara Baca</label>
                                 <input 
                                    type="text" 
                                    value={exampleReading}
                                    onChange={(e) => setExampleReading(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-sm text-gray-900 placeholder-gray-400"
                                    placeholder="Akaltu tuffāḥatan laḏīḏah"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Arti Kalimat</label>
                                <textarea 
                                    value={exampleMeaning}
                                    onChange={(e) => setExampleMeaning(e.target.value)}
                                    rows={1}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none resize-none text-gray-900 placeholder-gray-400"
                                    placeholder="Saya makan apel yang lezat"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className="md:col-span-2 border-t border-dashed border-gray-200 pt-4 mt-2">
                        <label className="block text-sm font-semibold text-gray-800 mb-4">Contoh Penggunaan 2</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Kalimat Arab</label>
                                 <input 
                                    type="text" 
                                    dir="rtl"
                                    value={exampleSentence2}
                                    onChange={(e) => setExampleSentence2(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none font-arabic text-lg text-gray-900 placeholder-gray-400"
                                    placeholder="Contoh kalimat kedua..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Cara Baca</label>
                                <input 
                                    type="text" 
                                    value={exampleReading2}
                                    onChange={(e) => setExampleReading2(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none text-sm text-gray-900 placeholder-gray-400"
                                    placeholder="Cara baca contoh 2"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Arti Kalimat</label>
                                <textarea 
                                    value={exampleMeaning2}
                                    onChange={(e) => setExampleMeaning2(e.target.value)}
                                    rows={1}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none resize-none text-gray-900 placeholder-gray-400"
                                    placeholder="Arti contoh kalimat 2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="bg-[#e76f51] hover:bg-[#d05d40] text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Simpan Materi</>}
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
