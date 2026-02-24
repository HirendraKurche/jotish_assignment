import { useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Camera, MapPin, UserSquare2 } from "lucide-react";

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
                <h2 className="text-xl font-semibold text-slate-800">No Employee Selected</h2>
                <Button onClick={() => navigate("/list")}>Back to List</Button>
            </div>
        );
    }

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                navigate("/photo-result", { state: { image: imageSrc, employee } });
            }
        }
    }, [webcamRef, navigate, employee]);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 px-2" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" /> Back
                    </Button>
                    <h1 className="text-lg font-bold text-slate-800 hidden md:block">Employee Profile</h1>
                    <div className="w-[88px]" />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                <Card className="shadow-lg border-white border-2">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
                                <UserSquare2 className="h-10 w-10" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-slate-800">{employee.employee_name}</CardTitle>
                                <CardDescription className="text-base flex items-center gap-1.5 mt-1 text-slate-500">
                                    <MapPin className="h-4 w-4" /> {employee.city || "Unknown City"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6 p-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-500">ID</p>
                            <p className="text-lg font-semibold text-slate-900">{employee.employee_id}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-500">Age</p>
                            <p className="text-lg font-semibold text-slate-900">{employee.employee_age} years</p>
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <p className="text-sm font-medium text-slate-500">Salary</p>
                            <p className="text-lg font-semibold text-slate-900">${Number(employee.employee_salary).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-white border-2 overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Camera className="h-5 w-5 text-indigo-500" />
                            Capture Photo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col items-center gap-6">
                        {!isCameraActive ? (
                            <div className="w-full aspect-video bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 text-slate-500">
                                <Camera className="h-12 w-12 text-slate-300" />
                                <p>Camera is currently inactive</p>
                                <Button variant="outline" onClick={() => setIsCameraActive(true)} className="bg-white">
                                    Enable Camera
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-inner bg-black relative">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={videoConstraints}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {isCameraActive && (
                            <Button
                                onClick={capture}
                                size="lg"
                                className="w-full max-w-sm h-14 rounded-full text-lg shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Camera className="mr-2 h-6 w-6" /> Take Snapshot
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
