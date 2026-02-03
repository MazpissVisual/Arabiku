'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { toast } from 'sonner'
import { Lock, Mail, Key, Loader2, ArrowLeft } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Login berhasil!')
      router.push('/admin/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-orange-100">
        <div className="bg-[#e76f51] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200 via-orange-500 to-red-500"></div>
            <div className="relative z-10 text-white">
                <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Lock size={32} />
                </div>
                <h1 className="text-2xl font-bold">Admin Portal</h1>
                <p className="text-orange-100 text-sm mt-2">Masuk untuk mengelola konten Arabiku</p>
            </div>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail size={16} className="text-[#f4a261]" /> Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                        placeholder="admin@arabiku.com"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Key size={16} className="text-[#f4a261]" /> Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/20 outline-none transition-all text-gray-900 placeholder-gray-400"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#e76f51] hover:bg-[#d05d40] text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Masuk Dashboard'}
                </button>
            </form>

             <div className="mt-6 text-center">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#e76f51] transition-colors">
                    <ArrowLeft size={14} /> Kembali ke Beranda
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}
