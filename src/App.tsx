import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Login from "./pages/Login";
import List from "./pages/List";
import Details from "./pages/Details";
import PhotoResult from "./pages/PhotoResult";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/list" element={<List />} />
          <Route path="/details" element={<Details />} />
          <Route path="/photo-result" element={<PhotoResult />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App;
