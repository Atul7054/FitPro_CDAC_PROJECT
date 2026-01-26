import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TrainerDashboard from './pages/TrainerDashboard'; // 1. IMPORT THIS
import Settings from './pages/Settings';

// Protected Route Wrapper
const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    
    // Logic: If a role is required (e.g. "ADMIN") and user doesn't have it, kick them out.
    if (role && user.role !== role) return <Navigate to="/" />;
    
    return children;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* MEMBER DASHBOARD */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute role="MEMBER">
                                <MemberDashboard />
                            </ProtectedRoute>
                        } />

                        {/* TRAINER DASHBOARD (New Route) */}
                        <Route path="/trainer" element={
                            <ProtectedRoute role="TRAINER">
                                <TrainerDashboard />
                            </ProtectedRoute>
                        } />

                        {/* ADMIN DASHBOARD */}
                        <Route path="/admin" element={
                            <ProtectedRoute role="ADMIN">
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />

                        {/* SETTINGS PAGE (Accessible by Member & Trainer) */}
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;