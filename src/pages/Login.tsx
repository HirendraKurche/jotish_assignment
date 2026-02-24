import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (username === "testuser" && password === "Test123") {
            navigate("/list");
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black bg-[length:400%_400%] animate-gradient-x p-4 text-white relative">
            {/* Decorative starry background overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">

                {/* Placeholder JOTISH Logo */}
                <div className="flex flex-col items-center justify-center mb-10">
                    <div className="h-20 w-20 bg-black rounded-full border-2 border-jotish flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                        <span className="text-jotish font-black text-3xl tracking-tighter">JØ</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest drop-shadow-md flex items-center">
                        J<span className="text-jotish px-0.5">O</span>TISH
                    </h1>
                    <p className="text-sm text-slate-300 mt-2 font-light tracking-wide text-center">
                        Honest, accurate & private.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200 ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="testuser"
                                className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-jotish/50 text-white placeholder:text-slate-500 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-jotish/50 text-white placeholder:text-slate-500 transition-all font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-4 bg-jotish hover:bg-[#E5C100] text-black font-bold rounded-xl shadow-lg shadow-jotish/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-jotish/30 active:scale-95 text-lg"
                        >
                            Sign In
                        </button>
                        {error && (
                            <div className="mt-5 text-center px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                                <p className="text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">{error}</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
