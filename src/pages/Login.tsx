import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "testuser" && password === "Test123") {
            navigate("/list");
        } else {
            toast({
                variant: "destructive",
                title: "Authentication Failed",
                description: "Invalid username or password. Please try again.",
            });
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
            <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-xl border-white/20">
                <CardHeader className="space-y-1 text-center pb-8">
                    <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</CardTitle>
                    <CardDescription className="text-slate-500">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="username"
                                    placeholder="testuser"
                                    className="pl-9 bg-white/50"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9 bg-white/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-6">
                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 transition-all font-semibold rounded-lg h-11 shadow-md hover:shadow-lg">
                            Sign In
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
