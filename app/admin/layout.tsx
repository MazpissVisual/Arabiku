'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  LogOut, 
  Menu, 
  X,
  User,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toaster } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && !pathname.includes('/login')) {
         router.push('/admin/login')
      } else {
         setUser(session?.user)
      }
      setLoading(false)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session && !pathname.includes('/login')) {
            router.push('/admin/login')
            setUser(null)
        } else {
            setUser(session?.user)
        }
    })

    return () => {
        authListener.subscription.unsubscribe()
    }
  }, [pathname, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // If we are on the login page, just render the children without the layout
  if (pathname === '/admin/login') {
      return (
        <>
            {children}
            <Toaster position="top-center" />
        </>
      )
  }

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e76f51]"></div>
          </div>
      )
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Materi Belajar', icon: BookOpen, href: '/admin/materials' },
    { name: 'Manajemen Kategori', icon: Layers, href: '/admin/categories' },
    { name: 'Kuis & Soal', icon: Gamepad2, href: '/admin/quizzes' },
  ]

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
            "fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-[#e76f51]">Arabiku Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            isActive 
                                ? "bg-[#e76f51]/10 text-[#e76f51]" 
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon size={20} />
                        {item.name}
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={16} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <LogOut size={20} />
                Keluar
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
            >
                <Menu size={20} />
            </button>
            <div className="flex items-center gap-4 ml-auto">
                {/* Search or Notifications could go here */}
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
            {children}
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  )
}
