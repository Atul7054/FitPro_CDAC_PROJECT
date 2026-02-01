import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // 👈 Added Link here
import { Form, Button, Card, Container } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [creds, setCreds] = useState({ email: '', password: '' });
    
    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(creds.email, creds.password);
        
        if (result.success) {
            const storedUser = JSON.parse(localStorage.getItem('fitpro_user'));
            
            if (storedUser.role === 'ADMIN') {
                navigate('/admin');
            } else if (storedUser.role === 'TRAINER') {
                navigate('/trainer');
            } else {
                navigate('/dashboard');
            }
        } else {
            alert(result.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <Card className="bg-dark border-secondary p-4 w-100 shadow-lg" style={{maxWidth: '400px'}}>
                <Card.Body>
                    <h2 className="text-center text-white fw-bold mb-2">Welcome Back</h2>
                    <p className="text-center text-secondary mb-4">Access your dashboard</p>
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="email" 
                                placeholder="Email" 
                                required 
                                className="bg-dark text-white border-secondary"
                                value={creds.email}
                                onChange={e => setCreds({...creds, email: e.target.value})} 
                            />
                        </Form.Group>

                        {/* Password Group */}
                        <Form.Group className="mb-2 position-relative"> {/* Changed mb-4 to mb-2 for spacing */}
                            <Form.Control 
                                type={showPassword ? "text" : "password"}
                                placeholder="Password" 
                                required 
                                className="bg-dark text-white border-secondary"
                                style={{ paddingRight: '45px' }}
                                value={creds.password}
                                onChange={e => setCreds({...creds, password: e.target.value})} 
                            />
                            
                            {/* Eye Icon Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn position-absolute top-50 end-0 translate-middle-y text-secondary border-0"
                                style={{ zIndex: 5, paddingRight: '12px' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </Form.Group>

                        {/* 👇 ADDED FORGOT PASSWORD LINK HERE */}
                        <div className="d-flex justify-content-end mb-4">
                            <Link 
                                to="/forgot-password" 
                                className="text-decoration-none small"
                                style={{ color: '#ffc107' }} // Gold color
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button variant="gold" type="submit" className="w-100 py-2 fw-bold">Login</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;