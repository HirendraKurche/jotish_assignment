import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, BarChart3, User, ChevronRight } from "lucide-react";

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
        <div className="min-h-screen bg-slate-50 relative pb-20">
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <User className="h-6 w-6 text-indigo-500" />
                        Employee Directory
                    </h1>
                    <Button
                        onClick={() => navigate("/")}
                        variant="ghost"
                        className="text-slate-500 hover:text-slate-900"
                    >
                        Sign Out
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-slate-800">All Employees</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <CardHeader className="pb-4">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {employees.map((emp, idx) => (
                            <Card
                                key={emp.employee_id || idx}
                                className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-transparent hover:border-indigo-100 bg-white"
                                onClick={() => navigate("/details", { state: { employee: emp } })}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                            {emp.employee_name}
                                        </CardTitle>
                                        <div className="bg-slate-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                                        </div>
                                    </div>
                                    <CardDescription className="flex items-center gap-1.5 text-slate-500 mt-1">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {emp.city || "Unknown City"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-1 text-sm pt-2">
                                        <div className="flex justify-between items-center py-1 border-b border-slate-50">
                                            <span className="text-slate-500">Salary</span>
                                            <span className="font-medium text-slate-700">${Number(emp.employee_salary).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-slate-500">Age</span>
                                            <span className="font-medium text-slate-700">{emp.employee_age} yrs</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <button
                onClick={() => navigate("/dashboard")}
                className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-indigo-500/50 hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center group z-50 hover:scale-105 active:scale-95"
                aria-label="Analytics & Map"
                title="Analytics & Map"
            >
                <BarChart3 className="h-6 w-6 group-hover:hidden" />
                <span className="hidden group-hover:flex items-center gap-2 font-medium px-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Map
                </span>
            </button>
        </div>
    );
}
