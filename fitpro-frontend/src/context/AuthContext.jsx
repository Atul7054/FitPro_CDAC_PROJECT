import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from local storage
        const storedUser = localStorage.getItem('fitpro_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            // NEW LOGIC: Read the JSON response
            const { token, role } = response.data;

            if (token) {
                // 1. Save Token to LocalStorage
                localStorage.setItem('fitpro_token', token);

                const userData = { email, role, id: null };

                // 2. If Member, fetch their ID
                if (role === 'MEMBER') {
                    try {
                        // Note: This API call now works because axios.js adds the token!
                        const membersRes = await api.get('/members');
                        const myProfile = membersRes.data.find(m => m.user?.email === email);
                        if (myProfile) userData.id = myProfile.id;
                    } catch (err) {
                        console.error("Could not fetch member ID", err);
                    }
                }

                // 3. Update State
                setUser(userData);
                localStorage.setItem('fitpro_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: 'Invalid Response from Server' };
            }
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: 'Invalid Credentials or Server Error' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fitpro_user');
        localStorage.removeItem('fitpro_token'); // Clear token on logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);