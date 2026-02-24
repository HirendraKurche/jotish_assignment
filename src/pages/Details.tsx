import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { ArrowLeft, User, MapPin } from "lucide-react";

const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
};

export default function Details() {
    const location = useLocation();
    const navigate = useNavigate();
    const webcamRef = useRef<Webcam>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const employee = location.state?.employee;

    if (!employee) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
                <h2 className="text-xl font-semibold text-slate-800">No Astrologer Selected</h2>
                <button
                    onClick={() => navigate("/list")}
                    className="px-6 py-2 bg-jotish text-black font-bold rounded-full hover:bg-yellow-400 transition-colors"
                >
                    Back to List
                </button>
            </div>
        );
    }

    const savedAura = localStorage.getItem(`aura_${employee.employee_id}`);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                navigate("/photo-result", { state: { image: imageSrc, employee } });
            }
        }
    }, [webcamRef, navigate, employee]);

    return (
        <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
            <header className="bg-white border-b shrink-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-black font-medium transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" /> Back
                    </button>
                    <h1 className="text-xl font-bold text-slate-800 tracking-wide">Aura Scanner</h1>
                    <div className="w-16" /> {/* spacer for centering */}
                </div>
            </header>

            <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 flex flex-col items-center justify-evenly">
                {/* Astrologer Details Card */}
                <div className="w-full bg-white rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-4 shrink-0">
                    <div className="h-16 w-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center border-2 border-jotish/30 overflow-hidden shrink-0">
                        {savedAura ? (
                            <img src={savedAura} alt="Saved Aura" className="w-full h-full object-cover filter contrast-125 saturate-[1.2] sepia-[0.3]" />
                        ) : (
                            <User className="h-8 w-8 text-amber-600" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900">{employee.employee_name}</h2>
                        <div className="flex items-center text-sm text-slate-500 mt-1 font-medium gap-1">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            {employee.city || "Unknown Location"}
                        </div>
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                            ₹{Number(employee.employee_salary).toLocaleString()} / session
                        </div>
                    </div>
                </div>

                {/* Aura Scanner UI */}
                <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0">
                    <div className="text-center mb-4 shrink-0">
                        <h3 className="text-lg font-bold text-slate-800">Scan Your Aura</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Position your face in the center of the ring</p>
                    </div>

                    {!isCameraActive ? (
                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex flex-col items-center justify-center shrink-0">
                            <div className="absolute inset-0 rounded-full border-4 border-dashed border-slate-300"></div>
                            <button
                                onClick={() => setIsCameraActive(true)}
                                className="relative z-10 px-8 py-3 bg-black text-white font-bold rounded-full shadow-xl hover:-translate-y-1 transition-transform"
                            >
                                Enable Camera
                            </button>
                        </div>
                    ) : (
                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6 flex flex-col items-center justify-center shrink-0">
                            {/* Spinning, glowing golden border */}
                            <div
                                className="absolute inset-[-8px] rounded-full animate-spin bg-gradient-to-r from-transparent via-jotish to-orange-500 shadow-[0_0_30px_rgba(255,215,0,0.8)]"
                                style={{ animationDuration: "3s" }}
                            ></div>

                            <div className="absolute inset-[-4px] rounded-full bg-slate-50"></div>

                            {/* Strict Circular Webcam Feed */}
                            <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-black shadow-inner">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="w-full h-full object-cover scale-x-[-1]" // mirror the video
                                />
                            </div>
                        </div>
                    )}

                    {isCameraActive && (
                        <button
                            onClick={capture}
                            className="w-full max-w-[260px] py-3.5 mt-2 bg-jotish text-black font-black text-lg rounded-full shadow-[0_10px_25px_rgba(255,215,0,0.4)] hover:shadow-[0_15px_35px_rgba(255,215,0,0.6)] hover:-translate-y-1 transition-all active:scale-95 shrink-0"
                        >
                            Scan & Capture Photo
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
