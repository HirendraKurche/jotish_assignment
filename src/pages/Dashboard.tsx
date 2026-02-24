import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ArrowLeft, Map as MapIcon, BarChart as ChartIcon } from "lucide-react";

// Create a glowing white dot icon for the "stars"
const starIcon = L.divIcon({
    className: "custom-star-marker",
    html: `<div style="width: 12px; height: 12px; background: white; border-radius: 50%; box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
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
                    setData(finalData.slice(0, 10)); // Take first 10
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

    // Extract just the coordinates for the polyline to draw constellation lines
    const constellationLines = mapMarkers.map(m => m.coords as [number, number]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-black bg-[length:400%_400%] animate-gradient-x relative pb-12 text-white font-sans">
            {/* Decorative starry background overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

            <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/list")}
                        className="flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" /> Back
                    </button>
                    <h1 className="text-xl font-black text-jotish flex items-center gap-2 tracking-wide drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">
                        <ChartIcon className="h-5 w-5" />
                        Analytics Dashboard
                    </h1>
                    <div className="w-16" />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">

                    {/* Salary Bar Chart */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-jotish via-amber-400 to-orange-500"></div>
                        <div className="mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                <ChartIcon className="h-5 w-5 text-jotish" />
                                Earnings Overview
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Salary distribution (First 10 records)</p>
                        </div>

                        <div className="h-[400px] w-full mt-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#94a3b8', fontSize: 13 }}
                                        axisLine={false}
                                        tickLine={false}
                                        angle={-45}
                                        textAnchor="end"
                                    />
                                    <YAxis
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                        itemStyle={{ color: '#FFD700', fontWeight: 'bold' }}
                                        formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Salary']}
                                    />
                                    <Bar dataKey="salary" radius={[6, 6, 0, 0]}>
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill="#FFD700" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Constellation Map */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col relative w-full">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-jotish z-20"></div>
                        <div className="p-6 pb-4 bg-transparent z-10 relative">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white drop-shadow-md">
                                <MapIcon className="h-5 w-5 text-jotish" />
                                Network Constellation
                            </h2>
                            <p className="text-slate-300 text-sm mt-1">Geographical distribution of astrologers</p>
                        </div>

                        <div className="flex-1 min-h-[400px] relative z-0">
                            <MapContainer
                                center={[21.1458, 79.0882]} // Central India
                                zoom={4.5}
                                scrollWheelZoom={false}
                                className="h-full w-full absolute inset-0 bg-[#0f172a]/50"
                            >
                                {/* CartoDB Dark Matter */}
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />

                                {/* Constellation lines */}
                                {constellationLines.length > 1 && (
                                    <Polyline
                                        positions={constellationLines}
                                        pathOptions={{ color: 'rgba(255, 255, 255, 0.3)', weight: 1, dashArray: '5, 5' }}
                                    />
                                )}

                                {/* Star Markers */}
                                {mapMarkers.map((marker, idx) => (
                                    <Marker
                                        key={idx}
                                        position={marker.coords as [number, number]}
                                        icon={starIcon}
                                    >
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
