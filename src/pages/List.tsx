import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, BarChart3 } from "lucide-react";

interface Employee {
    employee_id: string;
    employee_name: string;
    employee_salary: string | number;
    employee_age: string | number;
    city: string;
}

const MOCK_DATA: Employee[] = [
    { employee_id: "1", employee_name: "Tiger Nixon", employee_salary: 320800, employee_age: 61, city: "Mumbai" },
    { employee_id: "2", employee_name: "Garrett Winters", employee_salary: 170750, employee_age: 63, city: "Delhi" },
    { employee_id: "3", employee_name: "Ashton Cox", employee_salary: 86000, employee_age: 66, city: "Bangalore" },
    { employee_id: "4", employee_name: "Cedric Kelly", employee_salary: 433060, employee_age: 22, city: "Chennai" },
    { employee_id: "5", employee_name: "Airi Satou", employee_salary: 162700, employee_age: 33, city: "Pune" },
    { employee_id: "6", employee_name: "Brielle Williamson", employee_salary: 372000, employee_age: 61, city: "Hyderabad" },
    { employee_id: "7", employee_name: "Herrod Chandler", employee_salary: 137500, employee_age: 59, city: "Kolkata" },
    { employee_id: "8", employee_name: "Rhona Davidson", employee_salary: 327900, employee_age: 55, city: "Ahmedabad" },
];

export default function List() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(
                    "https://backend.jotish.in/backend_dev/gettabledata.php",
                    { username: "test", password: "123456" },
                    { headers: { "Content-Type": "application/json" } }
                );

                // Use response data properly
                let data = response.data;
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (e) { }
                }

                const finalData = Array.isArray(data) ? data : data?.data || data?.employees;
                if (finalData && Array.isArray(finalData) && finalData.length > 0) {
                    setEmployees(finalData);
                } else {
                    throw new Error("No data returned from API");
                }
            } catch (error) {
                console.warn("API failed, using mock data:", error);
                toast({
                    title: "API Status",
                    description: "Used fallback mock data because the remote API request failed.",
                    variant: "destructive",
                });
                setEmployees(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    return (
        <div className="min-h-screen bg-white relative pb-20 font-sans">
            <header className="bg-jotish border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Simple Hamburger icon for app-feel */}
                        <button
                            onClick={() => {
                                toast({
                                    title: "Menu",
                                    description: "Navigation menu coming soon.",
                                });
                            }}
                            className="p-1.5 hover:bg-black/10 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                        </button>
                        <h1 className="text-2xl font-black tracking-widest flex items-center text-black">
                            JØTISH
                        </h1>
                    </div>
                    <Button
                        onClick={() => navigate("/")}
                        variant="ghost"
                        className="text-black hover:bg-black/10 font-medium rounded-full"
                    >
                        Sign Out
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Live Astrologers</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <Skeleton className="h-28 w-28 rounded-full mb-3 shadow-md" />
                                <Skeleton className="h-4 w-24 mb-1" />
                                <Skeleton className="h-3 w-16 mb-1" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                        {employees.map((emp, idx) => {
                            // Extract first name for shorter UI
                            const shortName = emp.employee_name.split(' ').slice(0, 2).join(' ');
                            const savedAura = localStorage.getItem(`aura_${emp.employee_id}`);
                            return (
                                <div
                                    key={emp.employee_id || idx}
                                    className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-2 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-50 hover:shadow-[0_8px_30px_rgba(255,215,0,0.2)]"
                                    onClick={() => navigate("/details", { state: { employee: emp } })}
                                >

                                    <div className="relative mb-4">
                                        <div className={`h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center ${savedAura ? '' : 'p-2 pt-6'} bg-gradient-to-b from-orange-50 to-orange-100 shrink-0`}>
                                            {savedAura ? (
                                                <img src={savedAura} alt={shortName} className="w-full h-full object-cover filter contrast-125 saturate-[1.2] sepia-[0.3]" />
                                            ) : (
                                                <User className="h-16 w-16 text-slate-300" />
                                            )}
                                        </div>
                                        {/* Pulsing red dot for "Online / Live" */}
                                        <div className="absolute bottom-2 right-2 flex items-center justify-center">
                                            <div className="h-4 w-4 bg-red-500 rounded-full border-2 border-white relative z-10 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
                                            <div className="h-4 w-4 bg-red-500 rounded-full absolute animate-ping opacity-75"></div>
                                        </div>
                                    </div>

                                    <div className="text-center w-full">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight mb-1 group-hover:text-amber-600 transition-colors">
                                            {shortName}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500 mb-0.5 max-w-full truncate px-1">
                                            {emp.city || "India"}
                                        </p>
                                        <p className="text-xs font-bold text-slate-700 mt-1 inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full">
                                            ₹{Number(emp.employee_salary).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>

            <button
                onClick={() => navigate("/dashboard")}
                className="fixed bottom-8 right-8 bg-amber-500 text-black font-bold p-4 rounded-full shadow-lg hover:shadow-amber-500/50 hover:bg-amber-400 transition-all duration-300 flex items-center justify-center group z-50 hover:scale-105 active:scale-95"
                aria-label="Analytics & Map"
                title="Analytics & Map"
            >
                <BarChart3 className="h-6 w-6 group-hover:hidden" />
                <span className="hidden group-hover:flex items-center gap-2 px-2">
                    <BarChart3 className="h-5 w-5" />
                    Dashboard
                </span>
            </button>
        </div>
    );
}
