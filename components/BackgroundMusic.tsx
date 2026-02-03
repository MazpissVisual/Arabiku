'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { VolumeX, Volume2 } from 'lucide-react'

export default function BackgroundMusic() {
  const [isMount, setIsMount] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false) // New state to track if browser blocked autoplay
  
  // Ref to track if user explicitly turned it off.
  // We use Ref instead of State inside the effect to avoid unnecessary re-triggering of the effect
  // But we need State to re-render the button icon. 
  // Let's use State for UI updates and Ref for logic if needed, but simple State is fine.
  const [userPaused, setUserPaused] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const pathname = usePathname()

  const allowedPaths = ['/', '/materials', '/quizzes']
  const shouldPlay = allowedPaths.includes(pathname)

  useEffect(() => {
    setIsMount(true)
    const audio = new Audio('/main-music.MP3')
    audio.loop = true
    audio.volume = 0.2
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Auto-play Logic
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const attemptPlay = async () => {
        try {
            await audio.play()
            setIsPlaying(true)
            setIsBlocked(false)
        } catch (error) {
            console.log("Autoplay blocked, waiting for interaction")
            setIsPlaying(false)
            setIsBlocked(true)
        }
    }

    if (shouldPlay && !userPaused) {
        attemptPlay()
    } else {
        audio.pause()
        setIsPlaying(false)
    }
  }, [shouldPlay, userPaused])

  // Listener for first interaction (only if blocked)
  useEffect(() => {
      if (!isBlocked || !shouldPlay || userPaused) return

      const unlock = () => {
          const audio = audioRef.current
          if (audio) {
              audio.play()
                .then(() => {
                    setIsPlaying(true)
                    setIsBlocked(false)
                })
                .catch(e => console.error("Unlock failed", e))
          }
      }

      document.addEventListener('click', unlock, { once: true })
      document.addEventListener('touchstart', unlock, { once: true })

      return () => {
          document.removeEventListener('click', unlock)
          document.removeEventListener('touchstart', unlock)
      }
  }, [isBlocked, shouldPlay, userPaused])


  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      // PAUSE
      audio.pause()
      setIsPlaying(false)
      setUserPaused(true) // User explicitly turned it off
    } else {
      // PLAY
      // If we are here, it means user clicked the button, so interaction is guaranteed.
      audio.play()
        .then(() => {
            setIsPlaying(true)
            setUserPaused(false) // User turned it back on
            setIsBlocked(false) // Since user clicked, it's definitely unblocked now
        })
        .catch(e => console.error("Manual play failed", e))
    }
  }

  if (!isMount || !shouldPlay) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={toggleMusic}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 border-2 ${
          isPlaying 
            ? 'bg-white/90 text-[#e76f51] border-[#e76f51] animate-pulse-slow' 
            : 'bg-gray-200 text-gray-500 border-transparent'
        } hover:scale-110 active:scale-95`}
        title={isPlaying ? "Matikan Musik" : "Hidupkan Musik"}
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </div>
  )
}
