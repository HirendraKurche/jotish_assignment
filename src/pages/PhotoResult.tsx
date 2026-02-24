import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Home } from "lucide-react";

export default function PhotoResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const { image, employee } = location.state || {};

    if (!image || !employee) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
                <h2 className="text-xl font-semibold text-slate-800">No Aura Scan Found</h2>
                <button
                    onClick={() => navigate("/list")}
                    className="px-6 py-2 bg-jotish text-black font-bold rounded-full"
                >
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-900 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] font-sans text-white overflow-hidden">
            <header className="border-b border-white/10 px-4 h-16 flex items-center shrink-0 bg-black/50 backdrop-blur-md">
                <button
                    onClick={() => navigate("/list")}
                    className="flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" /> Dashboard
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-evenly p-4 min-h-0">
                <div className="text-center shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-jotish drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                        Aura Reading
                    </h1>
                    <p className="text-slate-400 mt-1 sm:mt-2 text-sm sm:text-base font-medium tracking-wide">Analysis complete for {employee.employee_name}</p>
                </div>

                {/* Tarot Card / Kundli Chart Frame */}
                <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm bg-[#FFF9E6] p-3 pb-10 sm:p-4 sm:pb-12 rounded-xl border-8 border-double border-orange-400 shadow-[0_0_50px_rgba(255,165,0,0.3)] rotate-1 hover:rotate-0 transition-transform duration-500 shrink min-h-0 flex flex-col">

                    {/* Decorative Corner Elements */}
                    <div className="absolute top-2 left-2 text-orange-400 opacity-60">✺</div>
                    <div className="absolute top-2 right-2 text-orange-400 opacity-60">✺</div>
                    <div className="absolute bottom-2 left-2 text-orange-400 opacity-60">✺</div>
                    <div className="absolute bottom-2 right-2 text-orange-400 opacity-60">✺</div>

                    <div className="text-center text-orange-800 font-bold tracking-widest text-xs sm:text-sm mb-2 sm:mb-3 border-b border-orange-200 pb-1.5 sm:pb-2 shrink-0">
                        THE SEEKER
                    </div>

                    <div className="aspect-[3/4] w-full bg-black rounded-sm border-2 border-orange-800 overflow-hidden relative shadow-inner min-h-0">
                        {/* Captured Image */}
                        <img
                            src={image}
                            alt="Aura snapshot"
                            className="w-full h-full object-cover filter contrast-125 saturate-[1.2] sepia-[0.3] hue-rotate-[-10deg]"
                        />

                        {/* Soft mystical overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/30 to-purple-500/20 mix-blend-overlay"></div>
                    </div>

                    <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 text-center shrink-0">
                        <span className="font-serif italic text-xl sm:text-2xl text-orange-900 font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
                            Destiny Awaits
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-sm shrink-0 mt-4 sm:mt-6 z-10 relative">
                    <button
                        onClick={() => navigate("/details", { state: { employee } })}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-colors text-sm sm:text-base"
                    >
                        <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" /> Retake
                    </button>

                    <button
                        onClick={() => {
                            localStorage.setItem(`aura_${employee.employee_id}`, image);
                            navigate("/details", { state: { employee } });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow-lg transition-colors text-sm sm:text-base"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                        Save Profile
                    </button>

                    <button
                        onClick={() => navigate("/list")}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-jotish text-black font-black hover:bg-yellow-400 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-colors text-sm sm:text-base"
                    >
                        <Home className="h-4 w-4 sm:h-5 sm:w-5" /> Home
                    </button>
                </div>
            </main>
        </div>
    );
}
