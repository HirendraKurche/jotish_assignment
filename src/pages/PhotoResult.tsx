import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, List } from "lucide-react";

export default function PhotoResult() {
    const location = useLocation();
    const navigate = useNavigate();

    const { image, employee } = location.state || {};

    if (!image || !employee) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
                <h2 className="text-xl font-semibold text-slate-800">No Photo Found</h2>
                <Button onClick={() => navigate("/list")}>Back to List</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="w-full max-w-sm bg-white p-5 pb-16 shadow-2xl shadow-black/10 rotate-2 hover:rotate-0 transition-all duration-500 ease-out border border-slate-200 relative">
                <div className="aspect-square w-full bg-slate-200 overflow-hidden mb-6 border border-slate-300 shadow-inner">
                    <img src={image} alt="Captured snapshot" className="w-full h-full object-cover filter contrast-125 saturate-50 sepia-[.2]" />
                </div>
                <div className="absolute bottom-6 left-0 right-0 text-center text-3xl text-slate-700" style={{ fontFamily: '"Caveat", "Brush Script MT", cursive' }}>
                    {employee.employee_name}
                </div>
            </div>

            <div className="flex gap-4 mt-16">
                <Button
                    variant="outline"
                    size="lg"
                    className="bg-white hover:bg-slate-50 h-12 px-6 rounded-full shadow-sm"
                    onClick={() => navigate("/details", { state: { employee } })}
                >
                    <RefreshCw className="mr-2 h-4 w-4" /> Retake
                </Button>
                <Button
                    size="lg"
                    className="bg-slate-900 hover:bg-slate-800 h-12 px-6 rounded-full shadow-lg shadow-slate-900/20"
                    onClick={() => navigate("/list")}
                >
                    <List className="mr-2 h-4 w-4" /> Directory
                </Button>
            </div>
        </div>
    );
}
