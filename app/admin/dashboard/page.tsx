'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { BookOpen, Gamepad2, Layers } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    materials: 0,
    quizzes: 0,
    categories: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: materialsCount } = await supabase
            .from('materials')
            .select('*', { count: 'exact', head: true })

        const { count: quizzesCount } = await supabase
            .from('quizzes')
            .select('*', { count: 'exact', head: true })

        const { count: categoriesCount } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true })

        setStats({
            materials: materialsCount || 0,
            quizzes: quizzesCount || 0,
            categories: categoriesCount || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen size={24} />
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium">Total Materi</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? '...' : stats.materials}
                </p>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Gamepad2 size={24} />
            </div>
            <div>
                <h3 className="text-gray-500 text-sm font-medium">Total Kuis</h3>
                 <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? '...' : stats.quizzes}
                </p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                 <Layers size={24} />
            </div>
             <div>
                <h3 className="text-gray-500 text-sm font-medium">Total Kategori</h3>
                 <p className="text-3xl font-bold text-gray-800 mt-1">
                    {loading ? '...' : stats.categories}
                </p>
            </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-8 rounded-2xl border border-gray-100 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Selamat Datang di Arabiku Admin!</h2>
        <p className="text-gray-500">Silakan pilih menu di samping untuk mulai mengelola konten.</p>
      </div>
    </div>
  )
}
