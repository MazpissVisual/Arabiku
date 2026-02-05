'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

const TUTORIAL_STEPS = [
    {
        title: "Menu Utama",
        description: "Selamat Datang di Arabiku! Ini adalah halaman utama tempat kamu memulai petualangan belajar bahasa Arab. Ada tiga menu utama yang bisa kamu pilih.",
        image: "/tutorial-home2.png",
    },
    {
        title: "Materi Belajar",
        description: "Di menu ini, kamu bisa memilih berbagai kategori kata seperti Angka, Warna, dan Hewan. Klik salah satu untuk mulai menghafal kosakata baru!",
        image: "/tutorial-materials2.png",
    },
    {
        title: "Mengenal Kosakata",
        description: "Pelajari kata secara detail! Kamu bisa klik kartu untuk membalik dan melihat artinya, serta mendengarkan cara pengucapannya yang benar.",
        image: "/tutorial-detail2.png",
    },
    {
        title: "Latihan & Quiz",
        description: "Uji hafalanmu dengan Quiz interaktif! Jawab pertanyaan dengan benar untuk mendapatkan skor tertinggi. Semakin sering berlatih, semakin mahir!",
        image: "/tutorial-quiz2.png",
    },
    {
        title: "Hasil Score",
        description: "Hore! Setelah selesai Quiz, kamu bisa melihat skor yang kamu dapatkan. Jangan lupa untuk terus belajar sampai dapat skor 100 terus ya!",
        image: "/tutorial-result2.png",
    }
];

export default function TutorialPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const nextStep = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push('/');
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!mounted) {
        return <div className="min-h-screen w-full bg-[#8D6E63]"></div>;
    }

    const currentData = TUTORIAL_STEPS[currentStep];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 py-8 md:py-12 relative bg-[url('/bg-main.jpg')] bg-cover bg-center bg-no-repeat overflow-y-auto font-fredoka">
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>

            <main className="relative z-10 flex flex-col items-center w-full max-w-2xl gap-3 responsive-tutorial-scale transform transition-all">
                
                {/* Header Board / Title */}
                <div className="relative mb-[-20px] z-20">
                    <div className="bg-[#8D6E63] border-4 border-[#5D4037] px-8 py-2 rounded-2xl shadow-[0_6px_0_#3E2723]">
                        <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md tracking-wide uppercase">
                            {currentData.title}
                        </h1>
                    </div>
                </div>

                {/* Main Content Box (Papan Tulis / Wood Frame) */}
                <div className="w-full bg-[#A1887F] p-4 md:p-5 rounded-[2.5rem] border-8 border-[#5D4037] shadow-[0_12px_0_#3E2723] flex flex-col gap-3">
                    
                    {/* Inner Screenshot Box - Optimized for "Full" look */}
                    <div className="w-full aspect-video bg-transparent rounded-2xl border-4 border-[#8D6E63] overflow-hidden relative">
                        <Image 
                            src={currentData.image} 
                            alt={currentData.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Explanation Text Box - Balanced min-height */}
                    <div className="bg-[#FFF9C4] p-4 md:p-5 rounded-2xl border-4 border-[#FBC02D] shadow-inner min-h-[100px] flex items-center justify-center">
                        <p className="text-[#5D4037] text-lg md:text-xl font-bold text-center leading-relaxed">
                            {currentData.description}
                        </p>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex w-full gap-4 mt-2">
                    {currentStep > 0 && (
                        <button 
                            onClick={prevStep}
                            className="flex-1 relative group transform active:scale-95 transition-all"
                        >
                            <div className="absolute inset-0 bg-[#D32F2F] rounded-2xl translate-y-1.5"></div>
                            <div className="absolute inset-0 bg-[#F44336] rounded-2xl translate-y-1 border-b-6 border-[#D32F2F]"></div>
                            <div className="relative bg-white p-3 rounded-xl border-2 border-white flex items-center justify-center gap-2 group-hover:bg-[#FFEBEE]">
                                <ChevronLeft className="text-[#D32F2F]" size={20} />
                                <span className="text-[#D32F2F] font-black text-lg uppercase tracking-tighter">Kembali</span>
                            </div>
                        </button>
                    )}

                    <button 
                        onClick={nextStep}
                        className="flex-[1.5] relative group transform active:scale-95 transition-all"
                    >
                        <div className="absolute inset-0 bg-[#E65100] rounded-2xl translate-y-1.5 text-white"></div>
                        <div className="absolute inset-0 bg-[#FBC02D] rounded-2xl translate-y-1 border-b-6 border-[#E65100]"></div>
                        <div className="relative bg-white p-3 rounded-xl border-2 border-white flex items-center justify-center gap-2 group-hover:bg-[#FFFDE7]">
                            <span className="text-[#E65100] font-black text-lg uppercase tracking-tighter">
                                {currentStep === TUTORIAL_STEPS.length - 1 ? 'Selesai' : 'Selanjutnya'}
                            </span>
                            {currentStep < TUTORIAL_STEPS.length - 1 && <ChevronRight className="text-[#E65100]" size={20} />}
                        </div>
                    </button>
                </div>

                {/* Close Button Top-Right of Main Box */}
                <button 
                    onClick={() => router.push('/')}
                    className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-12 h-12 bg-[#F44336] border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-90 transition-all z-30"
                >
                    <X size={28} strokeWidth={3} />
                </button>

            </main>
        </div>
    );
}
