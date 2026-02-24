import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map as MapIcon, BarChart as ChartIcon } from "lucide-react";

// Fix Leaflet marker icon issue with Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

interface Employee {
    employee_id: string;
    employee_name: string;
    employee_salary: string | number;
    employee_age: string | number;
    city: string;
}

const FALLBACK_CITIES: Record<string, [number, number]> = {
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.7041, 77.1025],
    Bangalore: [12.9716, 77.5946],
    Chennai: [13.0827, 80.2707],
    Pune: [18.5204, 73.8567],
    Hyderabad: [17.3850, 78.4867],
    Kolkata: [22.5726, 88.3639],
    Ahmedabad: [23.0225, 72.5714],
};

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

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#0ea5e9'];

export default function Dashboard() {
    const [data, setData] = useState<Employee[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.post(
                    "https://backend.jotish.in/backend_dev/gettabledata.php",
                    { username: "test", password: "123456" },
                    { headers: { "Content-Type": "application/json" } }
                );
                let respData = response.data;
                if (typeof respData === 'string') {
                    try { respData = JSON.parse(respData); } catch (e) { }
                }
                const finalData = Array.isArray(respData) ? respData : respData?.data || respData?.employees;
                if (finalData && Array.isArray(finalData) && finalData.length > 0) {
                    setData(finalData.slice(0, 10));
                } else {
                    throw new Error("No array data");
                }
            } catch (error) {
                setData(MOCK_DATA.slice(0, 10));
            }
        };
        fetchStats();
    }, []);

    const chartData = data.map(emp => ({
        name: emp.employee_name.split(" ")[0],
        salary: Number(emp.employee_salary)
    }));

    const mapMarkers = data.map((emp) => {
        const coords = FALLBACK_CITIES[emp.city] || [20.5937, 78.9629];
        return {
            name: emp.employee_name,
            city: emp.city,
            coords,
        };
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 px-2" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" /> Back
                    </Button>
                    <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ChartIcon className="h-5 w-5 text-indigo-500" />
                        Analytics Dashboard
                    </h1>
                    <div className="w-[88px]" />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <Card className="shadow-lg border-white border-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <ChartIcon className="h-5 w-5 text-purple-500" />
                                Top Salaries
                            </CardTitle>
                            <CardDescription>Salary distribution for the top employees</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: '#64748b' }}
                                            axisLine={false}
                                            tickLine={false}
                                            angle={-45}
                                            textAnchor="end"
                                        />
                                        <YAxis
                                            tick={{ fill: '#64748b' }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Salary']}
                                        />
                                        <Bar dataKey="salary" radius={[4, 4, 0, 0]}>
                                            {chartData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-white border-2 overflow-hidden flex flex-col">
                        <CardHeader className="pb-2 z-10 bg-white">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <MapIcon className="h-5 w-5 text-emerald-500" />
                                Employee Locations
                            </CardTitle>
                            <CardDescription>Geographical distribution across cities</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 min-h-[400px]">
                            <MapContainer
                                center={[21.1458, 79.0882]}
                                zoom={4.5}
                                scrollWheelZoom={false}
                                className="h-full w-full z-0"
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />
                                {mapMarkers.map((marker, idx) => (
                                    <Marker key={idx} position={marker.coords as [number, number]}>
                                        <Popup className="rounded-lg shadow-sm">
                                            <div className="font-semibold text-slate-800">{marker.name}</div>
                                            <div className="text-slate-500 text-sm">{marker.city}</div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
